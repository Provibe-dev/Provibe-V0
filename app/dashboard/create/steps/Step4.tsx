// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/steps/Step4.tsx
import { UseFormReturn } from "react-hook-form" // Import UseFormReturn
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Loader2, Edit2 } from "lucide-react" // Added Edit2
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils" // Import cn if needed for styling
import { useAuth } from "@/components/auth-provider" // Add auth provider
import { useToast } from "@/components/ui/use-toast" // Add toast
import { forwardRef, useImperativeHandle } from 'react';

// Define expected form data shapes (can be inferred or explicitly defined)
type IdeaFormData = { idea: string; }
type DetailsFormData = {
  targetAudience?: string;
  problemSolved?: string;
  keyFeatures?: string;
  successMetrics?: string;
  timeline?: string;
};

type Step4Props = {
  ideaForm: UseFormReturn<IdeaFormData>; // Use specific form type
  detailsForm: UseFormReturn<DetailsFormData>; // Use specific form type
  selectedTools: string[];
  projectPlan: string;
  isGeneratingPlan: boolean;
  handleGeneratePlan: () => Promise<void>; // Correct handler name
  navigateToStep: (step: number) => void;
  projectId?: string; // Add projectId prop
  isTestUser?: boolean; // Add isTestUser prop
}

// Helper to format keys nicely
const formatDetailKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capitals
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};


const Step4 = forwardRef(({
  ideaForm,
  detailsForm,
  selectedTools,
  projectPlan,
  isGeneratingPlan,
  handleGeneratePlan,
  navigateToStep,
  projectId,
  isTestUser
}: Step4Props, ref) => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  // Get form values directly for display
  const ideaValue = ideaForm.getValues().idea;
  const detailValues = detailsForm.getValues();

  // Generate project plan using Gemini
  const generateGeminiPlan = async (): Promise<string> => {
    try {
      console.log("Step4: Sending request to /api/gemini-plan with data:", {
        idea: ideaValue,
        details: detailValues,
        tools: selectedTools
      });
      
      const response = await fetch('/api/gemini-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: ideaValue,
          details: detailValues,
          tools: selectedTools
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API call failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Step4: Received plan from API");
      
      // After successful API call, log credit usage
      if (!isTestUser && projectId && user) {
        console.log(`Step4: Processing credit usage for project plan - User: ${user.id}, Credits: ${user.credits_remaining}`);
        
        try {
          // First log the credit usage
          await logCreditUsage(user.id, projectId, "plan_generation", 50);
          console.log(`Step4: Credit usage logged for project plan`);
          
          // Then update the user's credits
          await updateUserCredits(user.id, user.credits_remaining - 50);
          console.log(`Step4: Credits updated: ${user.credits_remaining} -> ${user.credits_remaining - 50}`);
          
          // Refresh the user data
          await refreshUser();
          console.log(`Step4: User refreshed, new credits: ${user.credits_remaining}`);
        } catch (error) {
          console.error(`Step4: Error processing credit usage for project plan:`, error);
          toast({ 
            title: "Error updating credits", 
            description: "Your plan was generated but we couldn't update your credits.",
            variant: "destructive" 
          });
        }
      }
      
      return data.plan;
    } catch (error) {
      console.error(`Error generating project plan with Gemini:`, error);
      toast({
        title: "Error generating plan",
        description: "There was an error generating your project plan. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Expose the generateGeminiPlan method to the parent component
  useImperativeHandle(ref, () => ({
    generateGeminiPlan
  }));

  // Handler that uses Gemini
  const handleGenerateGeminiPlan = async () => {
    try {
      console.log("Step4: Starting plan generation/regeneration with Gemini");
      
      // Call the parent's handler which handles loading state
      await handleGeneratePlan();
      
      console.log("Step4: Plan generation/regeneration completed successfully");
    } catch (error) {
      console.error(`Error in handleGenerateGeminiPlan:`, error);
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Review & Generate Plan</CardTitle>
        <CardDescription>
          Review your inputs and generate a project plan. You can go back to edit any section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Sections */}
        <div className="space-y-4">
          {/* Idea Review */}
          <div className="rounded-md border p-4 relative group">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">Your Idea</h3>
                <Button variant="ghost" size="sm" onClick={() => navigateToStep(1)} className="absolute top-2 right-2 transition-opacity">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{ideaValue || "No idea provided yet."}</p>
          </div>

          {/* Tools Review */}
          <div className="rounded-md border p-4 relative group">
             <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">Selected Tools</h3>
                <Button variant="ghost" size="sm" onClick={() => navigateToStep(2)} className="absolute top-2 right-2 transition-opacity">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedTools.length > 0 ? (
                selectedTools.map((tool) => (
                  <div key={tool} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    {tool}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tools selected</p>
              )}
            </div>
          </div>

          {/* Details Review */}
          <div className="rounded-md border p-4 relative group">
             <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">Project Details</h3>
                <Button variant="ghost" size="sm" onClick={() => navigateToStep(3)} className="absolute top-2 right-2 transition-opacity">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>
            <div className="mt-1 space-y-2 text-sm">
              {Object.entries(detailValues).map(([key, value]) => (
                value ? ( // Only display if a value exists
                    <div key={key}>
                    <span className="font-medium text-foreground">{formatDetailKey(key)}: </span>
                    <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                ) : null
              ))}
              {/* Show message if no details provided */}
              {Object.values(detailValues).every(v => !v) && (
                 <p className="text-sm text-muted-foreground">No details provided yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Plan Section */}
        <div className="mt-6">
          {projectPlan ? (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium">Project Plan</h3>
              {/* Ensure prose styles apply correctly */}
              <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
                <ReactMarkdown>{projectPlan}</ReactMarkdown>
              </div>
              <Button
                onClick={handleGenerateGeminiPlan}
                disabled={isGeneratingPlan}
                variant="outline"
                size="sm"
                className="mt-4 opacity-100"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...
                  </>
                ) : (
                  "Regenerate Plan"
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGenerateGeminiPlan}
              disabled={isGeneratingPlan}
              className="w-full !opacity-100 !visible"
              size="lg"
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...
                </>
              ) : (
                "Generate Project Plan"
              )}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(5)}
          disabled={!projectPlan || isGeneratingPlan}
          className="!opacity-100 !visible"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
});

export default Step4;


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
