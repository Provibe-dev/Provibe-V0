"use client";

// Step5Generate — select docs, spend credits, trigger generation

import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/auth-provider";
import { useWizard } from "../WizardContext";

// available doc types
export const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄", cost: 200 },
  { id: "user_flow", title: "User Flow Diagram", icon: "🔄", cost: 200 },
  { id: "architecture", title: "System Architecture", icon: "🏗️", cost: 200 },
  { id: "schema", title: "Database Schema", icon: "🗄️", cost: 200 },
  { id: "api_spec", title: "API Specification", icon: "🔌", cost: 200 },
] as const;

type DocId = (typeof DOCUMENT_TYPES)[number]["id"];

export default function Step5Generate() {
  const {
    projectId,
    projectPlan,
    selectedDocuments,
    setSelectedDocuments,
    isSubmitting,
    setIsSubmitting,
    setActiveStep,
  } = useWizard();

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // ---- helpers ----------------------------------------
  const totalCost = selectedDocuments.reduce((sum, id) => {
    const doc = DOCUMENT_TYPES.find((d) => d.id === id);
    return sum + (doc?.cost || 0);
  }, 0);

  const canAfford = (user?.credits_remaining ?? 0) >= totalCost;

  const toggleDoc = (id: DocId) => {
    setSelectedDocuments((docs) =>
      docs.includes(id) ? docs.filter((d) => d !== id) : [...docs, id]
    );
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    try {
      if (!projectId) throw new Error("Project not ready");
      const resp = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedDocuments, projectPlan }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `Generation failed ${resp.status}`);
      }
      toast({ title: "Documents Generated", description: "We'll redirect once ready." });
      router.push(`/dashboard/projects/${projectId}/documents`);
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- JSX --------------------------------------------
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5 — Generate Documents</CardTitle>
        <CardDescription>Select the docs to generate and review credit cost.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* credit panel */}
        <div className="mb-6 rounded-md border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-950">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Credits Available: {user?.credits_remaining ?? "…"}
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Selected Documents Cost: {totalCost} credits
          </p>
          {selectedDocuments.length > 0 && !canAfford && (
            <p className="mt-1 text-sm font-semibold text-red-600 dark:text-red-400">
              Insufficient credits.
            </p>
          )}
        </div>

        {/* grid of doc cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_TYPES.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-6 text-center cursor-pointer",
                selectedDocuments.includes(doc.id)
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-900/50"
                  : "border-border bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md",
                !user && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => user && toggleDoc(doc.id as DocId)}
            >
              <div className="text-4xl mb-2">{doc.icon}</div>
              <h3 className="mt-2 font-semibold text-base">{doc.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{doc.cost} credits</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveStep(4)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isSubmitting || selectedDocuments.length === 0 || !canAfford}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Generating…" : `Generate (${totalCost} Credits)`}
        </Button>
      </CardFooter>
    </Card>
  );
}