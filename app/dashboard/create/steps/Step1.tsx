// Step1.tsx — Idea capture + inline interactive refinement (Q&A)
// v0.4 – April 17 2025

"use client";

import React, { forwardRef, useImperativeHandle } from "react";
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

// --- Icons & helpers ----------------------------------
import { Mic, MicOff, Sparkles, Loader2, ArrowRight } from "lucide-react";
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
}

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
  } = props;

  // Expose refineIdea to parent via `ref`
  useImperativeHandle(ref, () => ({
    refineIdea: async (idea: string) => {
      try {
        const resp = await fetch("/api/enhance-idea", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error ?? `Enhance‑idea failed (${resp.status})`);
        }
        const data: { enhancedIdea?: string } = await resp.json();
        return data.enhancedIdea;
      } catch (e) {
        console.error("[Step1] refineIdea error", e);
        throw e;
      }
    },
  }));

  const ideaValue = ideaForm.watch("idea");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 — Your Idea</CardTitle>
        <CardDescription>
          Describe your product idea in detail. What problem does it solve? What makes it unique? &nbsp;You can type or record audio, then optionally let our AI refine it.
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
                  <FormLabel>* Your Idea</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product idea in detail…"
                        className="min-h-[200px] resize-none pr-[180px]"
                        {...field}
                      />
                    </FormControl>

                    {/* Action buttons */}
                    <div className="absolute right-3 top-3 flex flex-col gap-2">
                      {/* Audio record */}
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

                      {/* AI refine */}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleRefineIdea}
                        disabled={isRefining || !field.value || field.value.length < 10}
                      >
                        {isRefining ? (
                          <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Refining…
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-4 w-4" /> Refine
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isRecording && (
                    <div className="mt-4 rounded-md border p-4">
                      <p className="mb-2 text-sm text-muted-foreground">Recording audio…</p>
                      <AudioRecorder onTranscription={handleTranscription} />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
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
