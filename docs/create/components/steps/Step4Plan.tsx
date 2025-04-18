"use client";

// Step4Plan — Review inputs and generate project plan
// Ported into refactored structure; assumes idea/details are held in WizardContext (TBD)

import { forwardRef, useImperativeHandle } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, Loader2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth-provider";
import { useWizard } from "../WizardContext";
import { supabase } from "@/lib/supabase-client";

/**
 * NOTE: In the legacy file this component received `ideaForm`, `detailsForm`,
 * and other props. In the refactor we expect WizardContext to expose
 * `ideaForm`, `detailsForm`, `selectedTools`, `projectPlan`, setters, etc.
 * Adjust as you wire those into context.
 */

type PlanHandle = {
  generateGeminiPlan: () => Promise<string>;
};

const Step4Plan = forwardRef<PlanHandle>((_, ref) => {
  const {
    ideaForm,
    detailsForm,
    selectedTools,
    projectPlan,
    setProjectPlan,
    isGeneratingPlan,
    setIsGeneratingPlan,
    projectId,
    isTestUser,
    setActiveStep,
  } = useWizard();

  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const ideaValue = ideaForm?.getValues().idea ?? "";
  const detailValues = detailsForm?.getValues() ?? {};

  // --- Generate plan ------------------------------------
  const generateGeminiPlan = async () => {
    try {
      const resp = await fetch("/api/gemini-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: ideaValue, details: detailValues, tools: selectedTools }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `Gemini failed ${resp.status}`);
      }
      const { plan } = await resp.json();
      setProjectPlan(plan);

      // credit handling (50) — simplified
      if (!isTestUser && projectId && user) {
        try {
          await logCreditUsage(user.id, projectId, "plan_generation", 50);
          await updateUserCredits(user.id, user.credits_remaining - 50);
          await refreshUser();
        } catch (err) {
          toast({ title: "Credit update failed", variant: "destructive" });
        }
      }
      return plan;
    } catch (e: any) {
      toast({ title: "Plan generation failed", description: e.message, variant: "destructive" });
      throw e;
    }
  };

  useImperativeHandle(ref, () => ({ generateGeminiPlan }));

  // --- JSX ----------------------------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4 — Review & Generate Plan</CardTitle>
        <CardDescription>Review your inputs and generate a project plan.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Idea review */}
        <Section title="Your Idea" onEdit={() => setActiveStep(1)}>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {ideaValue || "No idea provided."}
          </p>
        </Section>

        {/* Tools review */}
        <Section title="Selected Tools" onEdit={() => setActiveStep(2)}>
          {selectedTools.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tools selected</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTools.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Details review */}
        <Section title="Project Details" onEdit={() => setActiveStep(3)}>
          {Object.values(detailValues).every((v) => !v) ? (
            <p className="text-sm text-muted-foreground">No details provided.</p>
          ) : (
            <div className="space-y-1 text-sm">
              {Object.entries(detailValues).map(([k, v]) =>
                v ? (
                  <div key={k}>
                    <span className="font-medium">{formatKey(k)}: </span>
                    <span className="text-muted-foreground">{String(v)}</span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </Section>

        {/* Plan output */}
        <div className="mt-6">
          {projectPlan ? (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium">Project Plan</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
                <ReactMarkdown>{projectPlan}</ReactMarkdown>
              </div>
              <Button
                onClick={generateGeminiPlan}
                disabled={isGeneratingPlan}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                {isGeneratingPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isGeneratingPlan ? "Regenerating…" : "Regenerate Plan"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={async () => {
                setIsGeneratingPlan(true);
                try {
                  await generateGeminiPlan();
                } finally {
                  setIsGeneratingPlan(false);
                }
              }}
              disabled={isGeneratingPlan}
              className="w-full"
              size="lg"
            >
              {isGeneratingPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isGeneratingPlan ? "Generating…" : "Generate Project Plan"}
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={() => setActiveStep(5)}
          disabled={!projectPlan || isGeneratingPlan}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

Step4Plan.displayName = "Step4Plan";
export default Step4Plan;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-md border p-4 relative group">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit} className="absolute top-2 right-2">
          <Edit2 className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

function formatKey(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

async function logCreditUsage(userId: string, projectId: string, action: string, credits: number) {
  await supabase.from("credit_usage_log").insert([{ user_id: userId, project_id: projectId, action, credits_used: credits }]);
}

async function updateUserCredits(userId: string, newCredits: number) {
  await supabase.from("profiles").update({ credits_remaining: newCredits }).eq("id", userId);
}