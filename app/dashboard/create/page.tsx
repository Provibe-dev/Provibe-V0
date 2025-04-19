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
  const [isInitializingProject, setIsInitializingProject] = useState(false); // New state for creation process

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

  // --- Simplified useEffect hook for initial setup (like test user check) ---
  useEffect(() => {
    console.log("Project creation effect triggered (simplified). User:", !!user);
    // Only check for test user initially. Project creation is deferred.
    if (user && user.email === "test@example.com" && !projectId) {
        setIsTestUser(true);
        // We won't set a test projectId here yet, will do it in initializeProject
        console.log("Test user detected.");
    }
     // Project creation and limit checks are now handled by initializeProject
  }, [user, projectId]); // Depend on user and projectId

  // --- NEW FUNCTION: Initialize Project ---
  const initializeProject = async (idea: string): Promise<string | null> => {
    // Exit if already initializing or if project ID already exists
    if (isInitializingProject || projectId) {
      console.log("Initialization skipped (already initializing or project exists). Current projectId:", projectId);
      return projectId || null; // Return existing ID if available
    }
    // Exit if no user context yet
    if (!user) {
        console.error("Cannot initialize project: User context not available.");
        toast({ title: "User session error", description: "Please refresh the page.", variant: "destructive"});
        return null;
    }

    console.log("Attempting to initialize project...");
    setIsInitializingProject(true);

    try {
      // Handle Test User (set temporary ID)
      if (user.email === "test@example.com") {
        const testId = `test-project-${Date.now()}`;
        console.log("Test user: Setting mock project ID:", testId);
        setProjectId(testId);
        setIsTestUser(true); // Ensure this is set
        return testId; // Return mock ID
      }

      // Handle Real User
      // 1. Check project limit
      console.log(`Checking project limit for user ${user.id}. Limit: ${user.projects_limit}`);
      const { count: projectCount, error: countError } = await supabase
        .from("projects")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id);

      if (countError) {
        console.error("Error fetching project count:", countError);
        throw countError;
      }

      console.log(`User has ${projectCount ?? 0} projects.`);
      if (projectCount !== null && projectCount >= user.projects_limit) {
        toast({
          title: "Project limit reached",
          description: `You've reached your limit of ${user.projects_limit} projects. Please upgrade or delete projects.`,
          variant: "destructive",
        });
        router.push("/dashboard/projects");
        return null; // Indicate failure
      }

      // 2. Create the new project
      console.log("--> Limit check passed. Creating new project...");
      // Use current projectName state, might be "Untitled Project" initially
      const createResult = await createNewProject(user.id, projectName);

      if (!createResult.success || !createResult.project) {
        toast({
          title: "Error creating project",
          description: createResult.error || "Failed to create project record.",
          variant: "destructive",
        });
        router.push("/dashboard/projects");
        return null; // Indicate failure
      }

      const newProjectId = createResult.project.id;
      console.log("--> Project created successfully. New projectId:", newProjectId);
      setProjectId(newProjectId); // Set the new project ID state

      // 3. Automatic Naming Logic
      if (projectName === "Untitled Project") {
        const words = idea.split(/\s+/).filter(Boolean); // Split by whitespace and remove empty strings
        const autoName = words.slice(0, 3).join(" "); // Take first 3 words
        const finalAutoName = autoName.length > 0 ? autoName : "New Project"; // Fallback if idea was empty/short

        console.log(`Project name is 'Untitled Project'. Attempting auto-name: "${finalAutoName}"`);
        setProjectName(finalAutoName); // Update local state

        // Update name in the database
        console.log("Updating project name in DB:", newProjectId, finalAutoName);
        const { error: nameUpdateError } = await supabase
          .from("projects")
          .update({ name: finalAutoName })
          .eq("id", newProjectId);

        if (nameUpdateError) {
          console.error("Error auto-updating project name:", nameUpdateError);
          // Non-critical error, maybe show a warning toast but proceed
          toast({ title: "Warning", description: "Could not auto-update project name.", variant: "default" });
        } else {
          console.log("Project name auto-updated successfully in DB.");
        }
      }

      return newProjectId; // Return the new project ID

    } catch (error) {
      console.error("Error during project initialization:", error);
      toast({
        title: "Error setting up project",
        description: "Could not initialize your project. Please try again.",
        variant: "destructive",
      });
      // Consider redirecting
      // router.push("/dashboard/projects");
      return null; // Indicate failure
    } finally {
      setIsInitializingProject(false); // Clear the initializing flag
      console.log("--> Project initialization process finished.");
    }
  };


  // Debounced update function for idea
  const debouncedUpdateIdea = useRef(
    debounce(async (id: string, ideaValue: string) => {
      // Check for id and non-test user remains the same
      if (id && !isTestUser) {
        console.log("Debounced update idea:", id, typeof ideaValue === 'string' ? ideaValue.substring(0, 20) + "..." : "Invalid idea value");
        const { error } = await supabase
          .from("projects")
          .update({ idea: ideaValue })
          .eq("id", id);
        if (error) console.error("Error debounced updating idea:", error);
      } else if (!id) {
         console.log("Debounced update idea skipped: No project ID yet.");
      }
    }, 1000)
  ).current;

  // Watch idea changes for debounced update
  useEffect(() => {
    const subscription = ideaForm.watch((value, { name }) => {
      // Now it correctly waits for projectId to be set
      if (name === 'idea' && projectId && value.idea !== undefined) {
        debouncedUpdateIdea(projectId, value.idea);
      }
    });
    return () => subscription.unsubscribe();
  }, [ideaForm, debouncedUpdateIdea, projectId, isTestUser]); // Added projectId dependency


  // Debounced update function for details
  const debouncedUpdateDetails = useRef(
    debounce(async (id: string, detailsValue: any) => {
      // Check for id and non-test user remains the same
      if (id && !isTestUser) {
        console.log("Debounced update details:", id, detailsValue);
        const { error } = await supabase
          .from("projects")
          .update({ product_details: detailsValue })
          .eq("id", id);
        if (error) console.error("Error debounced updating details:", error);
       } else if (!id) {
         console.log("Debounced update details skipped: No project ID yet.");
      }
    }, 1000)
  ).current;

   // Watch details changes for debounced update
  useEffect(() => {
    const subscription = detailsForm.watch((value) => {
       // Now it correctly waits for projectId to be set
      if (projectId) {
        debouncedUpdateDetails(projectId, value);
      }
    });
    return () => subscription.unsubscribe();
  }, [detailsForm, debouncedUpdateDetails, projectId, isTestUser]); // Added projectId dependency


  // Update project tools immediately on change
  useEffect(() => {
    const updateProjectTools = async () => {
      // Condition remains the same: needs projectId
      if (projectId && !isTestUser && selectedTools.length > 0) {
         console.log("Updating project tools:", projectId, selectedTools);
         const { error } = await supabase
          .from("projects")
          .update({ selected_tools: selectedTools })
          .eq("id", projectId);

        if (error) {
          console.error("Error updating project tools:", error);
        }
      }
    };
    // Condition remains the same: needs projectId
    if(projectId) {
        updateProjectTools();
    }
  }, [projectId, selectedTools, isTestUser]); // Dependencies are correct


  // --- Handlers for project name, AI features, steps, submission ---

  const toggleEditName = () => setIsEditingName(!isEditingName);

  const saveProjectName = async () => {
    const trimmedName = projectName.trim();
    const finalName = trimmedName === "" ? "Untitled Project" : trimmedName;
    setProjectName(finalName);
    setIsEditingName(false);

    // Only update if projectId exists (project has been initialized)
    if (projectId && !isTestUser) {
      console.log("Saving project name (manual):", projectId, finalName);
      try {
        const { error } = await supabase.from("projects").update({ name: finalName }).eq("id", projectId);
        if (error) throw error;
        toast({ title: "Project name updated" });
      } catch (error) {
        console.error("Error updating project name:", error);
        toast({ title: "Error updating name", variant: "destructive" });
      }
    } else if (!projectId) {
        console.log("Project name saved locally, DB update skipped (no project ID yet).")
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveProjectName();
    else if (e.key === "Escape") setIsEditingName(false);
  };

  // Handle idea refinement
  const handleRefineIdea = async () => {
    setIsRefining(true);
    let currentProjectId = projectId; // Capture current projectId

    try {
      const idea = ideaForm.getValues("idea");
      if (!idea || idea.length < 10) {
        toast({ title: "Please provide a more detailed idea (at least 10 characters)", variant: "destructive" });
        return;
      }

      // *** Initialize project if not already done ***
      if (!currentProjectId) {
        console.log("handleRefineIdea: Project not initialized, calling initializeProject...");
        currentProjectId = await initializeProject(idea);
        if (!currentProjectId) {
          console.error("handleRefineIdea: Project initialization failed.");
          // initializeProject should show a toast, so just return
          return;
        }
        console.log("handleRefineIdea: Project initialized with ID:", currentProjectId);
      } else {
        console.log("handleRefineIdea: Project already initialized with ID:", currentProjectId);
      }

      // Ensure we have a valid project ID before proceeding
       if (!currentProjectId) {
           console.error("handleRefineIdea: Aborting refine, project ID is still missing after initialization attempt.");
           toast({ title: "Error", description: "Could not associate idea with a project.", variant: "destructive"});
           return;
       }

      // Call the refineIdea method exposed by the Step1 component
      const refinedIdea = await step1Ref.current?.refineIdea(idea);

      if (refinedIdea) {
        // Update form with refined idea
        ideaForm.setValue("idea", refinedIdea);

        // Update database for real users (using the potentially newly acquired currentProjectId)
        if (!isTestUser && currentProjectId) {
          // Add a small delay to ensure state is updated (optional, might not be needed if state updates are reliable)
          setTimeout(async () => {
            const currentQuestions = step1Ref.current?.getClarifyingQuestions() || [];
            console.log("Questions to save to database:", JSON.stringify(currentQuestions));

             if (currentQuestions.length === 0) {
               console.warn("Warning: No clarifying questions to save.");
             }

            try {
              console.log("Updating project in DB with refined idea/questions. Project ID:", currentProjectId);
              const { error: updateError } = await supabase
                .from("projects")
                .update({
                  refined_idea: refinedIdea,
                  clarifying_questions: currentQuestions
                  // Note: 'idea' field is updated via debouncer based on form change
                })
                .eq("id", currentProjectId); // Use the correct project ID

              if (updateError) {
                console.error("Error updating project:", updateError);
                throw updateError;
              }

              console.log("Successfully updated project with refined idea and questions");

              // Log credit usage & update user credits (using the correct project ID)
              if (user) {
                await logCreditUsage(user.id, currentProjectId, "idea_refinement", 50);
                await updateUserCredits(user.id, user.credits_remaining - 50);
              }
            } catch (error) {
              console.error("Error in database update:", error);
              toast({
                title: "Error saving refined data",
                description: "Your refined idea was generated but couldn't be fully saved.",
                variant: "destructive"
              });
            }
          }, 100); // Slightly reduced delay
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

  // handleGenerateAnswer needs to ensure projectId exists
  const handleGenerateAnswer = async (field: DetailField) => {
    const idea = ideaForm.getValues("idea");
    if (!idea || idea.length < 10) {
      toast({ title: "Please provide your idea first", variant: "destructive" });
      return;
    }
    // *** Crucially, check if projectId exists ***
    if (!projectId) {
      toast({ title: "Project not ready", description: "Please refine your idea or move to the next step first.", variant: "destructive" });
      // Or potentially call initializeProject here? Depends on desired UX.
      // For now, we require the project to be initialized before generating details.
      return;
    }

    setGeneratingAnswerField(field);
    setIsGeneratingAnswer(true);

    try {
      if (!isTestUser && user && user.credits_remaining < 25) {
        toast({ title: "Insufficient credits (25 needed)", variant: "destructive" });
        setIsGeneratingAnswer(false); // Reset loading state early
        setGeneratingAnswerField(null);
        return;
      }

      // Logic remains mostly the same, Step3 component needs the projectId
      console.log(`Preparing to generate AI answer for ${field} (Project: ${projectId})`);

      // Delegate the actual call to Step3, passing projectId is essential
      // Ensure Step3 component receives and uses the projectId prop correctly

    } catch (error) {
      setIsGeneratingAnswer(false);
      setGeneratingAnswerField(null); // Reset field-specific loading state on error too
      console.error(`Error generating answer for ${field}:`, error);
      toast({ title: "Answer generation failed", variant: "destructive" });
    }
    // Note: Resetting loading state should happen within Step3 upon completion/error
  };

  // handleGeneratePlan needs to ensure projectId exists
   const handleGeneratePlan = async () => {
     setIsGeneratingPlan(true);
     try {
       // *** Crucially, check if projectId exists ***
       if (!projectId) {
         toast({ title: "Project not ready", description: "Cannot generate plan without a project.", variant: "destructive" });
         setIsGeneratingPlan(false);
         return;
       }

      // Delegate to Step4, passing projectId is essential
      const generatedPlan = await step4Ref.current?.generateGeminiPlan(); // Assumes Step4 uses the projectId prop

      if (generatedPlan) {
        setProjectPlan(generatedPlan);

        if (!isTestUser && projectId) {
          const { error: updateError } = await supabase
            .from("projects")
            .update({ project_plan: generatedPlan })
            .eq("id", projectId); // Use projectId
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


  const navigateToStep = async (step: number) => { // Make async
    let currentProjectId = projectId; // Capture current projectId

    // Basic validation before moving forward
    if (step > activeStep) {
      if (activeStep === 1) {
        const isValid = await ideaForm.trigger("idea"); // Trigger validation
        if (!isValid) return; // Stop if validation fails
        const ideaValue = ideaForm.getValues("idea");
        // Check length again just in case
        if (!ideaValue || ideaValue.length < 10) {
          toast({ title: "Idea must be at least 10 characters", variant: "destructive"});
          return;
        }

        // *** Initialize Project if moving from Step 1 to Step 2 ***
        if (step === 2 && !currentProjectId) {
          console.log("navigateToStep (1->2): Project not initialized, calling initializeProject...");
          currentProjectId = await initializeProject(ideaValue);
          if (!currentProjectId) {
              console.error("navigateToStep (1->2): Project initialization failed.");
              // initializeProject shows toast, so just return
              return;
          }
           console.log("navigateToStep (1->2): Project initialized with ID:", currentProjectId);
        }
      }
      // Add validation triggers for other steps if needed
      if (activeStep === 3 && step === 4) {
          // Potentially trigger validation for detailsForm if required fields exist
          // const detailsValid = await detailsForm.trigger();
          // if (!detailsValid) return;
      }
      if (activeStep === 4 && step === 5 && !projectPlan) {
          toast({ title: "Please generate the project plan first", variant: "destructive"});
          return;
      }
    } else if (step < activeStep) {
        // When navigating back to Step 1, refresh clarifying questions (if project exists)
        if (step === 1 && currentProjectId && !isTestUser) {
            const refreshClarifyingQuestions = async () => {
                try {
                    console.log("Refreshing clarifying questions for project:", currentProjectId);
                    const { data, error } = await supabase
                      .from("projects")
                      .select("clarifying_questions")
                      .eq("id", currentProjectId) // Use currentProjectId
                      .single();

                    if (error) {
                      console.error("Error refreshing clarifying questions:", error);
                      return;
                    }

                    if (data?.clarifying_questions) {
                       console.log("Refreshed clarifying questions:", JSON.stringify(data.clarifying_questions));
                       // Ensure questions have UI state properties when setting
                       const formatted = data.clarifying_questions.map((q: any) => ({ ...q, isEditing: false, isDeleted: false }));
                       setClarifyingQuestions(formatted);
                    } else {
                       console.log("No clarifying questions found in DB to refresh.");
                       setClarifyingQuestions([]); // Clear local state if none found
                    }
                } catch (error) {
                    console.error("Error in refreshClarifyingQuestions:", error);
                }
            };
            refreshClarifyingQuestions();
        }
    }

    // Ensure project ID exists before moving past step 1
    if (step > 1 && !currentProjectId) {
        console.warn(`Navigation to step ${step} blocked: Project ID is missing.`);
        toast({ title: "Project Error", description: "Please complete the idea step first.", variant: "destructive"});
        return;
    }

    setActiveStep(step);
  };

  const toggleRecording = () => setIsRecording(!isRecording);

  const handleTranscription = async (text: string, audioUrl: string) => {
     // Update form value first
    const currentIdea = ideaForm.getValues("idea");
    const updatedIdea = currentIdea ? `${currentIdea}\n\n--- Transcription ---\n${text}` : text;
    ideaForm.setValue("idea", updatedIdea, { shouldValidate: true }); // Trigger validation
    setVoiceNoteUrl(audioUrl);

    // Check if idea is now long enough to potentially initialize project
    if (updatedIdea.length >= 10 && !projectId) {
        console.log("Transcription resulted in sufficient idea length. Initializing project...");
        const newProjectId = await initializeProject(updatedIdea);
        if (newProjectId && !isTestUser) {
            // Project initialized, now update the voice note URL
            console.log("Updating voice note URL after transcription init:", newProjectId, audioUrl);
            const { error } = await supabase
                .from("projects")
                .update({ voice_note_url: audioUrl })
                .eq("id", newProjectId);
            if (error) console.error("Error updating project with voice note URL:", error);
        } else if (projectId && !isTestUser) {
             // Project already existed, just update URL
            console.log("Updating voice note URL (project already exists):", projectId, audioUrl);
            const { error } = await supabase
                .from("projects")
                .update({ voice_note_url: audioUrl })
                .eq("id", projectId);
            if (error) console.error("Error updating project with voice note URL:", error);
        }
    } else if (projectId && !isTestUser) {
        // Project existed before transcription, just update URL
        console.log("Updating voice note URL (project existed):", projectId, audioUrl);
        const { error } = await supabase
            .from("projects")
            .update({ voice_note_url: audioUrl })
            .eq("id", projectId);
        if (error) console.error("Error updating project with voice note URL:", error);
    }

    setIsRecording(false);
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

  // Add a function to mark the project as completed
  const markProjectAsCompleted = async () => {
    if (!projectId || isTestUser) return;
    
    console.log("Marking project as completed:", projectId);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "completed" })
        .eq("id", projectId);
        
      if (error) {
        console.error("Error marking project as completed:", error);
        throw error;
      }
      
      console.log("Project successfully marked as completed");
      // Optionally refresh user data if needed
      if (refreshUser) await refreshUser();
    } catch (err) {
      console.error("Failed to mark project as completed:", err);
      toast({ 
        title: "Status update failed", 
        description: "Could not update project status, but your document was generated successfully.",
        variant: "destructive" 
      });
    }
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
            navigateToStep={navigateToStep}
            projectId={projectId}
            projectPlan={projectPlan}
            markProjectAsCompleted={markProjectAsCompleted}
          />
        )}
      </div>
    </div>
  );
}
