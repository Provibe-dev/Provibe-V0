"use client";

// Step1Idea — Idea capture + interactive refinement (clarifying Qs)
// Adapted into refactored structure

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui components
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

// Icons & helpers
import { Mic, MicOff, Sparkles, Loader2, ArrowRight, X, Edit, Check } from "lucide-react";
import Link from "next/link";
import { AudioRecorder } from "@/components/audio-recorder";

import { useWizard } from "../WizardContext";
import { useAutoSaveField } from "@/lib/hooks/useAutoSaveField";

// ------------------- types -----------------------------
export type Step1IdeaHandle = {
  refineIdea: (idea: string) => Promise<string | undefined>;
  getClarifyingQuestions: () => ClarifyingQuestion[];
};

export type IdeaFormData = {
  idea: string;
};

type ClarifyingQuestion = {
  question: string;
  suggestedAnswer: string;
  userAnswer?: string;
  isEditing?: boolean;
  isDeleted?: boolean;
};

const ideaSchema = z.object({ idea: z.string().min(10) });

// -------------------------------------------------------
const Step1Idea = forwardRef<Step1IdeaHandle>((_, ref) => {
  const { projectId, setActiveStep } = useWizard();

  // react‑hook‑form instance local to this step
  const ideaForm = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: { idea: "" },
  });

  // debounce auto‑save to DB
  const saveIdea = useAutoSaveField(projectId ?? "", "idea");
  const ideaValue = ideaForm.watch("idea");
  saveIdea(ideaValue);

  // recording / refinement state
  const [isRecording, setIsRecording] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // clarifying questions state
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);

  // ---------------- voice recorder callbacks ------------
  const toggleRecording = () => setIsRecording((v) => !v);
  const handleTranscription = (text: string, audioUrl: string) => {
    const current = ideaForm.getValues("idea");
    const updated = current ? `${current}

--- Transcription ---
${text}` : text;
    ideaForm.setValue("idea", updated, { shouldValidate: true });
    // TODO: save voice_note_url via updateProject if needed
    setIsRecording(false);
  };

  // ---------------- AI refine & questions ---------------
  const refineIdea = async (idea: string) => {
    setIsLoadingQuestions(true);
    try {
      const resp = await fetch("/api/enhance-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!resp.ok) throw new Error(`enhance-idea failed ${resp.status}`);
      const data: { enhancedIdea?: string; clarifyingQuestions?: ClarifyingQuestion[] } =
        await resp.json();
      if (data.clarifyingQuestions) {
        const formatted = data.clarifyingQuestions.map((q) => ({
          ...q,
          userAnswer: q.suggestedAnswer,
          isEditing: false,
          isDeleted: false,
        }));
        setClarifyingQuestions(formatted);
      }
      return data.enhancedIdea;
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // expose methods to parent (rarely needed in new design but kept)
  useImperativeHandle(ref, () => ({
    refineIdea,
    getClarifyingQuestions: () =>
      clarifyingQuestions
        .filter((q) => !q.isDeleted)
        .map(({ question, suggestedAnswer, userAnswer }) => ({
          question,
          suggestedAnswer,
          userAnswer: userAnswer || suggestedAnswer,
        })),
  }));

  // UI helpers for questions --------------------------------
  const toggleEdit = (i: number) =>
    setClarifyingQuestions((qs) =>
      qs.map((q, idx) => (idx === i ? { ...q, isEditing: !q.isEditing } : q))
    );
  const updateAnswer = (i: number, a: string) =>
    setClarifyingQuestions((qs) =>
      qs.map((q, idx) => (idx === i ? { ...q, userAnswer: a } : q))
    );
  const deleteQ = (i: number) =>
    setClarifyingQuestions((qs) =>
      qs.map((q, idx) => (idx === i ? { ...q, isDeleted: true } : q))
    );
  const saveAnswer = (i: number) => toggleEdit(i);

  // ---------------------------------------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 — Your Idea</CardTitle>
        <CardDescription>
          Describe your product idea in detail. You can type or record audio, then let AI refine it
          and generate clarifying questions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Idea input form */}
        <Form {...ideaForm}>
          <FormField
            control={ideaForm.control}
            name="idea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>* Idea</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product idea…"
                      className="min-h-[200px] resize-none pr-[180px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="absolute right-3 top-3 flex flex-col gap-2">
                    {/* record button */}
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
                    {/* refine button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isRefining || isLoadingQuestions || !field.value || field.value.length < 10}
                      onClick={async () => {
                        setIsRefining(true);
                        try {
                          const enhanced = await refineIdea(field.value);
                          if (enhanced) ideaForm.setValue("idea", enhanced);
                        } finally {
                          setIsRefining(false);
                        }
                      }}
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
        </Form>

        {/* Clarifying questions */}
        {clarifyingQuestions.some((q) => !q.isDeleted) && (
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-medium">Clarifying Questions</h3>
            <p className="text-sm text-muted-foreground">
              You can edit or remove the suggested answers.
            </p>
            <Separator />
            {clarifyingQuestions.map((q, idx) =>
              q.isDeleted ? null : (
                <div key={idx} className="space-y-2 p-4 border rounded-md">
                  <div className="font-medium">{q.question}</div>
                  {q.isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={q.userAnswer || q.suggestedAnswer}
                        onChange={(e) => updateAnswer(idx, e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleEdit(idx)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveAnswer(idx)}>
                          <Check className="mr-1 h-4 w-4" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-muted p-3 rounded-md">
                      <p className="pr-16">{q.userAnswer || q.suggestedAnswer}</p>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleEdit(idx)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteQ(idx)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/projects">Cancel</Link>
        </Button>
        <Button type="button" disabled={!ideaValue || ideaValue.length < 10} onClick={() => setActiveStep(2)}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

Step1Idea.displayName = "Step1Idea";
export default Step1Idea;