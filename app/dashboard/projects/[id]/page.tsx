// /app/dashboard/projects/[id]/page.tsx
// v1.3 – April 19 2025 – Editor UI reverted to match Page5 vertical progress style

"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Download,
  Loader2,
  RefreshCw,
  XCircle,
  Sparkles,
  Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "tiptap-markdown"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄" },
  { id: "user_flow", title: "User Flow Diagram", icon: "🔄" },
  { id: "architecture", title: "System Architecture", icon: "🏗️" },
  { id: "schema", title: "Database Schema", icon: "🗄️" },
  { id: "api_spec", title: "API Specification", icon: "🔌" },
] as const

type GenerationStatus = "idle" | "generating" | "done" | "error"

export default function Page() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const projectId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any | null>(null)
  const [docStatus, setDocStatus] = useState<Record<string, GenerationStatus>>(() =>
    Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.id, "idle"]))
  )
  const [docContent, setDocContent] = useState<Record<string, string>>({})
  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown
    ],
    content: "",
    editable: true,
  })

  useEffect(() => {
    if (!projectId) return
    const run = async () => {
      setLoading(true)
      try {
        const { data: proj } = await supabase.from("projects").select("*").eq("id", projectId).single()
        setProject(proj)

        const { data: docs } = await supabase
          .from("project_documents")
          .select("type,status,content")
          .eq("project_id", projectId)

        if (docs) {
          const st: Record<string, GenerationStatus> = {}
          const ct: Record<string, string> = {}
          docs.forEach((d) => {
            st[d.type] = d.status === "completed" ? "done" : (d.status as GenerationStatus)
            if (d.content) ct[d.type] = d.content
          })
          setDocStatus(st)
          setDocContent(ct)
          if (docs.length) setActiveDocId(docs[0].type)
        }
      } catch (e) {
        toast({ title: "Failed to load project", variant: "destructive" })
        router.push("/dashboard/projects")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [projectId])

  useEffect(() => {
    if (activeDocId && editor && docContent[activeDocId]) {
      editor.commands.setContent(docContent[activeDocId])
    }
  }, [activeDocId, docContent, editor])

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

  const handleAIRewrite = async () => {
    if (!editor) return
    const selection = editor.state.selection.content().content
    const text = selection.map(n => n.text).join(" ")

    const res = await fetch("/api/ai-rewrite", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    })

    const { rewritten } = await res.json()
    editor.commands.insertContentAt(editor.state.selection, rewritten)
  }

  const handleDeleteProject = async () => {
    if (!project?.id) return
    setIsDeleting(true)
    try {
      await supabase.from("projects").delete().eq("id", project.id)
      router.push("/dashboard/projects")
    } catch (err) {
      toast({ title: "Failed to delete project", variant: "destructive" })
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 pt-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/projects")}>            
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <h1 className="ml-2 text-2xl font-bold tracking-tight">{project?.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {user && <span>Credits: <span className="font-medium">{user.credits_remaining ?? '...'}</span></span>}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Project
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0">
          <ol className="relative border-l border-muted-foreground/20">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="ml-4 mb-8 last:mb-0">
                <span className="absolute -left-[0.6rem] h-3 w-3 rounded-full bg-emerald-500 ring-8 ring-background" />
                <p className="text-sm font-medium">Step {i + 1}</p>
              </li>
            ))}
            <li className="ml-4 mt-4">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Documents</p>
              <ul className="space-y-2">
                {DOCUMENT_TYPES.map((d) => (
                  <li key={d.id} className="flex items-start gap-2">
                    <button
                      onClick={() => setActiveDocId(d.id)}
                      className={cn(
                        "group flex flex-1 items-center gap-2 rounded-md py-1 pr-2 text-left transition",
                        docStatus[d.id] === "done" && "hover:bg-accent/40"
                      )}
                    >
                      <StatusIcon status={docStatus[d.id]} />
                      <span className="truncate text-sm">
                        {d.icon} {d.title.replace("Document", "")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ol>
        </aside>

        <main className="flex-1 overflow-hidden">
          <Card className="h-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between border-b p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {activeDocId && DOCUMENT_TYPES.find((d) => d.id === activeDocId)?.title}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleAIRewrite}>
                <Sparkles className="h-4 w-4 mr-1" /> Rewrite Selected
              </Button>
            </div>
            <div className="h-full overflow-y-auto p-4">
              {editor ? <EditorContent editor={editor} className="prose max-w-none" /> : <p>Loading editor…</p>}
            </div>
          </Card>
        </main>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this project and all associated documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
