// Step1.tsx — Idea capture + inline interactive refinement (Q&A)
// v0.5 – Updated with clarifying questions feature

"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

// --- UI components (shadcn/ui) -------------------------
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// --- Icons & helpers ----------------------------------
import { Mic, MicOff, Sparkles, Loader2, ArrowRight, X, Edit, Check } from "lucide-react";
import Link from "next/link";
import { AudioRecorder } from "@/components/audio-recorder";

// -------------------------------------------------------
// Types -------------------------------------------------
export type Step1Ref = {
  /**
   * Refine the idea text through the backend `/api/enhance-idea` endpoint.
   * Returns the enhanced idea string or `undefined` (caller should handle errors).
   */
  refineIdea: (idea: string) => Promise<string | undefined>;
  
  /**
   * Get the current clarifying questions
   * Returns the array of clarifying questions
   */
  getClarifyingQuestions: () => ClarifyingQuestion[];
};

export type IdeaFormData = {
  idea: string;
};

export interface Step1Props {
  ideaForm: UseFormReturn<IdeaFormData>;
  isRecording: boolean;
  toggleRecording: () => void;
  handleTranscription: (text: string, audioUrl: string) => void;
  navigateToStep: (step: number) => void;
  isRefining: boolean;
  handleRefineIdea: () => Promise<void>;
  projectId?: string;
  isTestUser?: boolean;
  clarifyingQuestionsData?: ClarifyingQuestion[]; // Add this prop to receive existing questions
}

// Clarifying question type
type ClarifyingQuestion = {
  question: string;
  suggestedAnswer: string;
  userAnswer?: string;
  isEditing?: boolean;
  isDeleted?: boolean;
};

// -------------------------------------------------------
const Step1 = forwardRef<Step1Ref, Step1Props>((props, ref) => {
  const {
    ideaForm,
    isRecording,
    toggleRecording,
    handleTranscription,
    navigateToStep,
    isRefining,
    handleRefineIdea,
    clarifyingQuestionsData,
  } = props;

  // State for clarifying questions
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Load existing questions when component mounts or when clarifyingQuestionsData changes
  useEffect(() => {
    console.log("DEBUG - Step1 received clarifyingQuestionsData:", 
      JSON.stringify(clarifyingQuestionsData));
    
    if (clarifyingQuestionsData && clarifyingQuestionsData.length > 0) {
      // Format the questions to include UI state properties
      const formattedQuestions = clarifyingQuestionsData.map(q => ({
        ...q,
        isEditing: false,
        isDeleted: false
      }));
      
      console.log("DEBUG - Setting clarifying questions state:", 
        JSON.stringify(formattedQuestions));
      setClarifyingQuestions(formattedQuestions);
    }
  }, [clarifyingQuestionsData]);

  // Add a debug log to check the state after it's set
  useEffect(() => {
    console.log("DEBUG - Current clarifyingQuestions state:", 
      JSON.stringify(clarifyingQuestions));
  }, [clarifyingQuestions]);

  // Expose refineIdea to parent via `ref`
  useImperativeHandle(ref, () => ({
    refineIdea: async (idea: string) => {
      try {
        setIsLoadingQuestions(true);
        const resp = await fetch("/api/enhance-idea", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea }),
        });

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({}));
          console.error("API error response:", resp.status, errorData);
          throw new Error(errorData.error ?? `Enhance-idea failed (${resp.status})`);
        }
        
        const data: { 
          enhancedIdea?: string;
          clarifyingQuestions?: ClarifyingQuestion[] 
        } = await resp.json();
        
        console.log("API response:", JSON.stringify(data));
        
        // Set clarifying questions with initial state
        if (data.clarifyingQuestions && data.clarifyingQuestions.length > 0) {
          const formattedQuestions = data.clarifyingQuestions.map(q => ({
            ...q,
            userAnswer: q.suggestedAnswer,
            isEditing: false,
            isDeleted: false
          }));
          
          console.log("Setting clarifying questions:", JSON.stringify(formattedQuestions));
          setClarifyingQuestions(formattedQuestions);
        }
        
        return data.enhancedIdea;
      } catch (e) {
        console.error("[Step1] refineIdea error", e);
        throw e;
      } finally {
        setIsLoadingQuestions(false);
      }
    },
    
    getClarifyingQuestions: () => {
      // Debug the current state
      console.log("Current clarifyingQuestions state:", JSON.stringify(clarifyingQuestions));
      
      // Filter out deleted questions and return in the format expected by the database
      const questions = clarifyingQuestions
        .filter(q => !q.isDeleted)
        .map(({ question, suggestedAnswer, userAnswer }) => ({
          question,
          suggestedAnswer,
          userAnswer: userAnswer || suggestedAnswer
        }));
      
      console.log("Returning clarifying questions for database:", JSON.stringify(questions));
      return questions;
    }
  }));

  const ideaValue = ideaForm.watch("idea");

  // Handle editing a question's answer
  const toggleEditQuestion = (index: number) => {
    setClarifyingQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, isEditing: !q.isEditing } : q
      )
    );
  };

  // Handle updating a question's answer
  const updateQuestionAnswer = (index: number, answer: string) => {
    setClarifyingQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, userAnswer: answer } : q
      )
    );
  };

  // Handle deleting a question
  const deleteQuestion = (index: number) => {
    setClarifyingQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, isDeleted: true } : q
      )
    );
  };

  // Handle saving a question's answer
  const saveQuestionAnswer = (index: number) => {
    setClarifyingQuestions(prev => 
      prev.map((q, i) => 
        i === index ? { ...q, isEditing: false } : q
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 — Your Idea</CardTitle>
        <CardDescription>
          Describe your product idea in detail. What problem does it solve? What makes it unique? &nbsp;You can type or record audio, then let our AI refine it and generate clarifying questions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...ideaForm}>
          <div className="space-y-6">
            <FormField
              control={ideaForm.control}
              name="idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Your Idea</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product idea in detail…"
                        className="min-h-[200px] resize-none pr-[180px]"
                        {...field}
                      />
                    </FormControl>

                    {/* Action buttons */}
                    <div className="absolute right-3 top-3 flex flex-col gap-2">
                      {/* Audio record */}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={toggleRecording}
                        className={isRecording ? "bg-red-100 text-red-600 hover:bg-red-200" : ""}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-1 h-4 w-4" /> Stop
                          </>
                        ) : (
                          <>
                            <Mic className="mr-1 h-4 w-4" /> Record
                          </>
                        )}
                      </Button>

                      {/* AI refine */}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleRefineIdea}
                        disabled={isRefining || isLoadingQuestions || !field.value || field.value.length < 10}
                      >
                        {isRefining || isLoadingQuestions ? (
                          <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" /> 
                            {isRefining ? "Refining…" : "Generating…"}
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-4 w-4" /> Refine & Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isRecording && (
                    <div className="mt-4 rounded-md border p-4">
                      <p className="mb-2 text-sm text-muted-foreground">Recording audio…</p>
                      <AudioRecorder onTranscription={handleTranscription} />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* Clarifying Questions Section */}
        {clarifyingQuestions.length > 0 ? (
          <div className="space-y-4 mt-8">
            <div>
              <h3 className="text-lg font-medium">Clarifying Questions</h3>
              <p className="text-sm text-muted-foreground">
                These questions help refine your idea. You can edit or remove the suggested answers.
              </p>
            </div>
            
            <Separator />
            
            {clarifyingQuestions.map((q, index) => (
              !q.isDeleted && (
                <div key={index} className="space-y-2 p-4 border rounded-md">
                  <div className="font-medium">{q.question}</div>
                  
                  {q.isEditing ? (
                    <div className="space-y-2">
                      <Textarea 
                        value={q.userAnswer || q.suggestedAnswer} 
                        onChange={(e) => updateQuestionAnswer(index, e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => toggleEditQuestion(index)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => saveQuestionAnswer(index)}
                        >
                          <Check className="mr-1 h-4 w-4" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-muted p-3 rounded-md">
                      <p className="pr-16">{q.userAnswer || q.suggestedAnswer}</p>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8" 
                          onClick={() => toggleEditQuestion(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8" 
                          onClick={() => deleteQuestion(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="mt-8">
            {/* Debug message - remove in production */}
            <p className="text-sm text-muted-foreground">No clarifying questions available.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/projects">Cancel</Link>
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(2)}
          disabled={!ideaValue || ideaValue.length < 10}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

Step1.displayName = "Step1";
export default Step1;
