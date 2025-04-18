// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/page.tsx
"use client"

import { useState, useRef, useEffect } from "react"
// ... other imports ...
import { supabase } from "@/lib/supabase-client"
// import { generateDocuments } from "@/lib/generate-documents" // Removed as it's not needed here
import { ArrowLeft, ArrowRight, Mic, MicOff, Loader2, Sparkles, FileText, Edit2, Save, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card" // Keep Card imports if needed for structure around steps, but remove step-specific ones if fully delegated
import { Form } from "@/components/ui/form" // Keep if needed, remove if fully delegated
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider" // Import from auth-provider
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Import step components
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step3 from "./steps/Step3"
import Step4 from "./steps/Step4"
import Step5, { DOCUMENT_TYPES } from "./steps/Step5" // Ensure DOCUMENT_TYPES is exported if needed here, otherwise just import Step5
import { Step1Ref } from "./steps/Step1";

// Clarifying question type
type ClarifyingQuestion = {
  question: string;
  suggestedAnswer: string;
  userAnswer?: string;
  isEditing?: boolean;
  isDeleted?: boolean;
};

// Form schemas (keep these here as the forms are managed in this parent component)
const ideaFormSchema = z.object({
  idea: z.string().min(10, { message: "Your idea must be at least 10 characters" }),
})

const detailsFormSchema = z.object({
  targetAudience: z.string().optional(),
  problemSolved: z.string().optional(),
  keyFeatures: z.string().optional(),
  successMetrics: z.string().optional(),
  timeline: z.string().optional(),
})

// Define the type for the keys of the details form schema
type DetailField = keyof z.infer<typeof detailsFormSchema>;


export default function CreateProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, refreshUser } = useAuth()
  const [activeStep, setActiveStep] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [isRefining, setIsRefining] = useState(false) // Used for Idea refinement
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false); // New state for Step 3 AI answers
  const step1Ref = useRef<Step1Ref>(null);
  const step4Ref = useRef<{ generateGeminiPlan: () => Promise<string> }>(null);

  // *** FIX: Use the specific DetailField type for the state ***
  const [generatingAnswerField, setGeneratingAnswerField] = useState<DetailField | null>(null); // Track which field is generating

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(["prd", "user_flow", "architecture"]) // Default selections
  const [projectPlan, setProjectPlan] = useState<string>("")
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string>("") // Keep if needed globally

  // Project name state
  const [projectName, setProjectName] = useState("Untitled Project")
  const [isEditingName, setIsEditingName] = useState(false)
  const projectNameInputRef = useRef<HTMLInputElement>(null)
  const [projectId, setProjectId] = useState<string>("")
  const [isTestUser, setIsTestUser] = useState(false)
  const [hasCheckedLimits, setHasCheckedLimits] = useState(false)

  const [isInitializing, setIsInitializing] = useState(false);

  // Add state for clarifying questions
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);

  // Initialize forms
  const ideaForm = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: { idea: "" },
  })

  const detailsForm = useForm<z.infer<typeof detailsFormSchema>>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      targetAudience: "",
      problemSolved: "",
      keyFeatures: "",
      successMetrics: "",
      timeline: "",
    },
  })

  // --- useEffect hooks for focus, project limits, db updates ---
  // (Keep these as they manage overall page state and interactions)
  useEffect(() => {
    if (isEditingName && projectNameInputRef.current) {
      projectNameInputRef.current.focus()
    }
  }, [isEditingName])

  // /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/page.tsx

  // --- useEffect hook for project initialization and limit checking ---
  useEffect(() => {
    // Log entry into the effect hook
    console.log("Project creation effect triggered. User:", !!user, "hasCheckedLimits:", hasCheckedLimits, "projectId:", projectId, "isInitializing:", isInitializing);

    const checkProjectLimits = async () => {
      // Log entry into the async function
      console.log("checkProjectLimits started. Current projectId:", projectId, "hasCheckedLimits:", hasCheckedLimits);

      // Early exit conditions (already checked, has ID, or no user)
      if (!user || hasCheckedLimits || projectId) {
        console.log("checkProjectLimits bailing out early (already checked/has ID/no user).");
        return;
      }

      // Set the initializing flag to prevent concurrent runs
      setIsInitializing(true);
      console.log("--> Setting isInitializing = true");

      try {
        // --- Handle Test User ---
        if (user.email === "test@example.com") {
          setIsTestUser(true);
          const testId = `test-project-${Date.now()}`;
          console.log("Test user detected, using mock project ID:", testId);
          setProjectId(testId); // Set the mock project ID
          setHasCheckedLimits(true); // Mark limits as checked for the test user
          console.log("--> Test user setup complete. Setting hasCheckedLimits = true.");
          // No database interaction needed, so we can return here.
          return;
        }

        // --- Handle Real User ---
        // 1. Check current project count against limit
        const { data: projects, error: fetchError } = await supabase
          .from("projects")
          .select("id", { count: 'exact', head: true }) // More efficient count query
          .eq("user_id", user.id);

        if (fetchError) {
          console.error("Error fetching project count:", fetchError);
          throw fetchError; // Propagate error to catch block
        }

        const projectCount = projects?.length ?? 0;
        console.log(`User ${user.id} has ${projectCount} projects. Limit: ${user.projects_limit}`);

        if (projectCount >= user.projects_limit) {
          toast({
            title: "Project limit reached",
            description: `You've reached your limit of ${user.projects_limit} projects. Please upgrade your plan or delete existing projects.`,
            variant: "destructive",
          });
          router.push("/dashboard/projects");
          // Note: We don't set hasCheckedLimits here because the check failed due to limit.
          // If they navigate back, the check should ideally run again.
          return;
        }

        // 2. Create the new project if limit not reached
        console.log("--> Limit check passed. Attempting to create a new project...");
        const result = await createNewProject(user.id, projectName);

        if (!result.success || !result.project) {
          toast({
            title: "Error creating project",
            description: result.error || "There was an error creating your project. Please try again.",
            variant: "destructive",
          });
          router.push("/dashboard/projects"); // Redirect if creation fails
          // Note: Don't set hasCheckedLimits on failure.
          return;
        }

        // 3. Success: Update state with new project ID and mark check as complete
        console.log("--> Project created successfully. New projectId:", result.project.id);
        setProjectId(result.project.id);
        setHasCheckedLimits(true); // Mark check as complete *after* successful creation
        console.log("--> Setting hasCheckedLimits = true after successful creation.");

      } catch (error) {
        // Handle any errors during the process
        console.error("Error in checkProjectLimits:", error);
        toast({
          title: "Error setting up project",
          description: "There was an error initializing your project. Please try again or contact support.",
          variant: "destructive",
        });
        // Consider redirecting or disabling functionality
        router.push("/dashboard/projects");
      } finally {
        // Always clear the initializing flag when done (success or error)
        setIsInitializing(false);
        console.log("--> Setting isInitializing = false in finally block.");
      }
    };

    // Condition to call the async function:
    // User exists, limits haven't been checked, no project ID yet, and not already initializing.
    if (user && !hasCheckedLimits && !projectId && !isInitializing) {
      console.log("--> Conditions met. Calling checkProjectLimits.");
      checkProjectLimits();
    } else {
      console.log("--> Skipping checkProjectLimits call due to conditions.");
    }

    // Dependency array includes all external variables used in the effect
  }, [
      user,
      hasCheckedLimits,
      projectId,
      isInitializing, // Added isInitializing
      projectName,    // Needed for createNewProject
      router,         // Needed for redirects
      toast,          // Needed for notifications
      refreshUser     // Although not directly called here, it's related to user state updates
  ]);

  // Debounced update function for idea
  const debouncedUpdateIdea = useRef(
    debounce(async (id: string, ideaValue: string) => {
      if (id && !isTestUser) {
        console.log("Debounced update idea:", id, typeof ideaValue === 'string' ? ideaValue.substring(0, 20) + "..." : "Invalid idea value");
        const { error } = await supabase
          .from("projects")
          .update({ idea: ideaValue })
          .eq("id", id);
        if (error) console.error("Error debounced updating idea:", error);
      }
    }, 1000) // Update after 1 second of inactivity
  ).current;

  // Watch idea changes for debounced update
  useEffect(() => {
    const subscription = ideaForm.watch((value, { name }) => {
      if (name === 'idea' && projectId && value.idea !== undefined) {
        debouncedUpdateIdea(projectId, value.idea);
      }
    });
    return () => subscription.unsubscribe();
  }, [ideaForm, debouncedUpdateIdea, projectId, isTestUser]);


  // Debounced update function for details
  const debouncedUpdateDetails = useRef(
    debounce(async (id: string, detailsValue: any) => {
      if (id && !isTestUser) {
        console.log("Debounced update details:", id, detailsValue);
        const { error } = await supabase
          .from("projects")
          .update({ product_details: detailsValue })
          .eq("id", id);
        if (error) console.error("Error debounced updating details:", error);
      }
    }, 1000) // Update after 1 second of inactivity
  ).current;

   // Watch details changes for debounced update
  useEffect(() => {
    const subscription = detailsForm.watch((value) => {
      if (projectId) {
        debouncedUpdateDetails(projectId, value);
      }
    });
    return () => subscription.unsubscribe();
  }, [detailsForm, debouncedUpdateDetails, projectId, isTestUser]);


  // Update project tools immediately on change (less frequent action)
  useEffect(() => {
    const updateProjectTools = async () => {
      // Only update if projectId exists, it's not the test user, and tools have actually changed
      if (projectId && !isTestUser && selectedTools.length > 0) { // Check length > 0 maybe redundant if initial state is []
         console.log("Updating project tools:", projectId, selectedTools);
         const { error } = await supabase
          .from("projects")
          .update({ selected_tools: selectedTools })
          .eq("id", projectId);

        if (error) {
          console.error("Error updating project tools:", error);
          // Optionally show a toast here
        }
      }
    };
    // Avoid running on initial mount if projectId isn't set yet
    if(projectId) {
        updateProjectTools();
    }
  }, [projectId, selectedTools, isTestUser]); // Dependencies are correct


  // --- Handlers for project name, AI features, steps, submission ---
  // (Keep these handlers here as they orchestrate the multi-step process)

  const toggleEditName = () => setIsEditingName(!isEditingName);

  const saveProjectName = async () => {
    const trimmedName = projectName.trim();
    const finalName = trimmedName === "" ? "Untitled Project" : trimmedName;
    setProjectName(finalName);
    setIsEditingName(false);

    if (projectId && !isTestUser) {
      console.log("Saving project name:", projectId, finalName);
      try {
        const { error } = await supabase.from("projects").update({ name: finalName }).eq("id", projectId);
        if (error) throw error;
        toast({ title: "Project name updated" });
      } catch (error) {
        console.error("Error updating project name:", error);
        toast({ title: "Error updating name", variant: "destructive" });
      }
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveProjectName();
    else if (e.key === "Escape") setIsEditingName(false);
  };

  // Handle idea refinement
  const handleRefineIdea = async () => {
    setIsRefining(true);
    try {
      const idea = ideaForm.getValues("idea");
      if (!idea || idea.length < 10) {
        toast({ title: "Please provide a more detailed idea (at least 10 characters)", variant: "destructive" });
        return;
      }

      // Call the refineIdea method exposed by the Step1 component
      const refinedIdea = await step1Ref.current?.refineIdea(idea);
      
      if (refinedIdea) {
        // Update form with refined idea
        ideaForm.setValue("idea", refinedIdea);
        
        // Update database for real users
        if (!isTestUser && projectId) {
          // Add a small delay to ensure state is updated
          setTimeout(async () => {
            // Get the current clarifying questions from Step1
            const currentQuestions = step1Ref.current?.getClarifyingQuestions() || [];
            
            console.log("Questions to save to database:", JSON.stringify(currentQuestions));
            
            if (currentQuestions.length === 0) {
              console.warn("Warning: No clarifying questions to save. This might indicate a state timing issue.");
            }
            
            try {
              const { error: updateError } = await supabase
                .from("projects")
                .update({ 
                  refined_idea: refinedIdea,
                  clarifying_questions: currentQuestions 
                })
                .eq("id", projectId);
                
              if (updateError) {
                console.error("Error updating project:", updateError);
                throw updateError;
              }
              
              console.log("Successfully updated project with refined idea and questions");

              // Log credit usage & update user credits
              if (user) {
                await logCreditUsage(user.id, projectId, "idea_refinement", 50);
                await updateUserCredits(user.id, user.credits_remaining - 50);
              }
            } catch (error) {
              console.error("Error in database update:", error);
              toast({
                title: "Error saving to database",
                description: "Your refined idea was generated but couldn't be saved.",
                variant: "destructive"
              });
            }
          }, 500); // Small delay to ensure state is updated
        }
      }
    } catch (error: any) {
      console.error("Error refining idea:", error);
      toast({
        title: "Error refining idea",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsRefining(false);
    }
  };

  // *** FIX: Ensure the 'field' parameter uses the DetailField type ***
  const handleGenerateAnswer = async (field: DetailField) => {
    const idea = ideaForm.getValues("idea");
    if (!idea || idea.length < 10) {
      toast({ title: "Please provide your idea first", variant: "destructive" });
      return;
    }
    if (!projectId) {
      toast({ title: "Project not initialized", description: "Please wait or refresh.", variant: "destructive" });
      return;
    }

    setGeneratingAnswerField(field); // Indicate which field is loading
    setIsGeneratingAnswer(true); // General loading state for Step 3

    try {
      if (!isTestUser && user && user.credits_remaining < 25) {
        toast({ title: "Insufficient credits (25 needed)", variant: "destructive" });
        return;
      }

      // No simulation here - we'll let Step3's handleGenerateGeminiAnswer handle the API call
      // and update the form value. We're just setting up loading states and checking credits.
      
      // Credit usage will be handled after successful API call
      console.log(`Preparing to generate AI answer for ${field} (Project: ${projectId})`);

      // No need to refresh here, it's done in Step3 after the API call
      // await refreshUser();
      // console.log(`User credits after update: ${user.credits_remaining}`);
    } catch (error) {
      // Ensure loading states are reset on error
      setIsGeneratingAnswer(false);
      console.error(`Error generating answer for ${field}:`, error);
      toast({ title: "Answer generation failed", variant: "destructive" });
      setIsGeneratingAnswer(false);
      setGeneratingAnswerField(null);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      if (!projectId) {
        toast({ title: "Project not initialized", description: "Please wait or refresh.", variant: "destructive" });
        return;
      }

      // Let Step4 handle the API call and get the plan back
      const generatedPlan = await step4Ref.current?.generateGeminiPlan();
      
      if (generatedPlan) {
        setProjectPlan(generatedPlan); // Update state
        
        // Update DB for real users
        if (!isTestUser && projectId) {
          const { error: updateError } = await supabase
            .from("projects")
            .update({ project_plan: generatedPlan })
            .eq("id", projectId);
          if (updateError) throw updateError;
        }
        
        toast({ title: "Project plan generated" });
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      toast({ title: "Plan generation failed", variant: "destructive" });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const navigateToStep = (step: number) => {
    // Basic validation before moving forward
    if (step > activeStep) {
      if (activeStep === 1) {
        const result = ideaForm.trigger("idea"); // Trigger validation for the idea field
        if (!result) return; // Don't navigate if invalid
        const ideaValue = ideaForm.getValues("idea");
        if (!ideaValue || ideaValue.length < 10) {
          toast({ title: "Idea must be at least 10 characters", variant: "destructive"});
          return;
        }
        // Remove any validation that requires the idea to be refined
      }
      // Add validation triggers for other steps if needed
      if (activeStep === 4 && !projectPlan) {
        toast({ title: "Please generate the project plan first", variant: "destructive"});
        return;
      }
    } else if (step < activeStep) {
      // When navigating back to Step 1, refresh clarifying questions
      if (step === 1 && projectId && !isTestUser) {
        // Refresh clarifying questions when navigating back to Step 1
        const refreshClarifyingQuestions = async () => {
          try {
            const { data, error } = await supabase
              .from("projects")
              .select("clarifying_questions")
              .eq("id", projectId)
              .single();
            
            if (error) {
              console.error("Error refreshing clarifying questions:", error);
              return;
            }
            
            if (data && data.clarifying_questions) {
              console.log("Refreshed clarifying questions:", JSON.stringify(data.clarifying_questions));
              setClarifyingQuestions(data.clarifying_questions);
            }
          } catch (error) {
            console.error("Error in refreshClarifyingQuestions:", error);
          }
        };
        
        refreshClarifyingQuestions();
      }
    }
    setActiveStep(step);
  };

  const toggleRecording = () => setIsRecording(!isRecording);

  const handleTranscription = async (text: string, audioUrl: string) => {
    if (!projectId) {
        toast({ title: "Project not initialized", description: "Cannot save transcription.", variant: "destructive" });
        return;
    }
    const currentIdea = ideaForm.getValues("idea");
    const updatedIdea = currentIdea ? `${currentIdea}\n\n--- Transcription ---\n${text}` : text;
    ideaForm.setValue("idea", updatedIdea, { shouldValidate: true });
    setVoiceNoteUrl(audioUrl); // Store URL if needed

    // Update DB (idea is handled by debouncer, update voice_note_url)
    if (!isTestUser) {
        console.log("Updating voice note URL:", projectId, audioUrl);
        const { error } = await supabase
            .from("projects")
            .update({ voice_note_url: audioUrl })
            .eq("id", projectId);
        if (error) {
            console.error("Error updating project with voice note URL:", error);
        }
    }
    setIsRecording(false); // Stop recording UI after transcription
  };

  // --- Helper functions for DB interaction ---
  const createNewProject = async (userId: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ user_id: userId, name: name, status: 'draft' }]) // Set initial status
        .select()
        .single();
      if (error) throw error;
      return { success: true, project: data };
    } catch (error: any) {
      console.error("Error in createNewProject:", error);
      return { success: false, error: error.message };
    }
  };

  const logCreditUsage = async (userId: string, projId: string, action: string, credits: number) => {
    if (!projId || !userId) {
        console.warn("Cannot log credit usage: Project ID or User ID is missing.");
        return;
    }
    
    try {
        console.log(`Logging credit usage: User ${userId}, Project ${projId}, Action ${action}, Credits ${credits}`);
        const { data, error } = await supabase.from("credit_usage_log").insert([
            { user_id: userId, project_id: projId, action: action, credits_used: credits },
        ]);
        
        if (error) {
            console.error("Error logging credit usage:", error);
            // Consider showing a toast here, but don't throw an error to prevent blocking the main flow
        } else {
            console.log("Credit usage logged successfully:", data);
        }
    } catch (err) {
        // Catch any unexpected errors to prevent them from bubbling up
        console.error("Unexpected error in logCreditUsage:", err);
        // Don't throw the error - this is a non-critical operation
    }
  };

  const updateUserCredits = async (userId: string, newCreditAmount: number) => {
      console.log(`Updating credits for User ${userId} to ${newCreditAmount}`);
      const { error } = await supabase
          .from("profiles")
          .update({ credits_remaining: newCreditAmount })
          .eq("id", userId);
      if (error) console.error("Error updating user credits:", error);
      // IMPORTANT: Need to trigger a refresh of the user context (useAuth) here
      // This depends on how your AuthProvider is set up. It might involve calling a refresh function from the context.
      refreshUser();
      // e.g., refreshUserContext();
  };

  // Debounce utility
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>): void => {
      const later = () => {
        timeout = null;
        func(...args);
      };
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  }


  // --- Cleanup Effect ---
  useEffect(() => {
    return () => {
      console.log("Cleaning up CreateProjectPage state");
      // Reset state if needed, though navigating away usually unmounts and resets anyway
      // setActiveStep(1); // etc. - Usually not necessary unless you have specific persistence needs
    };
  }, []);


  // --- Render Logic ---
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 pt-6"> {/* Added consistent padding */}
      {/* Project Name Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          {isEditingName ? (
             <div className="flex items-center ml-2">
               <Input
                 ref={projectNameInputRef}
                 value={projectName}
                 onChange={(e) => setProjectName(e.target.value)}
                 onKeyDown={handleNameKeyDown}
                 onBlur={saveProjectName} // Save on blur too
                 className="h-9 text-xl font-bold"
                 placeholder="Enter Project Name"
               />
               <Button variant="ghost" size="sm" onClick={saveProjectName} className="ml-2">
                 <Save className="h-4 w-4" />
               </Button>
             </div>
           ) : (
             <div className="flex items-center ml-2 group">
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer group-hover:text-emerald-600 transition-colors" onClick={toggleEditName}>
                 {projectName}
               </h1>
               <Button variant="ghost" size="sm" onClick={toggleEditName} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Edit2 className="h-4 w-4" />
               </Button>
             </div>
           )}
        </div>
        <div className="text-sm text-muted-foreground">
          {user && <span>Credits: <span className="font-medium">{user.credits_remaining ?? '...'}</span></span>}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="relative mb-8">
        {/* ... (Step indicator JSX remains the same) ... */}
         <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              onClick={() => navigateToStep(step)}
              // Disable clicking steps that haven't been reached yet,
              // except for going back to already completed steps.
              disabled={step > activeStep && !(activeStep > step)}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 ease-in-out",
                activeStep === step
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2 dark:ring-offset-background" // Current step
                  : activeStep > step
                    ? "bg-emerald-500 text-white hover:bg-emerald-600" // Completed step
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed", // Future step
                 step <= activeStep ? "hover:ring-2 hover:ring-emerald-500 hover:ring-offset-1" : "" // Hover effect for reachable steps
              )}
              aria-current={activeStep === step ? "step" : undefined}
            >
              {activeStep > step ? <Check className="h-4 w-4" /> : step}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs font-medium">
           {/* Labels need careful alignment - consider absolute positioning or grid */}
           <span className={cn("text-center w-1/5", activeStep >= 1 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>Idea</span>
           <span className={cn("text-center w-1/5", activeStep >= 2 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>Tools</span>
           <span className={cn("text-center w-1/5", activeStep >= 3 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>Details</span>
           <span className={cn("text-center w-1/5", activeStep >= 4 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>Plan</span>
           <span className={cn("text-center w-1/5", activeStep >= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>Generate</span>
        </div>
      </div>

      {/* Step Content - Now using imported components */}
      <div className="min-h-[400px]"> {/* Add min-height to prevent layout jumps */}
        {activeStep === 1 && (
          <Step1
            ideaForm={ideaForm}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            handleTranscription={handleTranscription}
            navigateToStep={navigateToStep}
            isRefining={isRefining}
            handleRefineIdea={handleRefineIdea}
            projectId={projectId}
            isTestUser={isTestUser}
            clarifyingQuestionsData={clarifyingQuestions}
            ref={step1Ref}
          />
        )}

        {activeStep === 2 && (
          <Step2
            selectedTools={selectedTools}
            onSelectionChange={setSelectedTools}
            navigateToStep={navigateToStep}
          />
        )}

        {activeStep === 3 && (
          <Step3
          projectId={projectId}
          navigateToStep={navigateToStep}
        />
        )}

        {activeStep === 4 && (
          <Step4
          projectId={projectId}
          selectedTools={selectedTools}
          projectPlan={projectPlan}
          setProjectPlan={setProjectPlan}
          isGeneratingPlan={isGeneratingPlan}
          setIsGeneratingPlan={setIsGeneratingPlan}
          navigateToStep={navigateToStep}
          />
        )}

        {activeStep === 5 && (
          <Step5
            user={user}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting} // Pass setter instead of handler
            navigateToStep={navigateToStep}
            projectId={projectId}
            projectPlan={projectPlan}
          />
        )}
      </div>
    </div>
  );
}
