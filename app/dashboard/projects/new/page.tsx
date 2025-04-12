"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, ArrowRight, Mic, MicOff, Sparkles, Loader2, Check, Edit2, Save, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AIToolSelector } from "@/components/ai-tool-selector"
import { AudioRecorder } from "@/components/audio-recorder"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase-client" // Import from centralized client
import { generateDocuments } from "@/lib/generate-documents"

// Form schema for Step 1: Idea
const ideaFormSchema = z.object({
  idea: z.string().min(10, { message: "Your idea must be at least 10 characters" }),
})

// Form schema for Step 3: Details
const detailsFormSchema = z.object({
  targetAudience: z.string().optional(),
  problemSolved: z.string().optional(),
  keyFeatures: z.string().optional(),
  successMetrics: z.string().optional(),
  timeline: z.string().optional(),
})

// Document types available for generation
const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄" },
  { id: "user_flow", title: "User Flow", icon: "🔄" },
  { id: "architecture", title: "Architecture Document", icon: "🏗️" },
  { id: "schema", title: "Database Schema", icon: "🗄️" },
  { id: "api_spec", title: "API Specification", icon: "🔌" },
]

// Function to create a new project
const createNewProject = async (userId: string, projectName: string) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .insert([{ user_id: userId, name: projectName }])
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    return { success: true, project }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return { success: false, error: error.message }
  }
}

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(["prd", "user_flow", "architecture"]) // Default selections
  const [projectPlan, setProjectPlan] = useState<string>("")
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string>("")

  // Project name state
  const [projectName, setProjectName] = useState("Untitled Project")
  const [isEditingName, setIsEditingName] = useState(false)
  const projectNameInputRef = useRef<HTMLInputElement>(null)
  const [projectId, setProjectId] = useState<string>("")
  const [isTestUser, setIsTestUser] = useState(false)
  const [hasCheckedLimits, setHasCheckedLimits] = useState(false)

  // Initialize forms
  const ideaForm = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      idea: "",
    },
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

  // Focus input when editing project name
  useEffect(() => {
    if (isEditingName && projectNameInputRef.current) {
      projectNameInputRef.current.focus()
    }
  }, [isEditingName])

  // Check project limits on mount
  useEffect(() => {
    const checkProjectLimits = async () => {
      if (!user || hasCheckedLimits) return

      try {
        // Check if this is the test user
        if (user.email === "test@example.com") {
          setIsTestUser(true)
          // Generate a mock project ID for the test user
          setProjectId(`test-project-${Date.now()}`)
          setHasCheckedLimits(true)
          return
        }

        // For real users, check against the database
        const { data: projects, error } = await supabase.from("projects").select("id").eq("user_id", user.id)

        if (error) {
          console.error("Error fetching projects:", error)
          throw error
        }

        if (projects && projects.length >= user.projects_limit) {
          toast({
            title: "Project limit reached",
            description: `You've reached your limit of ${user.projects_limit} projects. Please upgrade your plan or delete existing projects.`,
            variant: "destructive",
          })
          router.push("/dashboard/projects")
          return
        }

        // Only create a new project if we don't already have a project ID
        if (!projectId) {
          // Create a new project using the improved function
          const result = await createNewProject(user.id, projectName)

          if (!result.success) {
            toast({
              title: "Error creating project",
              description: result.error || "There was an error creating your project. Please try again.",
              variant: "destructive",
            })
            return
          }

          setProjectId(result.project.id)
        }
        
        setHasCheckedLimits(true)
      } catch (error) {
        console.error("Error checking project limits:", error)
        toast({
          title: "Error creating project",
          description: "There was an error creating your project. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (user && !hasCheckedLimits) {
      checkProjectLimits()
    }
  }, [user, router, toast, projectName, projectId, hasCheckedLimits, isTestUser])

  // Handle project name edit toggle
  const toggleEditName = () => {
    setIsEditingName(!isEditingName)
  }

  // Handle project name save
  const saveProjectName = async () => {
    if (projectName.trim() === "") {
      setProjectName("Untitled Project")
    }
    setIsEditingName(false)

    if (projectId && !isTestUser) {
      try {
        const { error } = await supabase.from("projects").update({ name: projectName }).eq("id", projectId)

        if (error) throw error

        toast({
          title: "Project name updated",
          description: `Project name has been set to "${projectName}"`,
        })
      } catch (error) {
        console.error("Error updating project name:", error)
        toast({
          title: "Error updating project name",
          description: "There was an error updating your project name. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle project name input keydown
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveProjectName()
    } else if (e.key === "Escape") {
      setIsEditingName(false)
    }
  }

  // Handle idea refinement
  const handleRefineIdea = async () => {
    const idea = ideaForm.getValues("idea")
    if (!idea || idea.length < 10) {
      toast({
        title: "Idea too short",
        description: "Please provide a more detailed idea before refining.",
        variant: "destructive",
      })
      return
    }

    setIsRefining(true)
    try {
      // Check credits
      if (user && user.credits_remaining < 50) {
        toast({
          title: "Insufficient credits",
          description: "You don't have enough credits to refine your idea. Please upgrade your plan.",
          variant: "destructive",
        })
        return
      }

      // In a real app, this would call an API endpoint that uses OpenAI
      // For now, we'll simulate the refinement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const refinedIdea = `${idea}\n\nRefined version: This innovative product concept aims to solve [key problem] for [target audience] by providing [unique value proposition]. It differentiates from existing solutions by [key differentiator] and has potential for [market opportunity].`

      ideaForm.setValue("idea", refinedIdea)

      // Update project in database if not test user
      if (projectId && !isTestUser) {
        const { error } = await supabase
          .from("projects")
          .update({
            idea: refinedIdea,
            refined_idea: refinedIdea,
          })
          .eq("id", projectId)

        if (error) throw error

        // Log credit usage
        if (user) {
          const { error } = await supabase.from("credit_usage_log").insert([
            {
              user_id: user.id,
              project_id: projectId,
              action: "idea_refinement",
              credits_used: 50,
            },
          ])

          if (error) throw error

          // Update user credits
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              credits_remaining: user.credits_remaining - 50,
            })
            .eq("id", user.id)

          if (updateError) throw updateError
        }
      }

      toast({
        title: "Idea refined",
        description: "Your idea has been refined with AI assistance.",
      })
    } catch (error) {
      console.error("Error refining idea:", error)
      toast({
        title: "Refinement failed",
        description: "There was an error refining your idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefining(false)
    }
  }

  // Handle AI answer generation for a specific question
  const handleGenerateAnswer = async (field: keyof z.infer<typeof detailsFormSchema>) => {
    const idea = ideaForm.getValues("idea")
    if (!idea || idea.length < 10) {
      toast({
        title: "Idea required",
        description: "Please provide your idea first before generating answers.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check credits
      if (user && user.credits_remaining < 25) {
        toast({
          title: "Insufficient credits",
          description: "You don't have enough credits to generate an answer. Please upgrade your plan.",
          variant: "destructive",
        })
        return
      }

      // In a real app, this would call an API endpoint that uses OpenAI
      // For now, we'll simulate the answer generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let answer = ""
      switch (field) {
        case "targetAudience":
          answer =
            "The primary target audience includes tech-savvy professionals aged 25-45 who need efficient documentation solutions, as well as small to medium-sized product teams looking to streamline their documentation process."
          break
        case "problemSolved":
          answer =
            "This product solves the challenge of time-consuming and inconsistent documentation creation by automating the generation of standardized, high-quality product documentation, reducing manual effort by up to 70%."
          break
        case "keyFeatures":
          answer =
            "Key features include AI-powered document generation, customizable templates, real-time collaboration, version control, and seamless integration with popular project management tools."
          break
        case "successMetrics":
          answer =
            "Success will be measured by user adoption rate, time saved per document (target: 2+ hours), user satisfaction scores (target: 8+/10), and subscription conversion rate from free to paid tiers."
          break
        case "timeline":
          answer =
            "The development timeline includes 2 weeks for MVP, 1 month for beta testing with early users, and full launch within 3 months, followed by feature enhancements based on user feedback."
          break
      }

      detailsForm.setValue(field, answer)

      // Update project in database if not test user
      if (projectId && !isTestUser) {
        const currentDetails = detailsForm.getValues()
        currentDetails[field] = answer

        const { error } = await supabase
          .from("projects")
          .update({
            product_details: currentDetails,
          })
          .eq("id", projectId)

        if (error) throw error

        // Log credit usage
        if (user) {
          const { error } = await supabase.from("credit_usage_log").insert([
            {
              user_id: user.id,
              project_id: projectId,
              action: "ai_answer",
              credits_used: 25,
            },
          ])

          if (error) throw error

          // Update user credits
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              credits_remaining: user.credits_remaining - 25,
            })
            .eq("id", user.id)

          if (updateError) throw updateError
        }
      }

      toast({
        title: "Answer generated",
        description: `AI has generated an answer for "${field.replace(/([A-Z])/g, " $1").toLowerCase()}"`,
      })
    } catch (error) {
      console.error("Error generating answer:", error)
      toast({
        title: "Answer generation failed",
        description: "There was an error generating the answer. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle plan generation
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true)
    try {
      // Check credits
      if (user && user.credits_remaining < 100) {
        toast({
          title: "Insufficient credits",
          description: "You don't have enough credits to generate a plan. Please upgrade your plan.",
          variant: "destructive",
        })
        return
      }

      const idea = ideaForm.getValues("idea")
      const details = detailsForm.getValues()

      // In a real app, this would call an API endpoint that uses OpenAI
      // For now, we'll simulate the plan generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const generatedPlan = `# Project Development Plan

## Overview
This plan outlines the development approach for ${projectName}, based on the provided idea and requirements.

## Phase 1: Research & Planning (2 weeks)
- Market research and competitor analysis
- User persona development
- Feature prioritization
- Technical stack selection (${selectedTools.join(", ")})
- Resource allocation

## Phase 2: Design & Architecture (3 weeks)
- UI/UX design
- System architecture design
- Database schema design
- API specification
- Security planning

## Phase 3: Development (8 weeks)
- Core functionality implementation
- Integration with selected tools
- Database implementation
- API development
- Frontend development

## Phase 4: Testing & Refinement (3 weeks)
- Unit and integration testing
- User acceptance testing
- Performance optimization
- Security testing
- Bug fixes and refinements

## Phase 5: Deployment & Launch (2 weeks)
- Deployment preparation
- Documentation finalization
- Marketing materials preparation
- Soft launch
- Full public launch

## Timeline
Total estimated timeline: 18 weeks

## Success Criteria
- Meeting all specified requirements
- Passing all test cases
- User satisfaction metrics achieved
- Performance benchmarks met`

      setProjectPlan(generatedPlan)

      // Update project in database if not test user
      if (projectId && !isTestUser) {
        const { error } = await supabase
          .from("projects")
          .update({
            project_plan: generatedPlan,
          })
          .eq("id", projectId)

        if (error) throw error

        // Log credit usage
        if (user) {
          const { error } = await supabase.from("credit_usage_log").insert([
            {
              user_id: user.id,
              project_id: projectId,
              action: "plan_generation",
              credits_used: 100,
            },
          ])

          if (error) throw error

          // Update user credits
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              credits_remaining: user.credits_remaining - 100,
            })
            .eq("id", user.id)

          if (updateError) throw updateError
        }
      }

      toast({
        title: "Plan generated",
        description: "Your project plan has been generated with AI assistance.",
      })
    } catch (error) {
      console.error("Error generating plan:", error)
      toast({
        title: "Plan generation failed",
        description: "There was an error generating your project plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  // Handle form submission (final step)
  const handleGenerateDocuments = async () => {
    try {
      // Validate that at least one document is selected
      if (selectedDocuments.length === 0) {
        toast({
          title: "No documents selected",
          description: "Please select at least one document to generate.",
          variant: "destructive",
        })
        return
      }

      // Check credits
      if (user && user.credits_remaining < selectedDocuments.length * 200) {
        toast({
          title: "Insufficient credits",
          description: `You need ${selectedDocuments.length * 200} credits to generate these documents. Please upgrade your plan or select fewer documents.`,
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      // For test user, just simulate document generation
      if (isTestUser) {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: "Documents generation started",
          description: `${selectedDocuments.length} documents are being generated. You'll be notified when they're ready.`,
        })

        // Redirect to projects page for test user
        router.push("/dashboard/projects")
        return
      }

      // Update project status to 'completed'
      if (projectId) {
        // Update project status
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", projectId)

        if (updateError) {
          console.error("Error updating project status:", updateError)
          throw new Error("Failed to update project status")
        }

        // Generate documents using the improved function
        const result = await generateDocuments(projectId, selectedDocuments)

        if (!result.success) {
          throw new Error(result.error || "Document generation failed")
        }

        // Log credit usage
        if (user) {
          const { error } = await supabase.from("credit_usage_log").insert([
            {
              user_id: user.id,
              project_id: projectId,
              action: "document_generation",
              credits_used: selectedDocuments.length * 200,
            },
          ])

          if (error) {
            console.error("Error logging credit usage:", error)
            // Continue even if credit logging fails
          }

          // Update user credits
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              credits_remaining: user.credits_remaining - selectedDocuments.length * 200,
            })
            .eq("id", user.id)

          if (updateError) {
            console.error("Error updating user credits:", updateError)
            // Continue even if credit update fails
          }
        }

        toast({
          title: "Documents generation started",
          description: `${selectedDocuments.length} documents are being generated. You'll be notified when they're ready.`,
        })

        router.push(`/dashboard/projects/${projectId}`)
      }
    } catch (error) {
      console.error("Error generating documents:", error)
      toast({
        title: "Document generation failed",
        description:
          error instanceof Error ? error.message : "There was an error starting document generation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle step navigation
  const navigateToStep = (step: number) => {
    // Validate current step before proceeding
    if (activeStep === 1 && step > 1) {
      const result = ideaFormSchema.safeParse(ideaForm.getValues())
      if (!result.success) {
        ideaForm.trigger()
        return
      }
    }

    setActiveStep(step)
  }

  // Toggle audio recording
  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  // Handle transcription result
  const handleTranscription = async (text: string, audioUrl: string) => {
    const currentIdea = ideaForm.getValues("idea")
    const updatedIdea = currentIdea ? `${currentIdea}\n\n${text}` : text
    ideaForm.setValue("idea", updatedIdea, { shouldValidate: true })

    // Save voice note URL
    setVoiceNoteUrl(audioUrl)

    // Update project in database if not test user
    if (projectId && !isTestUser) {
      const { error } = await supabase
        .from("projects")
        .update({
          idea: updatedIdea,
          voice_note_url: audioUrl,
        })
        .eq("id", projectId)

      if (error) {
        console.error("Error updating project with transcription:", error)
      }
    }
  }

  // Update project in database when tools are selected
  useEffect(() => {
    const updateProjectTools = async () => {
      if (projectId && selectedTools.length > 0 && !isTestUser) {
        const { error } = await supabase
          .from("projects")
          .update({
            selected_tools: selectedTools,
          })
          .eq("id", projectId)

        if (error) {
          console.error("Error updating project tools:", error)
        }
      }
    }

    updateProjectTools()
  }, [projectId, selectedTools, isTestUser])

  // Update project details in database when form values change
  const onDetailsFormChange = async () => {
    if (projectId && !isTestUser) {
      const details = detailsForm.getValues()

      const { error } = await supabase
        .from("projects")
        .update({
          product_details: details,
        })
        .eq("id", projectId)

      if (error) {
        console.error("Error updating project details:", error)
      }
    }
  }

  // Add cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      // Reset all state when navigating away from the page
      setActiveStep(1);
      setIsRecording(false);
      setIsRefining(false);
      setIsGeneratingPlan(false);
      setIsSubmitting(false);
      setSelectedTools([]);
      setProjectPlan("");
      setVoiceNoteUrl("");
      setProjectName("Untitled Project");
      setIsEditingName(false);
      setProjectId("");
      setIsTestUser(false);
      setHasCheckedLimits(false);
      
      // Reset form values
      ideaForm.reset();
      detailsForm.reset();
    };
  }, [ideaForm, detailsForm]);

  return (
    <div className="space-y-6">
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
                className="h-9 text-xl font-bold"
              />
              <Button variant="ghost" size="sm" onClick={saveProjectName} className="ml-2">
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center ml-2">
              <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
              <Button variant="ghost" size="sm" onClick={toggleEditName} className="ml-2">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className="text-sm text-muted-foreground mr-4">
            {user && (
              <span>
                Credits: <span className="font-medium">{user.credits_remaining}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              onClick={() => navigateToStep(step)}
              disabled={step > activeStep + 1}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                activeStep === step
                  ? "bg-emerald-500 text-white"
                  : activeStep > step
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    : "bg-gray-200 text-gray-400 dark:bg-gray-800",
              )}
            >
              {activeStep > step ? <Check className="h-4 w-4" /> : step}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs">
          <span className={activeStep >= 1 ? "text-emerald-500 font-medium" : "text-muted-foreground"}>Idea</span>
          <span className={activeStep >= 2 ? "text-emerald-500 font-medium" : "text-muted-foreground"}>Tools</span>
          <span className={activeStep >= 3 ? "text-emerald-500 font-medium" : "text-muted-foreground"}>Details</span>
          <span className={activeStep >= 4 ? "text-emerald-500 font-medium" : "text-muted-foreground"}>Plan</span>
          <span className={activeStep >= 5 ? "text-emerald-500 font-medium" : "text-muted-foreground"}>Generate</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Idea */}
        {activeStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Your Idea</CardTitle>
              <CardDescription>
                Describe your product idea in detail. What problem does it solve? What makes it unique?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...ideaForm}>
                <form className="space-y-6">
                  <FormField
                    control={ideaForm.control}
                    name="idea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>* Your Idea</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Textarea
                              placeholder="Describe your product idea in detail..."
                              className="min-h-[200px] resize-none"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                // Update project in database if not test user
                                if (projectId && !isTestUser) {
                                  supabase
                                    .from("projects")
                                    .update({ idea: e.target.value })
                                    .eq("id", projectId)
                                    .then(({ error }) => {
                                      if (error) console.error("Error updating idea:", error)
                                    })
                                }
                              }}
                            />
                          </FormControl>

                          <div className="absolute right-3 top-3 flex space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={toggleRecording}
                              className={
                                isRecording ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700" : ""
                              }
                            >
                              {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                              {isRecording ? "Stop" : "Record"}
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleRefineIdea}
                              disabled={isRefining || !field.value || field.value.length < 10}
                            >
                              {isRefining ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Refining...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-1" /> Refine
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {isRecording && (
                          <div className="mt-4">
                            <AudioRecorder onTranscription={handleTranscription} />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard/projects">Cancel</Link>
              </Button>
              <Button
                type="button"
                onClick={() => navigateToStep(2)}
                disabled={!ideaForm.getValues().idea || ideaForm.getValues().idea.length < 10}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Tools */}
        {activeStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Select Tools</CardTitle>
              <CardDescription>Choose the technologies and tools you plan to use for this project.</CardDescription>
            </CardHeader>
            <CardContent>
              <AIToolSelector selectedTools={selectedTools} onSelectionChange={setSelectedTools} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigateToStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={() => navigateToStep(3)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Details */}
        {activeStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Product Details</CardTitle>
              <CardDescription>
                Answer these questions to help us understand your product better. You can skip questions or use AI to
                generate answers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...detailsForm}>
                <form className="space-y-6" onChange={onDetailsFormChange}>
                  <FormField
                    control={detailsForm.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Who is your target audience?</FormLabel>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateAnswer("targetAudience")}
                            className="text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> AI Answer
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea placeholder="Describe your target users..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={detailsForm.control}
                    name="problemSolved"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>What problem does your product solve?</FormLabel>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateAnswer("problemSolved")}
                            className="text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> AI Answer
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea placeholder="Describe the problem your product addresses..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={detailsForm.control}
                    name="keyFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>What are the key features of your product?</FormLabel>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateAnswer("keyFeatures")}
                            className="text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> AI Answer
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea placeholder="List the main features..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={detailsForm.control}
                    name="successMetrics"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>How will you measure success?</FormLabel>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateAnswer("successMetrics")}
                            className="text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> AI Answer
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea placeholder="Describe your success metrics..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={detailsForm.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>What is your expected timeline?</FormLabel>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateAnswer("timeline")}
                            className="text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> AI Answer
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea placeholder="Describe your project timeline..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigateToStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={() => navigateToStep(4)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Review & Plan */}
        {activeStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Review & Generate Plan</CardTitle>
              <CardDescription>
                Review your inputs and generate a project plan. You can go back to edit any section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Your Idea</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{ideaForm.getValues().idea}</p>
                  <Button variant="ghost" size="sm" onClick={() => navigateToStep(1)} className="mt-2">
                    Edit
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Selected Tools</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTools.length > 0 ? (
                      selectedTools.map((tool) => (
                        <div key={tool} className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
                          {tool}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tools selected</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigateToStep(2)} className="mt-2">
                    Edit
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Product Details</h3>
                  <div className="mt-2 space-y-3">
                    {Object.entries(detailsForm.getValues()).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="text-sm font-medium">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </h4>
                        <p className="text-sm">
                          {value || <span className="text-muted-foreground italic">Not provided</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigateToStep(3)} className="mt-2">
                    Edit
                  </Button>
                </div>

                {projectPlan ? (
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Project Plan</h3>
                    <div className="mt-2 prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap text-sm">{projectPlan}</pre>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePlan}
                      className="mt-2"
                      disabled={isGeneratingPlan}
                    >
                      {isGeneratingPlan ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" /> Regenerate Plan
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border p-8">
                    <p className="mb-4 text-center text-sm text-muted-foreground">
                      Generate a project plan based on your inputs. This will help guide your development process.
                    </p>
                    <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan}>
                      {isGeneratingPlan ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" /> Generate Project Plan
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigateToStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={() => navigateToStep(5)} disabled={!projectPlan}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 5: Generate Documents */}
        {activeStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Generate Documents</CardTitle>
              <CardDescription>
                Select the documents you want to generate for your project. This will use your available credits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Each document costs 200 credits to generate. You have {user?.credits_remaining || 0} credits
                  remaining.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {DOCUMENT_TYPES.map((doc) => (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-colors cursor-pointer",
                      selectedDocuments.includes(doc.id)
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-dashed hover:border-emerald-500 hover:bg-emerald-50/5",
                    )}
                    onClick={() => {
                      if (selectedDocuments.includes(doc.id)) {
                        setSelectedDocuments(selectedDocuments.filter((id) => id !== doc.id))
                      } else {
                        setSelectedDocuments([...selectedDocuments, doc.id])
                      }
                    }}
                  >
                    <div className="relative">
                      <span className="text-3xl mb-2">{doc.icon}</span>
                      {selectedDocuments.includes(doc.id) && (
                        <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium">{doc.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedDocuments.includes(doc.id) ? "Selected" : "Click to select"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigateToStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={selectedDocuments.length === 0 || isSubmitting}
                onClick={handleGenerateDocuments}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" /> Generate Documents ({selectedDocuments.length})
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
