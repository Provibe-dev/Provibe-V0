"use client"

// Import necessary hooks, components, and libraries
import { useAuth } from "@/components/auth-provider" // Assuming this provides user context
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Badge component is imported but not used in the provided code
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
  Settings, // Settings icon is imported but not used
} from "lucide-react" // Icons library
import Link from "next/link" // Next.js link component for navigation
import { ArrowRight } from "lucide-react" // Specific icon import
import { useEffect, useState } from "react" // React hooks for state and side effects
import { createClient } from "@supabase/supabase-js" // Supabase client library

// --- Mock Data (Placeholder) ---
// Define mock projects for testing or preview environments
const MOCK_PROJECTS = [
  { id: 'proj_1', name: 'Mock Project Alpha', idea: 'This is the idea for mock project Alpha, used for testing purposes.', updated_at: new Date().toISOString() },
  { id: 'proj_2', name: 'Mock Project Beta', idea: 'Another mock project description for Beta, demonstrating the UI.', updated_at: new Date().toISOString() },
  { id: 'proj_3', name: 'Mock Project Gamma', idea: 'A third mock project, Gamma, showing how the list renders.', updated_at: new Date().toISOString() },
];

// --- Supabase Initialization ---
// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
// Create a Supabase client instance
// Handle potential errors if env vars are missing (basic check)
let supabase: any; // Use 'any' for simplicity here, or define SupabaseClient type
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn("Supabase URL or Anon Key is missing. Supabase client not initialized.")
  // Optionally handle this case, e.g., by disabling Supabase features
}

// --- Environment Check ---
// Check if the app is running in the Vercel preview environment (v0)
const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

// --- Dashboard Page Component ---
export default function DashboardPage() {
  // --- State Variables ---
  const { user } = useAuth() // Get user data from authentication context
  const [recentProjects, setRecentProjects] = useState<any[]>([]) // State for recent projects
  const [projectCount, setProjectCount] = useState(0) // State for total project count
  const [loading, setLoading] = useState(true) // State to manage loading status for projects
  const [error, setError] = useState<string | null>(null); // State for storing fetch errors

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchProjects = async () => {
      setError(null); // Reset error state on new fetch
      // Ensure user context and Supabase client are available
      if (!user || !supabase) {
        if (!user) console.log("No user found, skipping project fetch.");
        if (!supabase) console.log("Supabase client not available, skipping project fetch.");
        setRecentProjects([]);
        setProjectCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true)
        console.log("Fetching projects for user:", user.id)

        // --- Mock Data Handling ---
        if (user.id === "test_user_id" || isV0Preview) {
          console.log("Using mock projects data for test user or preview")
          // Simulate network delay for mock data
          await new Promise(resolve => setTimeout(resolve, 500));
          setRecentProjects(MOCK_PROJECTS)
          setProjectCount(MOCK_PROJECTS.length)
          setLoading(false)
          return
        }

        // --- UUID Validation ---
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)
        if (!isValidUUID) {
          console.error("Invalid UUID format:", user.id)
          setError("Invalid user identifier."); // Set error state
          setRecentProjects([])
          setProjectCount(0)
          setLoading(false)
          return
        }

        // --- Fetch Recent Projects and Count in Parallel ---
        console.log("Querying Supabase...");
        const [projectsResult, countResult] = await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(3),
          supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
        ]);

        // --- Handle Projects Result ---
        if (projectsResult.error) {
          console.error("Error fetching recent projects:", projectsResult.error)
          throw new Error(`Failed to fetch projects: ${projectsResult.error.message}`); // Throw specific error
        }
        console.log("Fetched recent projects:", projectsResult.data);
        setRecentProjects(projectsResult.data || [])

        // --- Handle Count Result ---
        if (countResult.error) {
          console.error("Error fetching project count:", countResult.error)
          throw new Error(`Failed to fetch project count: ${countResult.error.message}`); // Throw specific error
        }
        console.log("Fetched project count:", countResult.count);
        setProjectCount(countResult.count || 0)

      } catch (err: any) {
        console.error("An error occurred during project fetching:", err)
        setError(err.message || "An unexpected error occurred while fetching data."); // Set specific error message
        setRecentProjects([]) // Reset state on error
        setProjectCount(0)
      } finally {
        setLoading(false) // Ensure loading is set to false
      }
    }

    fetchProjects()
  }, [user]) // Dependency array: re-run effect if the user object changes

  // --- Static Data for UI ---
  // Data for the key metrics cards
  const metrics = [
    {
      title: "Credits Remaining",
      value: user?.credits_remaining ?? "N/A",
      icon: <CreditCard className="h-5 w-5 text-emerald-500" />,
      change: user?.subscription === "pro" ? "Pro Plan" : "Free Plan",
    },
    {
      title: "Projects Created",
      value: projectCount,
      icon: <FolderKanban className="h-5 w-5 text-emerald-500" />,
      change: `Limit: ${user?.projects_limit ?? 2}`,
    },
    {
      title: "Time Saved",
      value: `${projectCount * 4} hrs`,
      icon: <Clock className="h-5 w-5 text-emerald-500" />,
      change: "Estimated",
    },
  ]

  // Data for the inspiration cards
  const inspirationCards = [
    {
      id: "prd", // Added id for potential key prop or handler
      title: "Product Requirements",
      description: "Create detailed PRDs for your next feature",
      icon: <Sparkles className="h-10 w-10 text-emerald-500" />,
    },
    {
      id: "specs",
      title: "Technical Specs",
      description: "Document architecture and implementation details",
      icon: <Code2 className="h-10 w-10 text-emerald-500" />,
    },
    {
      id: "guides",
      title: "User Guides",
      description: "Create user-friendly documentation",
      icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
    },
  ]

  // Data for the project template cards
  const projectTemplates = [
    {
      id: "web", // Added id
      title: "Web Application",
      description: "React, Next.js, TypeScript",
      icon: <Globe className="h-6 w-6 text-emerald-500" />,
    },
    {
      id: "mobile",
      title: "Mobile App",
      description: "React Native, Flutter",
      icon: <Smartphone className="h-6 w-6 text-emerald-500" />,
    },
    {
      id: "api",
      title: "Backend API",
      description: "Node.js, Express, MongoDB",
      icon: <Database className="h-6 w-6 text-emerald-500" />,
    },
  ]

  // Data for the documentation tips list
  const documentationTips = [
    "Start with a clear outline before diving into details",
    "Use consistent terminology throughout your documentation",
    "Include examples and code snippets where applicable",
    "Add diagrams to explain complex concepts visually",
    "Keep your audience in mind and adjust technical depth accordingly",
  ]

  // --- JSX Rendering ---
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 pt-6"> {/* Adjusted padding-top */}
      {/* Welcome Header Section - Adjusted alignment to match sidebar logo level */}
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-base text-muted-foreground mt-1">Here's an overview of your documentation projects</p>
        </div>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        </div>
      </div>

       {/* Display Error Message if any */}
       {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive text-lg">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {/* Metric title style remains text-sm */}
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              {/* Metric value style remains text-2xl */}
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects Section */}
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              {/* Updated Card Title style */}
              <CardTitle className="text-lg font-semibold">Recent Projects</CardTitle>
              {/* Updated Card Description style */}
              <CardDescription className="text-sm text-muted-foreground">Your recently updated projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects">
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow pt-4"> {/* Added pt-4 */}
            {loading ? (
              // Loading State: Simple spinner
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                {/* TODO: Implement Skeleton loaders */}
              </div>
            ) : recentProjects.length > 0 ? (
              // Data Loaded State
              recentProjects.map((project) => (
                <div key={project.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4"> {/* Added gap */}
                    <div className="flex-1">
                      {/* Updated project name style */}
                      <h3 className="text-base font-semibold">{project.name || "Untitled Project"}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.idea || "No description provided."}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View Project {project.name}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <FolderKanban className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">You haven't created any projects yet.</p>
                <Button asChild>
                  <Link href="/dashboard/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inspiration Section */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-emerald-500" />
              {/* Updated Card Title style */}
              <CardTitle className="text-lg font-semibold">Inspiration</CardTitle>
            </div>
            {/* Updated Card Description style */}
            <CardDescription className="text-sm text-muted-foreground">Ideas for your next documentation project</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 flex-grow pt-4"> {/* Added pt-4 */}
            {inspirationCards.map((card) => (
              <div
                key={card.id} // Use id as key
                className="flex flex-col items-center rounded-lg border p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                // onClick={() => handleInspirationClick(card.id)} // Example onClick
              >
                {card.icon}
                 {/* Updated inspiration title style */}
                <h3 className="mt-3 text-base font-semibold">{card.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documentation Tips Section */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-emerald-500" />
              {/* Updated Card Title style */}
              <CardTitle className="text-lg font-semibold">Tips for Better Docs</CardTitle>
            </div>
            {/* Updated Card Description style */}
            <CardDescription className="text-sm text-muted-foreground">Best practices for effective documentation</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pt-4"> {/* Added pt-4 */}
            <ul className="space-y-3">
              {documentationTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {/* Tip text style remains text-sm */}
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Project Templates Section */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center">
              <FileCode className="mr-2 h-5 w-5 text-emerald-500" />
              {/* Updated Card Title style */}
              <CardTitle className="text-lg font-semibold">Project Templates</CardTitle>
            </div>
            {/* Updated Card Description style */}
            <CardDescription className="text-sm text-muted-foreground">Start quickly with pre-built structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow pt-4"> {/* Added pt-4 */}
            {projectTemplates.map((template) => (
              <div
                key={template.id} // Use id as key
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                // onClick={() => handleTemplateClick(template.id)} // Example onClick
              >
                <div className="flex items-center">
                  {template.icon}
                  <div className="ml-3">
                    {/* Updated template title style */}
                    <h3 className="text-base font-semibold">{template.title}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowUpRight className="h-4 w-4" />
                   <span className="sr-only">Use template {template.title}</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
