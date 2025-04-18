"use client";

// Step3Details — Clarifying Q&A editing + AI answer generation
// v2.0 – April 18 2025 (ported to refactored structure)

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/auth-provider";
import { useWizard } from "../WizardContext";

export type ClarifyingQuestion = {
  question: string;
  suggestedAnswer: string;
  userAnswer?: string;
};

export default function Step3Details() {
  const { setActiveStep, projectId, isTestUser } = useWizard();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);

  // fetch clarifying_questions once
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("clarifying_questions")
        .eq("id", projectId)
        .single();

      if (error) {
        toast({ title: "Failed to load questions", description: error.message, variant: "destructive" });
      } else {
        setQuestions(data?.clarifying_questions ?? []);
      }
      setLoading(false);
    })();
  }, [projectId, toast]);

  // helper to persist array
  const persistQuestions = async (updated: ClarifyingQuestion[]) => {
    const { error } = await supabase.from("projects").update({ clarifying_questions: updated }).eq("id", projectId);
    if (error) throw error;
    setQuestions(updated);
  };

  const generateAIAnswer = async (idx: number) => {
    setGeneratingIdx(idx);
    try {
      const q = questions[idx];
      const resp = await fetch("/api/gemini-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.question, suggestedAnswer: q.suggestedAnswer }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `Gemini failed (${resp.status})`);
      }
      const { answer } = await resp.json();
      const updated = [...questions];
      updated[idx] = { ...q, userAnswer: answer };
      await persistQuestions(updated);
      toast({ title: "AI answer inserted" });
    } catch (err: any) {
      toast({ title: "AI generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingIdx(null);
      if (!isTestUser) await refreshUser();
    }
  };

  const handleChange = (idx: number, val: string) => {
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, userAnswer: val } : q)));
  };

  // ---------------- render ----------------
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3 — Product Details</CardTitle>
        <CardDescription>Edit the answers below or let AI help. Changes are saved on Next.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {questions.map((q, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{q.question}</p>
              <Button
                size="sm"
                variant="ghost"
                disabled={generatingIdx !== null}
                onClick={() => generateAIAnswer(idx)}
                className="text-xs"
              >
                {generatingIdx === idx ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                {generatingIdx === idx ? "Generating…" : "AI Answer"}
              </Button>
            </div>
            <Textarea
              rows={3}
              placeholder={q.suggestedAnswer ? `Suggested: ${q.suggestedAnswer}` : "Type your answer…"}
              value={q.userAnswer ?? ""}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep(2)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          disabled={saving || generatingIdx !== null}
          onClick={async () => {
            setSaving(true);
            try {
              await persistQuestions(questions);
              setActiveStep(4);
            } catch (err: any) {
              toast({ title: "Save failed", description: err.message, variant: "destructive" });
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}