// /app/api/enhance-idea/route.ts
// v1.2 – [Your Current Date] - Fetch latest prompt by task from DB
// ----------------------------------------------------------------------------
// POST  /api/enhance-idea
// Body: { idea: string; techStackHint?: string }
// Returns: { enhancedIdea: string; clarifyingQuestions: {question: string; suggestedAnswer: string}[] }
// ----------------------------------------------------------------------------

import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { supabase } from '@/lib/supabase-client'; // Import Supabase client

// Initialise OpenAI client ------------------------------------------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// Define the expected structure of the prompt fetched from the DB
interface PromptFromDB {
  template: string; // Matches the 'template' column in your DB
  model?: string; // Optional: if you want to fetch model too
  temperature?: number; // Optional: if you want to fetch temp too
  max_tokens?: number; // Optional: if you want to fetch tokens too
}

export async function POST(request: NextRequest) {
    try {
        console.log("[enhance-idea] ► endpoint hit");
        // ---------------------------------------------------------------- request parsing -----
        let body: { idea?: string; techStackHint?: string } = {};
        try {
            body = await request.json();
        } catch (err) {
            console.error("[enhance-idea] ✖ bad JSON", err);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { idea, techStackHint = "" } = body;

        // --- Input Validation ---
        if (!idea || idea.length < 10) {
            return NextResponse.json({ error: "Idea must be at least 10 characters long" }, { status: 400 });
        }
        if (!process.env.OPENAI_API_KEY) {
            console.error("[enhance-idea] ✖ OPENAI_API_KEY missing");
            return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
        }
        if (!supabase) {
             console.error("[enhance-idea] ✖ Supabase client not available");
             return NextResponse.json({ error: "Database connection not configured." }, { status: 500 });
        }

        // --- 2. Fetch Latest Prompt Template from Supabase by Task ---
        let fetchedPrompt: PromptFromDB | null = null;
        const taskName = "enhanceIdea"; // The 'task' value to look for in the 'prompts' table

        try {
            console.log(`[enhance-idea] ► Fetching latest prompt for task '${taskName}' from DB...`);
            const { data: promptData, error: promptError } = await supabase
                .from("prompts") // Your table name
                .select("template, model, temperature, max_tokens") // Select desired columns (template is essential)
                .eq("task", taskName) // Filter by the task name
                .order("created_at", { ascending: false }) // Get the newest first
                .limit(1) // We only want the latest one
                .maybeSingle(); // Fetch one row or null

            if (promptError) {
                console.error("[enhance-idea] ✖ Error fetching prompt from DB:", promptError);
                throw new Error("Could not retrieve prompt from database.");
            }
            if (!promptData?.template) { // Check if the essential 'template' field exists
                 console.error(`[enhance-idea] ✖ Prompt for task '${taskName}' not found or template is empty in DB`);
                 throw new Error(`Prompt template for task '${taskName}' not found or is empty.`);
            }

            fetchedPrompt = promptData as PromptFromDB; // Type assertion
            console.log("[enhance-idea] ► Successfully fetched latest prompt from DB");

        } catch (dbError: any) {
             console.error("[enhance-idea] ✖ Failed to load prompt configuration:", dbError.message);
             return NextResponse.json({ error: "Failed to load required prompt configuration." }, { status: 500 });
        }

        // --- 3. Build System Prompt using Fetched Template ---
        // IMPORTANT: Ensure your template in the DB uses these exact placeholders:
        // {{RAW_IDEA}} and {{OPTIONAL_HINTS}}
        const systemPrompt = fetchedPrompt.template
            .replace("{{RAW_IDEA}}", idea)
            .replace("{{OPTIONAL_HINTS}}", techStackHint || "None");

        // --- 4. Prepare OpenAI Parameters (Use fetched values or defaults) ---
        const model = fetchedPrompt.model || "gpt-4o"; // Default if not in DB row
        const temperature = fetchedPrompt.temperature ?? 0.7; // Default if null/undefined in DB row
        const max_tokens = fetchedPrompt.max_tokens || 900; // Default if not in DB row

        // Optional: Log the final prompt for debugging (be careful with sensitive data)
        // console.log(`[enhance-idea] ► Using Model: ${model}, Temp: ${temperature}, MaxTokens: ${max_tokens}`);
        // console.log("[enhance-idea] ► Final System Prompt:", systemPrompt.substring(0, 100) + "...");

        // --- Conditional API Call ---
        let aiResponseContent: string | null = null;

        if (model.startsWith("gpt-")) {
            console.log(`[enhance-idea] ► calling OpenAI with model ${model}`);
            if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API Key missing");
            const completion = await openai.chat.completions.create({
                model: model,
                temperature: temperature,
                max_tokens: max_tokens,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Respond with JSON only." }
                ],
            });
            aiResponseContent = completion.choices[0]?.message?.content;

        } else if (model.startsWith("gemini-")) {
            console.log(`[enhance-idea] ► calling Gemini with model ${model}`);
            if (!process.env.GOOGLE_GEMINI_API_KEY) throw new Error("Gemini API Key missing");

            // Gemini API call structure is different
            const geminiModel = genAI.getGenerativeModel({ model: model });
            const generationConfig = {
                temperature: temperature,
                // maxOutputTokens: max_tokens, // Gemini uses maxOutputTokens
                responseMimeType: "application/json", // Request JSON output
            };

            // Construct prompt suitable for Gemini (might need adjustment)
            const promptForGemini = `${systemPrompt}\n\nRespond with JSON only.`;

            const result = await geminiModel.generateContent(promptForGemini, generationConfig);
            const response = result.response;
            aiResponseContent = response.text();

        } else {
            console.error(`[enhance-idea] ✖ Unsupported model: ${model}`);
            throw new Error(`Unsupported model specified: ${model}`);
        }

        // ----------------------------------------------------------- parse & return response ---
        const aiContent = aiResponseContent ?? "{}";
        let parsed;
        try {
            parsed = JSON.parse(aiContent);
        } catch (err) {
            console.error("[enhance-idea] ✖ JSON parse fail", err, "RAW:", aiContent);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        console.log("[enhance-idea] ✓ success");
        return NextResponse.json(parsed);

    } catch (err) {
        console.error("[enhance-idea] ✖ unexpected error in POST handler", err);
        const message = err instanceof Error ? err.message : "Unknown server error";
        const userErrorMessage = message.includes("API Key missing") || 
                                 message.includes("template") || 
                                 message.includes("database") || 
                                 message.includes("Unsupported model")
            ? message
            : "An unexpected error occurred.";
        return NextResponse.json({ error: userErrorMessage }, { status: 500 });
    }
}
