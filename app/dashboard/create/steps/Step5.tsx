// /app/dashboard/create/steps/Step5.tsx
// v2.0 – April 19 2025 – Vertical progress bar, per‑doc generation & rich‑text viewer

"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  Loader2,
  PlayCircle,
  XCircle,
  RefreshCw,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"

// Dynamically import to avoid SSR markdown issues
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false })

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------
export const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄", cost: 200 },
  { id: "user_flow", title: "User Flow Diagram", icon: "🔄", cost: 200 },
  { id: "architecture", title: "System Architecture", icon: "🏗️", cost: 200 },
  { id: "schema", title: "Database Schema", icon: "🗄️", cost: 200 },
  { id: "api_spec", title: "API Specification", icon: "🔌", cost: 200 },
] as const

const WIZARD_STAGES = [
  { id: 1, label: "Idea" },
  { id: 2, label: "Tools" },
  { id: 3, label: "Details" },
  { id: 4, label: "Plan" },
  { id: 5, label: "Generate" },
] as const

type GenerationStatus = "idle" | "generating" | "done" | "error"

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
interface UserType {
  credits_remaining?: number
  id?: string
}

interface Step5Props {
  user: UserType | null
  navigateToStep: (step: number) => void
  projectId: string
  projectPlan: string
  markProjectAsCompleted?: () => Promise<void> // Add this prop
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export default function Step5({ 
  user, 
  navigateToStep, 
  projectId, 
  projectPlan,
  markProjectAsCompleted 
}: Step5Props) {
  const { toast } = useToast()

  // Add a state to track if we've already marked the project as completed
  const [hasMarkedCompleted, setHasMarkedCompleted] = useState(false)
  
  // Add a state to track if any document has been generated
  const [hasGeneratedAnyDocument, setHasGeneratedAnyDocument] = useState(false)

  // Check if any document is already generated when component mounts
  useEffect(() => {
    const checkExistingDocuments = async () => {
      if (!projectId) return
      
      try {
        const { data } = await supabase
          .from("project_documents")
          .select("type")
          .eq("project_id", projectId)
          .eq("status", "done")
          .limit(1)
        
        if (data && data.length > 0) {
          setHasGeneratedAnyDocument(true)
        }
      } catch (err) {
        console.error("Error checking existing documents:", err)
      }
    }
    
    checkExistingDocuments()
  }, [projectId])

  // ------------------------------------------------------------------------------------------------
  // Local State
  // ------------------------------------------------------------------------------------------------
  const [docStatus, setDocStatus] = useState<Record<string, GenerationStatus>>(() =>
    Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.id, "idle"]))
  )
  const [docContent, setDocContent] = useState<Record<string, string>>({})
  const [activeDocId, setActiveDocId] = useState<string | null>(null)

  // ------------------------------------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------------------------------------
  const creditsRemaining = user?.credits_remaining ?? 0
  const generationInProgress = useMemo(() => Object.values(docStatus).some((s) => s === "generating"), [docStatus])

  // Download document as markdown file
  const handleDownloadDocument = () => {
    if (!activeDocId || !docContent[activeDocId]) return;
    
    // Create a blob from the document content
    const blob = new Blob([docContent[activeDocId]], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement("a");
    const docType = DOCUMENT_TYPES.find(d => d.id === activeDocId);
    const filename = `${docType?.title.replace(/\s+/g, "-").toLowerCase() || activeDocId}.md`;
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Regenerate document
  const handleRegenerateDocument = async () => {
    if (!activeDocId || docStatus[activeDocId] === "generating") return;
    
    setDocStatus(prev => ({ ...prev, [activeDocId]: "generating" }));
    
    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedDocuments: [activeDocId], projectPlan }),
      });
      
      if (!res.ok) throw new Error("Failed to regenerate document");
      const { content } = await res.json();
      
      setDocStatus(prev => ({ ...prev, [activeDocId]: "done" }));
      setDocContent(prev => ({ ...prev, [activeDocId]: content }));
    } catch (err) {
      console.error(err);
      setDocStatus(prev => ({ ...prev, [activeDocId]: "error" }));
      toast({ 
        title: "Regeneration failed", 
        description: "Please try again.", 
        variant: "destructive" 
      });
    }
  };

  // fetch a single document's content from Supabase
  const loadDocContent = async (docId: string) => {
    const { data, error } = await supabase
      .from("project_documents")
      .select("content")
      .eq("project_id", projectId)
      .eq("type", docId)  // Changed from "id" to "type"
      .single();

    if (!error && data?.content) {
      setDocContent((prev) => ({ ...prev, [docId]: data.content }));
    } else if (error) {
      console.error("Error loading document content:", error);
      toast({
        title: "Failed to load document",
        description: "Could not retrieve the document content.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateDocument = async (docId: string) => {
    if (docStatus[docId] === "generating") return

    // Deduct credits check (simple client‑side guard)
    if (creditsRemaining < DOCUMENT_TYPES.find((d) => d.id === docId)!.cost) {
      toast({
        title: "Insufficient credits",
        description: "You don't have enough credits to generate this document.",
        variant: "destructive",
      })
      return
    }

    setDocStatus((prev) => ({ ...prev, [docId]: "generating" }))

    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedDocuments: [docId], projectPlan }),
      })

      if (!res.ok) throw new Error("Failed to trigger generation")
      const { content } = await res.json()

      setDocStatus((prev) => ({ ...prev, [docId]: "done" }))
      if (content) {
        setDocContent((prev) => ({ ...prev, [docId]: content }));
      } else {
        await loadDocContent(docId);                               // fallback
      }
      setActiveDocId(docId)
      
      // Mark as having generated at least one document
      const isFirstGeneration = !hasGeneratedAnyDocument
      setHasGeneratedAnyDocument(true)
      
      // If this is the first document generated and we haven't marked the project as completed yet
      if (isFirstGeneration && !hasMarkedCompleted && markProjectAsCompleted) {
        try {
          await markProjectAsCompleted()
          setHasMarkedCompleted(true)
          console.log("Project marked as completed after first document generation")
        } catch (err) {
          console.error("Failed to mark project as completed:", err)
        }
      }
    } catch (err) {
      console.error(err)
      setDocStatus((prev) => ({ ...prev, [docId]: "error" }))
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" })
    }
  }

  // Real‑time listener (optional – updates status/content when Supabase function finishes)
  useEffect(() => {
    if (!projectId) return

    const channel = supabase
      .channel("doc‑updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "project_documents", filter: `project_id=eq.${projectId}` },
        async (payload) => {
          const { type, status, content } = payload.new as { type: string; status: GenerationStatus; content: string }
          setDocStatus((prev) => ({ ...prev, [type]: status }))
          if (status === "done") {
            setDocContent((prev) => ({ ...prev, [type]: content }))
            
            // If this is the first document completed and we haven't marked the project as completed yet
            if (!hasGeneratedAnyDocument && !hasMarkedCompleted && markProjectAsCompleted) {
              try {
                await markProjectAsCompleted()
                setHasMarkedCompleted(true)
                setHasGeneratedAnyDocument(true)
                console.log("Project marked as completed after real-time document update")
              } catch (err) {
                console.error("Failed to mark project as completed:", err)
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, hasGeneratedAnyDocument, hasMarkedCompleted, markProjectAsCompleted])

  // ------------------------------------------------------------------------------------------------
  // Render helpers
  // ------------------------------------------------------------------------------------------------
  const StatusIcon = ({ status }: { status: GenerationStatus }) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  // ------------------------------------------------------------------------------------------------
  // JSX
  // ------------------------------------------------------------------------------------------------
  return (
    <div className="flex gap-6">
      {/* -------------------------------------------------------------------- */}
      {/* Sidebar ‑ Progress & Docs                                           */}
      {/* -------------------------------------------------------------------- */}
      <aside className="w-64 shrink-0">
        <ol className="relative border-l border-muted-foreground/20">
          {WIZARD_STAGES.map((stage, idx) => {
            const completed = stage.id < 5 // first 4 are completed
            const isCurrent = stage.id === 5
            return (
              <li key={stage.id} className="ml-4 mb-8 last:mb-0">
                {/* Bullet */}
                <span
                  className={cn(
                    "absolute -left-[0.6rem] flex h-3 w-3 items-center justify-center rounded-full ring-8 ring-background",
                    completed ? "bg-emerald-500" : isCurrent ? "bg-blue-500" : "bg-muted-foreground/40"
                  )}
                />
                <p className={cn("text-sm font-medium", completed && "text-emerald-600", isCurrent && "text-blue-600")}>{
                  stage.label
                }</p>
              </li>
            )
          })}

          {/* Document list under Generate */}
          <li className="ml-4 mt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Documents</p>
            <ul className="space-y-2">
              {DOCUMENT_TYPES.map((doc) => (
                <li key={doc.id} className="flex items-start gap-2">
                  <button
                    onClick={async () => {
                      if (docStatus[doc.id] === "done") {
                        setActiveDocId(doc.id);
                        if (!docContent[doc.id]) await loadDocContent(doc.id);
                      } else {
                        await handleGenerateDocument(doc.id);
                      }
                    }}
                    className={cn(
                      "group flex flex-1 items-center gap-2 rounded-md py-1 pr-2 text-left transition",
                      docStatus[doc.id] === "done" && "hover:bg-accent/40",
                      docStatus[doc.id] === "generating" && "opacity-70 cursor-not-allowed"
                    )}
                    disabled={docStatus[doc.id] === "generating" || generationInProgress}
                  >
                    <StatusIcon status={docStatus[doc.id]} />
                    <span className="truncate text-sm">
                      {doc.icon} {doc.title.replace("Document", "") /* shorter label */}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ol>

        {/* Credits info */}
        <div className="mt-6 rounded-md border p-3 text-xs">
          Credits Remaining: <span className="font-semibold">{creditsRemaining}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => navigateToStep(4)}
          disabled={generationInProgress}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plan
        </Button>
      </aside>

      {/* -------------------------------------------------------------------- */}
      {/* Viewer                                                              */}
      {/* -------------------------------------------------------------------- */}
      <main className="flex-1 overflow-hidden">
        <Card className="h-full max-h-[80vh] overflow-hidden">
          {activeDocId ? (
            <>
              {/* Document actions */}
              {docStatus[activeDocId] === "done" && docContent[activeDocId] && (
                <div className="flex items-center justify-end gap-2 p-2 border-b">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRegenerateDocument}
                    disabled={docStatus[activeDocId] === "generating" || false}
                  >
                    {docStatus[activeDocId] === "generating" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadDocument}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              )}
              
              {docStatus[activeDocId] === "generating" ? (
                <div className="flex h-full items-center justify-center p-10 text-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating {DOCUMENT_TYPES.find((d) => d.id === activeDocId)?.title}…
                </div>
              ) : (
                <div className="prose prose-sm max-w-none h-full overflow-y-auto p-6 dark:prose-invert">
                  {docContent[activeDocId] ? (
                    <ReactMarkdown>{docContent[activeDocId]}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">No content available. Generate the document first.</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-center text-muted-foreground">
              Select a document on the left to preview or click it to generate.
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
