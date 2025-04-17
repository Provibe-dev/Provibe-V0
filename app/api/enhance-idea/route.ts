// /app/api/enhance-idea/route.ts
// v1.0 – April 17 2025
// ----------------------------------------------------------------------------
// POST  /api/enhance-idea
// Body: { idea: string; techStackHint?: string }
// Returns: { enhancedIdea: string; clarifyingQuestions: {question: string; suggestedAnswer: string}[] }
// ----------------------------------------------------------------------------

import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialise OpenAI client ------------------------------------------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
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
    if (!idea || idea.length < 10) {
      return NextResponse.json(
        { error: "Idea must be at least 10 characters long" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[enhance-idea] ✖ OPENAI_API_KEY missing");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // -------------------------------------------------------------- build system prompt ----
    const systemPrompt = `
You are an expert product strategist.

◆ TASK
1. Transform the raw idea into a concise, well‑structured product concept → enhancedIdea.
2. Produce 3‑5 clarifying questions that surface *target audience, problem solved, feature list, suggested tech stack and key design decisions*.
   • Provide a thoughtful suggestedAnswer for each question. 
   • Respond to possible target audience with brief demographic and psychographic profile, feature variations as a list, suggested tech stack with list of tools & technology, and divergent possibilities as a clarifying questions

◆ OUTPUT — MUST be valid JSON (no markdown, no extra keys)
{
  "enhancedIdea": "<string>",
  "clarifyingQuestions": [
    { "question": "<string>", "suggestedAnswer": "<string>" }
  ]
}

◆ RULES
* Do NOT add comments, markdown fences, or keys beyond those above.
* Keep enhancedIdea ≤ 120 words.

◆ INPUT
RAW_IDEA:
---
${idea}
---
OPTIONAL_HINTS:
${techStackHint || "None"}
    `.trim();

    // ------------------------------------------------------------------- call OpenAI -----
    console.log("[enhance-idea] ► calling OpenAI");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Respond with JSON only." },
      ],
    });

    // ----------------------------------------------------------- parse & return response ---
    const aiContent = completion.choices[0]?.message?.content ?? "{}";
    let parsed;
    try {
      parsed = JSON.parse(aiContent);
    } catch (err) {
      console.error("[enhance-idea] ✖ JSON parse fail", err, "RAW:", aiContent);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    console.log("[enhance-idea] ✓ success");
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[enhance-idea] ✖ unexpected", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
