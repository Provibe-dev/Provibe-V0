// /app/dashboard/create/steps/Step4.tsx
// v2.2 – April 18 2025
// -----------------------------------------------------------------------------
// • Displays ALL inputs collected so far: raw idea, refined idea, selected tools,
//   and each clarifying‑question ⇢ answer pair.
// • Added edit buttons that jump to prior steps.
// • Fetches the raw `idea` as well, and passes both `idea` & `refinedIdea` to
//   `/api/gemini-plan`.
// • Extra console logs for each render section.
// -----------------------------------------------------------------------------

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Edit2, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/components/auth-provider"
import ReactMarkdown from "react-markdown"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type ClarifyingQuestion = {
  question: string
  suggestedAnswer: string
  userAnswer?: string
}

export type Step4Props = {
  projectId: string
  selectedTools: string[]
  projectPlan: string
  setProjectPlan: (plan: string) => void
  isGeneratingPlan: boolean
  setIsGeneratingPlan: (b: boolean) => void
  navigateToStep: (step: number) => void
  isTestUser?: boolean
}

export default function Step4({
  projectId,
  selectedTools,
  projectPlan,
  setProjectPlan,
  isGeneratingPlan,
  setIsGeneratingPlan,
  navigateToStep,
  isTestUser,
}: Step4Props) {
  const { toast } = useToast()
  const { user, refreshUser } = useAuth()

  const [loading, setLoading] = useState(true)
  const [idea, setIdea] = useState("")
  const [refinedIdea, setRefinedIdea] = useState("")
  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([])

  // ---------------------------------------------------------------------------
  // Fetch project data
  // ---------------------------------------------------------------------------
  useEffect(() => {
    console.log("Step4: fetching idea, refined_idea & clarifying_questions …")
    ;(async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("idea, refined_idea, clarifying_questions")
        .eq("id", projectId)
        .single()

      if (error) {
        console.error("Step4: fetch error", error)
        toast({ title: "Failed to load project data", description: error.message, variant: "destructive" })
      } else {
        console.log("Step4: data fetched →", data)
        setIdea(data?.idea ?? "")
        setRefinedIdea(data?.refined_idea ?? "")
        setQuestions(data?.clarifying_questions ?? [])
      }
      setLoading(false)
    })()
  }, [projectId, toast])

  // ---------------------------------------------------------------------------
  // Gemini plan generation
  // ---------------------------------------------------------------------------
  const generateGeminiPlan = async () => {
    try {
      setIsGeneratingPlan(true)
      const payload = { idea, refinedIdea, clarifyingQuestions: questions, tools: selectedTools }
      console.log("Step4: POST /api/gemini-plan →", payload)

      const res = await fetch("/api/gemini-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? `Status ${res.status}`)
      }

      const { plan } = await res.json()
      console.log("Step4: plan received (chars)", plan.length)

      await supabase.from("projects").update({ plan }).eq("id", projectId)
      console.log("Step4: plan saved to DB")

      setProjectPlan(plan)
      toast({ title: "Project plan generated" })

      if (!isTestUser && user) {
        console.log("Step4: logging credit usage …")
        await logCreditUsage(user.id, projectId, "plan_generation", 50)
        await updateUserCredits(user.id, user.credits_remaining - 50)
        await refreshUser()
      }
    } catch (err: any) {
      console.error("Step4: plan generation failed", err)
      toast({ title: "Plan generation failed", description: err.message, variant: "destructive" })
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  const renderQuestion = (q: ClarifyingQuestion, i: number) => (
    <div key={i} className="space-y-1">
      <p className="font-medium text-foreground">{q.question}</p>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {q.userAnswer || q.suggestedAnswer || "No answer provided."}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Review & Generate Plan</CardTitle>
        <CardDescription>Ensure everything’s correct before continuing.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Raw Idea */}
        <section className="relative rounded-md border p-4">
          <h3 className="text-lg font-medium mb-1">Original Idea</h3>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => navigateToStep(1)}>
            <Edit2 className="mr-1 h-4 w-4" /> Edit
          </Button>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{idea || "N/A"}</p>
        </section>

        {/* Refined Idea */}
        <section className="relative rounded-md border p-4">
          <h3 className="text-lg font-medium mb-1">Refined Idea</h3>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => navigateToStep(1)}>
            <Edit2 className="mr-1 h-4 w-4" /> Edit
          </Button>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{refinedIdea || "N/A"}</p>
        </section>

        {/* Selected Tools */}
        <section className="relative rounded-md border p-4">
          <h3 className="text-lg font-medium mb-1">Selected Tools</h3>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => navigateToStep(2)}>
            <Edit2 className="mr-1 h-4 w-4" /> Edit
          </Button>
          {selectedTools.length ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedTools.map((t) => (
                <span key={t} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">No tools selected.</p>
          )}
        </section>

        {/* Clarifying Questions */}
        <section className="relative rounded-md border p-4 space-y-2">
          <h3 className="text-lg font-medium mb-1">Clarifying Questions</h3>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => navigateToStep(3)}>
            <Edit2 className="mr-1 h-4 w-4" /> Edit
          </Button>
          {questions.length ? questions.map(renderQuestion) : (
            <p className="text-sm text-muted-foreground">None.</p>
          )}
        </section>

        {/* Plan section */}
        <section className="mt-6">
          {projectPlan ? (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-2">Project Plan</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{projectPlan}</ReactMarkdown>
              </div>
              <Button variant="outline" size="sm" className="mt-4" disabled={isGeneratingPlan} onClick={generateGeminiPlan}>
                {isGeneratingPlan ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating…</> : "Regenerate Plan"}
              </Button>
            </div>
          ) : (
            <Button className="w-full" disabled={isGeneratingPlan} onClick={generateGeminiPlan}>
              {isGeneratingPlan ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan…</> : "Generate Project Plan"}
            </Button>
          )}
        </section>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigateToStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button disabled={!projectPlan || isGeneratingPlan} onClick={() => navigateToStep(5)}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Helpers – credit log
// -----------------------------------------------------------------------------
async function updateUserCredits(userId: string, newCreditAmount: number) {
  console.log("Step4: updating user credits →", newCreditAmount)
  const { supabase } = await import("@/lib/supabase-client")
  await supabase.from("profiles").update({ credits_remaining: newCreditAmount }).eq("id", userId)
}

async function logCreditUsage(userId: string, projectId: string, action: string, creditsUsed: number) {
  console.log("Step4: inserting credit_usage_log row")
  const { supabase } = await import("@/lib/supabase-client")
  await supabase.from("credit_usage_log").insert([{ user_id: userId, project_id: projectId, action, credits_used: creditsUsed }])
}
