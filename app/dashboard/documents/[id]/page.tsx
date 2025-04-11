"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, RefreshCw, Loader2, FileText, FileCode, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@supabase/supabase-js"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from "react-markdown"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock document data for preview environment
const MOCK_DOCUMENTS = {
  "doc-1": {
    id: "doc-1",
    title: "Product Requirements Document",
    type: "prd",
    project: { name: "Mobile App Documentation", id: "mock-project-1" },
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    content: `# Product Requirements Document

## Overview

### Product Name
Mobile App Documentation

### Product Summary
A comprehensive mobile app for managing personal finances and investments

### Objectives
- Solve: The difficulty of tracking multiple financial accounts, investments, and spending habits in one place
- Improve user experience
- Improve user experience

### Target Audience
Young professionals aged 25-40 who are looking to better manage their finances and investments

## Goals & Success Metrics

### Goals
- Achieve market adoption
- Achieve market adoption

### Success Metrics
- User engagement rate
- User engagement rate

## Features & Functionality

### Core Features
1. Expense tracking
2. Investment portfolio management
3. Financial goal setting

### Future Enhancements
- Future improvement
- Future improvement

## Technical Requirements

### Platform
Mobile (iOS and Android)

### Technologies
- React Native
- Node.js

### Integration Points
- Third-party service
- Third-party service

## Timeline & Milestones

### Phase 1
- Development milestone
- Development milestone

### Phase 2
- Development milestone
- Development milestone`,
  },
  "doc-2": {
    id: "doc-2",
    title: "User Flow",
    type: "user_flow",
    project: { name: "Mobile App Documentation", id: "mock-project-1" },
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    content: `# User Flow

## Overview
This document outlines the primary user journeys for Mobile App Documentation.

## User Journey 1: User Registration

### Trigger
User clicks 'Sign Up' button

### Steps
1. User completes form
2. System processes request
3. User completes form
4. System processes request

### End State
User is registered and logged in

## User Journey 2: User Registration

### Trigger
User clicks 'Sign Up' button

### Steps
1. User completes form
2. System processes request
3. User completes form
4. System processes request

### End State
User is registered and logged in

## Error Flows

### Error Flow 1: Form Validation Error
System displays validation errors and allows correction`,
  },
  "doc-3": {
    id: "doc-3",
    title: "Architecture Document",
    type: "architecture",
    project: { name: "Mobile App Documentation", id: "mock-project-1" },
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    content: `# Architecture Document

## Overview
This document outlines the technical architecture for Mobile App Documentation.

## Tech Stack

### Frontend
- React Native
- Custom component library
- Redux

### Backend
- Node.js
- Express
- JWT

### Database
- MongoDB
- Prisma

### Infrastructure
- Vercel
- GitHub Actions
- Datadog

## System Architecture

### Component Diagram
Microservices architecture with API Gateway

### Data Flow
1. Data processing step
2. Data processing step
3. Data processing step

## Security Considerations

- Input validation and sanitization
- Input validation and sanitization

## Scalability Strategy

- Horizontal scaling with load balancing
- Horizontal scaling with load balancing`,
  },
}

export default function DocumentDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("preview")
  const [regenerating, setRegenerating] = useState(false)

  // Check if we're in the v0 preview environment
  const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

  useEffect(() => {
    const fetchDocument = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const documentId = params?.id as string

        // Use mock data for test user or preview environment
        if (user.id === "test_user_id" || isV0Preview || documentId.startsWith("doc-")) {
          console.log("Using mock document data for test user or preview")
          const mockDoc = MOCK_DOCUMENTS[documentId as keyof typeof MOCK_DOCUMENTS]
          if (mockDoc) {
            setDocument(mockDoc)
          } else {
            setError("Document not found")
          }
          setLoading(false)
          return
        }

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
  }, [user, params, isV0Preview])

  const handleRegenerateDocument = async () => {
    if (!user || !document) return

    try {
      setRegenerating(true)

      // For test user or preview environment, simulate regeneration
      if (user.id === "test_user_id" || isV0Preview) {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Update the document in the local state
        setDocument((prev) => ({
          ...prev,
          updated_at: new Date().toISOString(),
          content:
            prev.content + "\n\n## Regenerated Content\nThis document has been regenerated with updated information.",
        }))

        setRegenerating(false)
        return
      }

      // Call the server action to regenerate the document
      const response = await fetch("/api/regenerate-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: document.id,
          userId: user.id,
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
    const a = document.createElement("a")
    a.href = url
    a.download = `${document.title.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
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
    )
  }

  if (!document) {
    return (
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/dashboard/documents">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
            </Link>
          </Button>
          <div className="flex items-center">
            {getDocumentIcon(document.type)}
            <h1 className="ml-2 text-2xl font-bold tracking-tight">{document.title}</h1>
          </div>
          <Badge variant="outline" className="ml-4">
            {document.type.replace("_", " ")}
          </Badge>
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
  )
}
