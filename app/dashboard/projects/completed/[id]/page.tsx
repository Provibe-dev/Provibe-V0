"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, FileText, FileCode, BookOpen, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentSidebar } from "@/components/document-sidebar"
import { DocumentViewer } from "@/components/document-viewer"
import { Separator } from "@/components/ui/separator"
import { getProject } from "@/app/actions/project-actions"
import { useToast } from "@/components/ui/use-toast"

export default function CompletedProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)

  // Fetch project data
  useEffect(() => {
    async function fetchProjectData() {
      try {
        setLoading(true)
        const result = await getProject(projectId)

        if (result.success) {
          setProject(result.project)
          setDocuments(
            result.documents.map((doc) => ({
              id: doc.id,
              title: doc.title,
              type: doc.type,
              icon: getDocumentIcon(doc.type),
              status: doc.status,
              content: doc.content,
            })),
          )

          if (result.documents.length > 0) {
            setActiveDocumentId(result.documents[0].id)
          }
        } else {
          throw new Error(result.error || "Failed to fetch project")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error loading project",
          description: (error as Error).message || "There was an error loading the project. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId, toast])

  // Helper function to get document icon based on type
  function getDocumentIcon(type: string) {
    switch (type) {
      case "prd":
        return <FileText className="h-5 w-5 text-emerald-500" />
      case "tech-spec":
        return <FileCode className="h-5 w-5 text-blue-500" />
      case "user-guide":
        return <BookOpen className="h-5 w-5 text-purple-500" />
      case "api-docs":
        return <FileCode className="h-5 w-5 text-blue-500" />
      case "release-notes":
        return <FileText className="h-5 w-5 text-emerald-500" />
      case "custom":
        return <FileSpreadsheet className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-emerald-500" />
    }
  }

  const activeDocument =
    documents.find((doc) => doc.id === activeDocumentId) || (documents.length > 0 ? documents[0] : null)

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="mt-2 text-sm text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-medium">Project not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center border-b p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="ml-2 text-xl font-bold">{project.name}</h1>
        <Separator orientation="vertical" className="mx-4 h-6" />
        <span className="text-sm text-muted-foreground">Generated Documents</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Document Sidebar */}
        <div className="w-80 border-r">
          <DocumentSidebar
            documents={documents}
            activeDocumentId={activeDocumentId || ""}
            onSelectDocument={setActiveDocumentId}
          />
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-hidden">
          {activeDocument ? (
            <DocumentViewer document={activeDocument} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No document selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
