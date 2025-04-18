// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/steps/Step3.tsx
import { z } from "zod"
import { UseFormReturn } from "react-hook-form"; // Import UseFormReturn
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for potentially longer answers
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react" // Import Loader2
import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react"; // Add useState and useEffect

// Define the expected shape of the form data (matches the schema in page.tsx)
const detailsFormSchema = z.object({
  targetAudience: z.string().optional(),
  problemSolved: z.string().optional(),
  keyFeatures: z.string().optional(),
  successMetrics: z.string().optional(),
  timeline: z.string().optional(),
});

type DetailsFormData = {
  targetAudience: string;
  problemSolved: string;
  keyFeatures: string;
  successMetrics: string;
  timeline: string;
  additionalInfo1: string; // Add this field
  additionalInfo2: string; // Add this field
};

type DetailField = keyof DetailsFormData;

// Add ClarifyingQuestion type
type ClarifyingQuestion = {
  question: string;
  suggestedAnswer: string;
  userAnswer?: string;
};

type Step3Props = {
  detailsForm: UseFormReturn<DetailsFormData>;
  isGeneratingAnswer: boolean;
  generatingAnswerField: DetailField | null;
  handleGenerateAnswer: (field: DetailField) => Promise<void>;
  navigateToStep: (step: number) => void;
  projectId?: string;
  isTestUser?: boolean;
  ideaText?: string; // Add this prop to get the idea text from parent
  setIsGeneratingAnswer: (isGenerating: boolean) => void;
  clarifyingQuestions?: ClarifyingQuestion[]; // Add this prop
}

export default function Step3({
    detailsForm,
    isGeneratingAnswer,
    generatingAnswerField,
    handleGenerateAnswer,
    navigateToStep,
    projectId,
    isTestUser,
    ideaText = "", // Default to empty string if not provided
    setIsGeneratingAnswer,
    clarifyingQuestions = [] // Default to empty array
}: Step3Props) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // State to store the mapped fields from clarifying questions
  const [fields, setFields] = useState<{ name: DetailField; label: string; placeholder: string }[]>([]);

  // Map clarifying questions to fields when component mounts or clarifyingQuestions changes
  useEffect(() => {
    console.log("Step3: Received clarifyingQuestions:", JSON.stringify(clarifyingQuestions));
    
    if (clarifyingQuestions && clarifyingQuestions.length > 0) {
      // Map the questions to our form fields
      const mappedFields: { name: DetailField; label: string; placeholder: string }[] = [];
      
      // Map to specific fields based on question content or position
      const fieldMapping: Record<number, DetailField> = {
        0: "targetAudience",
        1: "problemSolved",
        2: "keyFeatures",
        3: "successMetrics",
        4: "timeline",
        5: "additionalInfo1", // New field for 6th question
        6: "additionalInfo2"  // New field for 7th question
      };
      
      // Use up to 7 questions
      const questionsToUse = clarifyingQuestions.slice(0, 7);
      
      questionsToUse.forEach((q, index) => {
        const fieldName = fieldMapping[index];
        if (fieldName) {
          mappedFields.push({
            name: fieldName,
            label: q.question,
            placeholder: q.suggestedAnswer ? "Suggested: " + q.suggestedAnswer.substring(0, 50) + "..." : "Type your answer or use AI to generate one..."
          });
          
          // If there's a user answer, set it in the form
          if (q.userAnswer) {
            detailsForm.setValue(fieldName, q.userAnswer);
          }
          // Don't automatically set suggested answers - show them as placeholders instead
        }
      });
      
      console.log("Step3: Setting fields from clarifying questions:", JSON.stringify(mappedFields));
      setFields(mappedFields);
    } else {
      console.log("Step3: No clarifying questions available, using default fields");
      // Fallback to default fields if no clarifying questions
      setFields([
        { name: "targetAudience", label: "Who is your target audience?", placeholder: "Describe your target users..." },
        { name: "problemSolved", label: "What problem does your product solve?", placeholder: "Describe the problem your product addresses..." },
        { name: "keyFeatures", label: "What are the key features?", placeholder: "List the main features..." },
        { name: "successMetrics", label: "How will you measure success?", placeholder: "Describe your success metrics..." },
        { name: "timeline", label: "What is your expected timeline?", placeholder: "Describe your project timeline..." },
      ]);
    }
  }, [clarifyingQuestions, detailsForm]);

  // New function to generate answer using Gemini API
  const generateGeminiAnswer = async (field: DetailField): Promise<string> => {
    // Get current form values to provide context
    const currentDetails = detailsForm.getValues();
    
    try {
      const response = await fetch('/api/gemini-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          idea: ideaText,
          projectDetails: currentDetails
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API call failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // After successful API call, log credit usage
      if (!isTestUser && projectId && user) {
        console.log(`Step3: Processing credit usage for ${field} - User: ${user.id}, Credits: ${user.credits_remaining}`);
        
        try {
          // First log the credit usage
          await logCreditUsage(user.id, projectId, "ai_answer", 25); // Changed from `ai_answer_${field}` to "ai_answer"
          console.log(`Step3: Credit usage logged for ${field}`);
          
          // Then update the user's credits
          await updateUserCredits(user.id, user.credits_remaining - 25);
          console.log(`Step3: Credits updated: ${user.credits_remaining} -> ${user.credits_remaining - 25}`);
          
          // Refresh the user data
          await refreshUser();
          console.log(`Step3: User refreshed, new credits: ${user.credits_remaining}`);
          
          toast({ title: `AI answer generated for ${field}` });
        } catch (error) {
          console.error(`Step3: Error processing credit usage for ${field}:`, error);
          toast({ 
            title: "Error updating credits", 
            description: "Your answer was generated but we couldn't update your credits.",
            variant: "destructive" 
          });
        }
      }
      
      return data.answer;
    } catch (error) {
      console.error(`Error generating answer with Gemini for ${field}:`, error);
      throw error;
    } finally {
      // Reset loading states
      if (typeof setIsGeneratingAnswer === 'function') {
        setIsGeneratingAnswer(false);
      }
    // Corrected the function name here
    if (typeof generatingAnswerField !== 'undefined') {
      // setGeneratingAnswerField(null); // This is now handled by the parent
      }
    }
  };

  // New handler that uses Gemini
  const handleGenerateGeminiAnswer = async (field: DetailField) => {
    try {
      // Call the parent's handler which handles loading state, credits, etc.
      await handleGenerateAnswer(field);
      
      // Generate the answer with Gemini
      const answer = await generateGeminiAnswer(field);
      
      // Update the form with the generated answer
      detailsForm.setValue(field, answer, { shouldValidate: true });
      
      return answer;
    } catch (error) {
      console.error(`Error in handleGenerateGeminiAnswer for ${field}:`, error);
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Product Details</CardTitle>
        <CardDescription>
          Answer these questions to help us understand your product better. You can skip questions or use AI to generate answers (costs 25 credits each).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...detailsForm}>
          {/* Removed the redundant <form> tag */}
          <div className="space-y-6">
            {fields.map((item) => (
              <FormField
                key={item.name}
                control={detailsForm.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{item.label}</FormLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerateGeminiAnswer(item.name)}
                        disabled={isGeneratingAnswer}
                        className="text-xs"
                      >
                        {isGeneratingAnswer && generatingAnswerField === item.name ? (
                           <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                           <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        {isGeneratingAnswer && generatingAnswerField === item.name ? 'Generating...' : 'AI Answer'}
                      </Button>
                    </div>
                    
                    <FormControl>
                      <Textarea 
                        placeholder={
                          clarifyingQuestions && 
                          clarifyingQuestions.length > 0 && 
                          clarifyingQuestions[fields.findIndex(f => f.name === item.name)]?.suggestedAnswer
                            ? `Suggested: ${clarifyingQuestions[fields.findIndex(f => f.name === item.name)].suggestedAnswer}`
                            : item.placeholder
                        } 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(2)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(4)}
          disabled={isGeneratingAnswer}
          className="opacity-100"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
async function updateUserCredits(userId: string, newCreditAmount: number) {
  const { supabase } = await import("@/lib/supabase-client");
  const { error } = await supabase
    .from("profiles")
    .update({ credits_remaining: newCreditAmount })
    .eq("id", userId);
  
  if (error) console.error("Error updating user credits:", error);
}

async function logCreditUsage(userId: string, projectId: string, action: string, creditsUsed: number) {
  console.log(`Logging credit usage: ${userId}, ${projectId}, ${action}, ${creditsUsed}`);
  const { supabase } = await import("@/lib/supabase-client");
  const { error } = await supabase.from("credit_usage_log").insert([
    {
      user_id: userId,
      project_id: projectId,
      action: action,
      credits_used: creditsUsed,
    },
  ]);
  
  if (error) {
    console.error("Error logging credit usage:", error);
    throw error;
  }
  
  return true;
}
