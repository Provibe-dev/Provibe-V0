"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Search, Filter, Loader2, Star, Trash2, Clock, FileCode, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { formatDistanceToNow } from "date-fns"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock documents data for preview environment
const MOCK_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Product Requirements Document",
    type: "prd",
    project: { name: "Mobile App Documentation", id: "mock-project-1" },
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    starred: false,
  },
  {
    id: "doc-2",
    title: "User Flow",
    type: "user_flow",
    project: { name: "Mobile App Documentation", id: "mock-project-1" },
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    starred: true,
  },
  {
    id: "doc-3",
    title: "Architecture Document",
    type: "architecture",
    project: { name: "Mobile App Documentation", id: "mock-project-1" },
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    starred: false,
  },
  {
    id: "doc-4",
    title: "API Specification",
    type: "api_spec",
    project: { name: "E-commerce Platform", id: "mock-project-2" },
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    starred: false,
  },
  {
    id: "doc-5",
    title: "Database Schema",
    type: "schema",
    project: { name: "E-commerce Platform", id: "mock-project-2" },
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    starred: false,
  },
  {
    id: "doc-6",
    title: "Product Requirements Document",
    type: "prd",
    project: { name: "Task Management Tool", id: "mock-project-3" },
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    starred: false,
  },
]

export default function DocumentsPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)

  // Check if we're in the v0 preview environment
  const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Use mock data for test user or preview environment
        if (user.id === "test_user_id" || isV0Preview) {
          console.log("Using mock documents data for test user or preview")
          setDocuments(MOCK_DOCUMENTS)
          setLoading(false)
          return
        }

        // Validate UUID format before querying
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)

        if (!isValidUUID) {
          console.error("Invalid UUID format:", user.id)
          setDocuments([])
          setLoading(false)
          return
        }

        // Fetch user's projects first
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id, name")
          .eq("user_id", user.id)

        if (projectsError) {
          throw projectsError
        }

        if (!projects || projects.length === 0) {
          setDocuments([])
          setLoading(false)
          return
        }

        // Get project IDs
        const projectIds = projects.map((project) => project.id)

        // Fetch documents for all user projects
        const { data: documentsData, error: documentsError } = await supabase
          .from("project_documents")
          .select("*")
          .in("project_id", projectIds)
          .order("updated_at", { ascending: false })

        if (documentsError) {
          throw documentsError
        }

        // Map project names to documents
        const docsWithProjects = documentsData.map((doc) => {
          const project = projects.find((p) => p.id === doc.project_id)
          return {
            ...doc,
            project: project || { name: "Unknown Project", id: doc.project_id },
            starred: false, // We'll add this feature later
          }
        })

        setDocuments(docsWithProjects || [])
      } catch (err: any) {
        console.error("Error fetching documents:", err)
        setError(err.message || "Failed to load documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [user, isV0Preview])

  // Filter documents based on search query and active tab
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.project.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "recent")
      return matchesSearch && new Date(doc.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (activeTab === "starred") return matchesSearch && doc.starred
    if (activeTab === "trash") return false // We don't have trash yet

    return matchesSearch
  })

  // Toggle star status for a document
  const toggleStar = (docId: string) => {
    setDocuments((prevDocs) => prevDocs.map((doc) => (doc.id === docId ? { ...doc, starred: !doc.starred } : doc)))
  }

  // Get document icon based on type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "prd":
      case "user_flow":
        return <FileText className="h-10 w-10 text-emerald-500" />
      case "architecture":
      case "api_spec":
        return <FileCode className="h-10 w-10 text-blue-500" />
      case "schema":
        return <FileSpreadsheet className="h-10 w-10 text-orange-500" />
      default:
        return <FileText className="h-10 w-10 text-emerald-500" />
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        title="Documents"
        description="Create and manage your documentation"
      >
        <Button asChild>
          <Link href="/dashboard/create">
            <FileText className="mr-2 h-4 w-4" /> New Document
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">No documents found</p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/create">Create Your First Document</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      {getDocumentIcon(doc.type)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(doc.id)}>
                            <Star className="mr-2 h-4 w-4" /> {doc.starred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardTitle className="line-clamp-1">{doc.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Badge variant="outline" className="mr-2">
                        {doc.type}
                      </Badge>
                      <span>{doc.project.name}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/documents/${doc.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    {getDocumentIcon(doc.type)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleStar(doc.id)}>
                          <Star className="mr-2 h-4 w-4" /> {doc.starred ? "Unstar" : "Star"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="line-clamp-1">{doc.title}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    <Badge variant="outline" className="mr-2">
                      {doc.type}
                    </Badge>
                    <span>{doc.project.name}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/documents/${doc.id}`}>View</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="starred">
          {filteredDocuments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      {getDocumentIcon(doc.type)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(doc.id)}>
                            <Star className="mr-2 h-4 w-4" /> Unstar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardTitle className="line-clamp-1">{doc.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Badge variant="outline" className="mr-2">
                        {doc.type}
                      </Badge>
                      <span>{doc.project.name}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/documents/${doc.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center text-center">
                <Star className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No starred documents</h3>
                <p className="mt-2 text-sm text-muted-foreground">Star your important documents for quick access</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trash">
          <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
            <div className="flex flex-col items-center text-center">
              <Trash2 className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
              <p className="mt-2 text-sm text-muted-foreground">Deleted documents will appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
