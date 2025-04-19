// components/document-viewer.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { Loader2, RefreshCw, Sparkles } from "lucide-react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

type Props = {
  projectId: string
}

const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄" },
  { id: "user_flow", title: "User Flow Diagram", icon: "🔄" },
  { id: "architecture", title: "System Architecture", icon: "🏗️" },
  { id: "schema", title: "Database Schema", icon: "🗄️" },
  { id: "api_spec", title: "API Specification", icon: "🔌" },
]

export default function DocumentViewer({ projectId }: Props) {
  const { user } = useAuth()
  const [activeDocId, setActiveDocId] = useState<string>("prd")
  const [docContent, setDocContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setDocContent((prev) => ({ ...prev, [activeDocId]: content }))
    },
  })

  const fetchDocuments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("project_documents")
      .select("type, content")
      .eq("project_id", projectId)

    if (data) {
      const contentMap: Record<string, string> = {}
      data.forEach((d) => {
        contentMap[d.type] = d.content || ""
      })
      setDocContent(contentMap)
      if (editor && contentMap[activeDocId]) {
        editor.commands.setContent(contentMap[activeDocId])
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [projectId])

  useEffect(() => {
    if (editor && docContent[activeDocId]) {
      editor.commands.setContent(docContent[activeDocId])
    }
  }, [activeDocId])

  const handleAIRewrite = async () => {
    if (!editor) return
    const text = editor.state.doc.textContent

    const res = await fetch("/api/ai-rewrite", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    })

    const { rewritten } = await res.json()
    editor.commands.setContent(rewritten)
  }

  const handleSave = async () => {
    setSaving(true)
    const html = editor?.getHTML()
    await supabase
      .from("project_documents")
      .update({ content: html })
      .eq("project_id", projectId)
      .eq("type", activeDocId)

    setSaving(false)
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 shrink-0">
        <div className="mb-3 font-medium text-sm text-muted-foreground">Documents</div>
        <ul className="space-y-2">
          {DOCUMENT_TYPES.map((d) => (
            <li key={d.id}>
              <Button
                variant={activeDocId === d.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveDocId(d.id)}
              >
                {d.icon} {d.title.replace("Document", "")}
              </Button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <main className="flex-1">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b p-3 text-xs">
            <div className="font-medium">{DOCUMENT_TYPES.find((d) => d.id === activeDocId)?.title}</div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                💾 {saving ? "Saving…" : "Save"}
              </Button>
              <Button onClick={handleAIRewrite} variant="outline">
                <Sparkles className="h-4 w-4 mr-1" /> Rewrite with AI
              </Button>
            </div>
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-scroll prose dark:prose-invert">
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="text-center text-muted-foreground">
                <Loader2 className="animate-spin inline mr-2" />
                Loading editor…
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
