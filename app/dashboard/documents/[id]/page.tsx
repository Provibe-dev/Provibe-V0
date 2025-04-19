"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, RefreshCw, Loader2, FileText, FileCode, FileSpreadsheet, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase-client"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from "react-markdown"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
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

export default function DocumentDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("preview")
  const [regenerating, setRegenerating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchDocument = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const documentId = params?.id as string

        // Fetch document from Supabase
        const { data: documentData, error: documentError } = await supabase
          .from("project_documents")
          .select("*")
          .eq("id", documentId)
          .single()

        if (documentError) {
          throw documentError
        }

        if (!documentData) {
          setError("Document not found")
          setLoading(false)
          return
        }

        // Fetch project info
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("id, name")
          .eq("id", documentData.project_id)
          .single()

        if (projectError) {
          throw projectError
        }

        setDocument({
          ...documentData,
          project: projectData,
        })
      } catch (err: any) {
        console.error("Error fetching document:", err)
        setError(err.message || "Failed to load document")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [user, params])

  const handleRegenerateDocument = async () => {
    if (!user || !document) return

    try {
      setRegenerating(true)

      // Call the server action to regenerate the document
      const response = await fetch("/api/regenerate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: document.id,
          projectId: document.project_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to regenerate document")
      }

      // Refresh the document data
      const { data: updatedDocument, error: documentError } = await supabase
        .from("project_documents")
        .select("*")
        .eq("id", document.id)
        .single()

      if (documentError) {
        throw documentError
      }

      setDocument({
        ...updatedDocument,
        project: document.project,
      })
    } catch (err: any) {
      console.error("Error regenerating document:", err)
      alert(err.message || "Failed to regenerate document")
    } finally {
      setRegenerating(false)
    }
  }

  const handleDownloadDocument = () => {
    if (!document) return

    // Create a blob from the document content
    const blob = new Blob([document.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = window.document.createElement("a")
    a.href = url
    a.download = `${document.title.replace(/\s+/g, "-").toLowerCase()}.md`
    window.document.body.appendChild(a)
    a.click()

    // Clean up
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteDocument = async () => {
    if (!document?.id) return
    setIsDeleting(true)
    try {
      await supabase.from("project_documents").delete().eq("id", document.id)
      router.push("/dashboard/documents")
    } catch (err) {
      setError("Failed to delete document")
      setIsDeleting(false)
    }
  }

  // Get document icon based on type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "prd":
      case "user_flow":
        return <FileText className="h-6 w-6 text-emerald-500" />
      case "architecture":
      case "api_spec":
        return <FileCode className="h-6 w-6 text-blue-500" />
      case "schema":
        return <FileSpreadsheet className="h-6 w-6 text-orange-500" />
      default:
        return <FileText className="h-6 w-6 text-emerald-500" />
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/dashboard/documents">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
            </Link>
          </Button>
          <Card>
            <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
              <p className="text-center text-muted-foreground">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  if (!document) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/dashboard/documents">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
            </Link>
          </Button>
          <Card>
            <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
              <p className="text-center text-muted-foreground">Document not found</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/documents">Back to Documents</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard/documents">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center">
              <h1 className="ml-2 text-2xl font-bold tracking-tight">{document.title}</h1>
              <Badge variant="outline" className="ml-4">
                {document.type.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRegenerateDocument} disabled={regenerating}>
              {regenerating ? (
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
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          From project:{" "}
          <Link href={`/dashboard/projects/${document.project.id}`} className="hover:underline">
            {document.project.name}
          </Link>{" "}
          • Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="min-h-[500px]">
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{document.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raw" className="min-h-[500px]">
            <Card>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-sm">{document.content}</pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
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
    </DashboardShell>
  )
}
