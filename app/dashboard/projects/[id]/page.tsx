"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, RefreshCw, Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase-client"
import { formatDistanceToNow } from "date-fns"

// Mock project data for preview environment
const MOCK_PROJECT = {
  id: "mock-project-1",
  name: "Mobile App Documentation",
  status: "completed",
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  idea: "A comprehensive mobile app for managing personal finances and investments",
  refined_idea:
    "This innovative product concept aims to solve financial management challenges for young professionals by providing an intuitive mobile interface for tracking expenses, investments, and financial goals. It differentiates from existing solutions by offering AI-powered insights and has potential for integration with major banking platforms.",
  selected_tools: ["React Native", "Node.js", "MongoDB"],
  product_details: {
    targetAudience: "Young professionals aged 25-40 who are looking to better manage their finances and investments",
    problemSolved:
      "The difficulty of tracking multiple financial accounts, investments, and spending habits in one place",
    keyFeatures: "Expense tracking, investment portfolio management, financial goal setting, AI-powered insights",
    successMetrics: "User acquisition rate, retention rate, average time spent in app, number of connected accounts",
    timeline: "3 months for MVP, 6 months for full launch",
  },
  project_plan:
    "# Project Development Plan\n\n## Overview\nThis plan outlines the development approach for Mobile App Documentation, based on the provided idea and requirements.\n\n## Phase 1: Research & Planning (2 weeks)\n- Market research and competitor analysis\n- User persona development\n- Feature prioritization\n- Technical stack selection (React Native, Node.js, MongoDB)\n- Resource allocation\n\n## Phase 2: Design & Architecture (3 weeks)\n- UI/UX design\n- System architecture design\n- Database schema design\n- API specification\n- Security planning\n\n## Phase 3: Development (8 weeks)\n- Core functionality implementation\n- Integration with selected tools\n- Database implementation\n- API development\n- Frontend development\n\n## Phase 4: Testing & Refinement (3 weeks)\n- Unit and integration testing\n- User acceptance testing\n- Performance optimization\n- Security testing\n- Bug fixes and refinements\n\n## Phase 5: Deployment & Launch (2 weeks)\n- Deployment preparation\n- Documentation finalization\n- Marketing materials preparation\n- Soft launch\n- Full public launch\n\n## Timeline\nTotal estimated timeline: 18 weeks\n\n## Success Criteria\n- Meeting all specified requirements\n- Passing all test cases\n- User satisfaction metrics achieved\n- Performance benchmarks met",
}

// Mock documents for preview environment
const MOCK_DOCUMENTS = [
  {
    id: "mock-doc-1",
    project_id: "mock-project-1",
    title: "Product Requirements Document",
    type: "prd",
    content:
      "# Product Requirements Document\n\n## Overview\n\n### Product Name\nMobile App Documentation\n\n### Product Summary\nA comprehensive mobile app for managing personal finances and investments\n\n### Objectives\n- Solve: The difficulty of tracking multiple financial accounts, investments, and spending habits in one place\n- Improve user experience\n- Improve user experience\n\n### Target Audience\nYoung professionals aged 25-40 who are looking to better manage their finances and investments\n\n## Goals & Success Metrics\n\n### Goals\n- Achieve market adoption\n- Achieve market adoption\n\n### Success Metrics\n- User engagement rate\n- User engagement rate\n\n## Features & Functionality\n\n### Core Features\n1. Expense tracking\n2. Investment portfolio management\n3. Financial goal setting\n\n### Future Enhancements\n- Future improvement\n- Future improvement\n\n## Technical Requirements\n\n### Platform\nMobile (iOS and Android)\n\n### Technologies\n- React Native\n- Node.js\n\n### Integration Points\n- Third-party service\n- Third-party service\n\n## Timeline & Milestones\n\n### Phase 1\n- Development milestone\n- Development milestone\n\n### Phase 2\n- Development milestone\n- Development milestone",
    status: "completed",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-doc-2",
    project_id: "mock-project-1",
    title: "User Flow",
    type: "user_flow",
    content:
      "# User Flow\n\n## Overview\nThis document outlines the primary user journeys for Mobile App Documentation.\n\n## User Journey 1: User Registration\n\n### Trigger\nUser clicks 'Sign Up' button\n\n### Steps\n1. User completes form\n2. System processes request\n3. User completes form\n4. System processes request\n\n### End State\nUser is registered and logged in\n\n## User Journey 2: User Registration\n\n### Trigger\nUser clicks 'Sign Up' button\n\n### Steps\n1. User completes form\n2. System processes request\n3. User completes form\n4. System processes request\n\n### End State\nUser is registered and logged in\n\n## Error Flows\n\n### Error Flow 1: Form Validation Error\nSystem displays validation errors and allows correction",
    status: "completed",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-doc-3",
    project_id: "mock-project-1",
    title: "Architecture Document",
    type: "architecture",
    content:
      "# Architecture Document\n\n## Overview\nThis document outlines the technical architecture for Mobile App Documentation.\n\n## Tech Stack\n\n### Frontend\n- React Native\n- Custom component library\n- Redux\n\n### Backend\n- Node.js\n- Express\n- JWT\n\n### Database\n- MongoDB\n- Prisma\n\n### Infrastructure\n- Vercel\n- GitHub Actions\n- Datadog\n\n## System Architecture\n\n### Component Diagram\nMicroservices architecture with API Gateway\n\n### Data Flow\n1. Data processing step\n2. Data processing step\n3. Data processing step\n\n## Security Considerations\n\n- Input validation and sanitization\n- Input validation and sanitization\n\n## Scalability Strategy\n\n- Horizontal scaling with load balancing\n- Horizontal scaling with load balancing",
    status: "completed",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ProjectDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({})

  // Check if we're in the v0 preview environment
  const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const projectId = params?.id as string

        // Use mock data for test user or preview environment
        if (user.id === "test_user_id" || isV0Preview || projectId === "mock-project-1") {
          console.log("Using mock project data for test user or preview")
          setProject(MOCK_PROJECT)
          setDocuments(MOCK_DOCUMENTS)
          setLoading(false)
          return
        }

        // Fetch project from Supabase
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single()

        if (projectError) {
          throw projectError
        }

        // Fetch project documents
        const { data: documentsData, error: documentsError } = await supabase
          .from("project_documents")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: true })

        if (documentsError) {
          throw documentsError
        }

        setProject(projectData)
        setDocuments(documentsData || [])
      } catch (err: any) {
        console.error("Error fetching project data:", err)
        setError(err.message || "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [user, params, isV0Preview])

  const handleRegenerateDocument = async (documentId: string) => {
    if (!user) return

    try {
      setRegenerating((prev) => ({ ...prev, [documentId]: true }))

      // For test user or preview environment, simulate regeneration
      if (user.id === "test_user_id" || isV0Preview) {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Update the document in the local state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  updated_at: new Date().toISOString(),
                  content:
                    doc.content +
                    "\n\n## Regenerated Content\nThis document has been regenerated with updated information.",
                }
              : doc,
          ),
        )

        setRegenerating((prev) => ({ ...prev, [documentId]: false }))
        return
      }

      // Call the server action to regenerate the document
      const response = await fetch("/api/regenerate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to regenerate document")
      }

      // Refresh the documents list
      const { data: updatedDocuments, error: documentsError } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: true })

      if (documentsError) {
        throw documentsError
      }

      setDocuments(updatedDocuments || [])
    } catch (err: any) {
      console.error("Error regenerating document:", err)
      alert(err.message || "Failed to regenerate document")
    } finally {
      setRegenerating((prev) => ({ ...prev, [documentId]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "pending":
      case "generating":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> {status === "pending" ? "Pending" : "Generating"}
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
        <Card>
          <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="mt-4 text-center text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
        <Card>
          <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
            <p className="text-center text-muted-foreground">Project not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/projects">Back to Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <div className="ml-4">{getStatusBadge(project.status)}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Idea</h3>
              <p className="mt-1 text-sm text-muted-foreground">{project.idea}</p>
            </div>
            {project.refined_idea && (
              <div>
                <h3 className="font-medium">Refined Idea</h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.refined_idea}</p>
              </div>
            )}
            {project.selected_tools && project.selected_tools.length > 0 && (
              <div>
                <h3 className="font-medium">Selected Tools</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {project.selected_tools.map((tool: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.product_details ? (
              Object.entries(project.product_details).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <h3 className="font-medium">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{value || "Not specified"}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No product details available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {project.project_plan && (
        <Card>
          <CardHeader>
            <CardTitle>Project Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm">{project.project_plan}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold tracking-tight mt-8">Documents</h2>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex h-[200px] flex-col items-center justify-center p-6">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">No documents available for this project.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{document.title}</CardTitle>
                  {getStatusBadge(document.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {document.content ? document.content.substring(0, 150) + "..." : "Content not available"}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateDocument(document.id)}
                      disabled={regenerating[document.id] || document.status === "generating"}
                    >
                      {regenerating[document.id] ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/documents/${document.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
