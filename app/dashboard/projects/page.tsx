"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Loader2, FolderKanban, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@supabase/supabase-js"
import { formatDistanceToNow } from "date-fns"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock projects data for preview environment
const MOCK_PROJECTS = [
  {
    id: "mock-project-1",
    name: "Mobile App Documentation",
    status: "completed",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    idea: "A comprehensive mobile app for managing personal finances and investments",
    documents: [
      { type: "prd", status: "completed" },
      { type: "user_flow", status: "completed" },
      { type: "architecture", status: "completed" },
    ],
  },
  {
    id: "mock-project-2",
    name: "E-commerce Platform",
    status: "completed",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    idea: "An online marketplace for handmade crafts and artisanal products",
    documents: [
      { type: "prd", status: "completed" },
      { type: "schema", status: "completed" },
      { type: "api_spec", status: "completed" },
    ],
  },
  {
    id: "mock-project-3",
    name: "Task Management Tool",
    status: "pending",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    idea: "A collaborative task management tool for remote teams",
    documents: [
      { type: "prd", status: "pending" },
      { type: "user_flow", status: "pending" },
    ],
  },
]

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if we're in the v0 preview environment
  const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Use mock data for test user or preview environment
        if (user.id === "test_user_id" || isV0Preview) {
          console.log("Using mock projects data for test user or preview")
          setProjects(MOCK_PROJECTS)
          setLoading(false)
          return
        }

        // Validate UUID format before querying
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)

        if (!isValidUUID) {
          console.error("Invalid UUID format:", user.id)
          setProjects([])
          setLoading(false)
          return
        }

        // Fetch projects from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (projectsError) {
          throw projectsError
        }

        // Fetch document counts for each project
        const projectsWithDocuments = await Promise.all(
          (projectsData || []).map(async (project) => {
            const { data: documents, error: documentsError } = await supabase
              .from("project_documents")
              .select("type, status")
              .eq("project_id", project.id)

            if (documentsError) {
              console.error("Error fetching documents for project", project.id, documentsError)
              return { ...project, documents: [] }
            }

            return { ...project, documents: documents || [] }
          }),
        )

        setProjects(projectsWithDocuments)
      } catch (err: any) {
        console.error("Error fetching projects:", err)
        setError(err.message || "Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user, isV0Preview])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> In Progress
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex h-[200px] flex-col items-center justify-center p-6">
            <p className="text-center text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex h-[200px] flex-col items-center justify-center p-6">
            <FolderKanban className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">You don't have any projects yet.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/projects/new">Create Your First Project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1 text-lg">{project.name}</CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription className="line-clamp-2 mt-2">{project.idea}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.documents.map((doc: any, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className={
                        doc.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : doc.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-50 text-gray-700"
                      }
                    >
                      {doc.type.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex w-full items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
