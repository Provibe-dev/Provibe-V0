"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FolderKanban,
  Clock,
  Plus,
  ArrowUpRight,
  Lightbulb,
  FileCode,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  Code2,
  Database,
  Globe,
  Smartphone,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're in the v0 preview environment
const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

// Mock projects data for test user or preview environment
const MOCK_PROJECTS = [
  {
    id: "mock-project-1",
    name: "Mobile App Documentation",
    idea: "Comprehensive documentation for our new mobile application, including user guides, API references, and developer documentation.",
    status: "completed",
    user_id: "test_user_id",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-project-2",
    name: "E-commerce Platform",
    idea: "Technical specifications for our new e-commerce platform, including architecture diagrams, database schema, and API endpoints.",
    status: "draft",
    user_id: "test_user_id",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-project-3",
    name: "AI Feature Requirements",
    idea: "Product requirements document for our new AI-powered features, including user stories, acceptance criteria, and implementation details.",
    status: "draft",
    user_id: "test_user_id",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch recent projects and project count
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        setLoading(true)
        console.log("Fetching projects for user:", user.id)

        // Check if we're using the test user or in preview mode
        if (user.id === "test_user_id" || isV0Preview) {
          console.log("Using mock projects data for test user or preview")
          setRecentProjects(MOCK_PROJECTS)
          setProjectCount(MOCK_PROJECTS.length)
          setLoading(false)
          return
        }

        // Validate UUID format before querying
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)

        if (!isValidUUID) {
          console.error("Invalid UUID format:", user.id)
          setRecentProjects([])
          setProjectCount(0)
          setLoading(false)
          return
        }

        // Get recent projects
        const { data: projects, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(3)

        if (error) {
          console.error("Error fetching projects:", error)
          throw error
        }

        setRecentProjects(projects || [])

        // Get project count
        const { count, error: countError } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if (countError) {
          console.error("Error fetching project count:", countError)
          throw countError
        }

        setProjectCount(count || 0)
      } catch (error) {
        console.error("Error fetching projects:", error)
        // Fallback to empty projects if there's an error
        setRecentProjects([])
        setProjectCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  // Mock data for the dashboard
  const metrics = [
    {
      title: "Credits Remaining",
      value: user?.credits_remaining || 0,
      icon: <CreditCard className="h-5 w-5 text-emerald-500" />,
      change: user?.subscription === "pro" ? "Pro Plan" : "Free Plan",
    },
    {
      title: "Projects Created",
      value: projectCount,
      icon: <FolderKanban className="h-5 w-5 text-emerald-500" />,
      change: `Limit: ${user?.projects_limit || 2}`,
    },
    {
      title: "Time Saved",
      value: `${projectCount * 4} hrs`,
      icon: <Clock className="h-5 w-5 text-emerald-500" />,
      change: "Estimated",
    },
  ]

  const inspirationCards = [
    {
      title: "Product Requirements",
      description: "Create detailed PRDs for your next feature",
      icon: <Sparkles className="h-10 w-10 text-emerald-500" />,
    },
    {
      title: "Technical Specs",
      description: "Document architecture and implementation details",
      icon: <Code2 className="h-10 w-10 text-emerald-500" />,
    },
    {
      title: "User Guides",
      description: "Create user-friendly documentation",
      icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
    },
  ]

  const projectTemplates = [
    {
      title: "Web Application",
      description: "React, Next.js, TypeScript",
      icon: <Globe className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "Mobile App",
      description: "React Native, Flutter",
      icon: <Smartphone className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "Backend API",
      description: "Node.js, Express, MongoDB",
      icon: <Database className="h-6 w-6 text-emerald-500" />,
    },
  ]

  const documentationTips = [
    "Start with a clear outline before diving into details",
    "Use consistent terminology throughout your documentation",
    "Include examples and code snippets where applicable",
    "Add diagrams to explain complex concepts visually",
    "Keep your audience in mind and adjust technical depth accordingly",
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your documentation projects</p>
        </div>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Left Column - Recent Projects */}
        <div className="md:col-span-4 space-y-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your recently updated projects</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/projects">
                  View all <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.idea ? project.idea.substring(0, 100) + "..." : "No description"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant={project.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {project.status === "completed" ? "Completed" : "Draft"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Button asChild>
                    <Link href="/dashboard/create">
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" /> Create New Project
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Inspiration, Templates, Tips */}
        <div className="md:col-span-3 space-y-6">
          {/* Inspiration Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-emerald-500" />
                <CardTitle>Inspiration</CardTitle>
              </div>
              <CardDescription>Ideas for your next documentation</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {inspirationCards.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-lg border p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {card.icon}
                  <h3 className="mt-3 font-medium">{card.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Templates */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <FileCode className="mr-2 h-5 w-5 text-emerald-500" />
                <CardTitle>Project Templates</CardTitle>
              </div>
              <CardDescription>Start with pre-built templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectTemplates.map((template, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    {template.icon}
                    <div className="ml-3">
                      <h3 className="font-medium">{template.title}</h3>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Documentation Tips */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-emerald-500" />
                <CardTitle>Tips for Better Docs</CardTitle>
              </div>
              <CardDescription>Best practices for documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {documentationTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
