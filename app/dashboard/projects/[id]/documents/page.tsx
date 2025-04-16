"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Markdown from "react-markdown"

export default function ProjectDocumentsPage() {
  const params = useParams()
  const projectId = params.id as string
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDocument, setActiveDocument] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('project_documents') // Changed from 'documents' to 'project_documents'
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        setDocuments(data || [])
        if (data && data.length > 0) {
          setActiveDocument(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchDocuments()
    }
  }, [projectId])

  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Documents Found</CardTitle>
            <CardDescription>
              This project doesn't have any generated documents yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Go back to the project and generate documents from the "Create" flow.</p>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/create?projectId=${projectId}`}>
              <Button>Generate Documents</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href={`/dashboard/projects/${projectId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
          </Button>
        </Link>
      </div>
      
      <h1 className="mb-6 text-3xl font-bold">Project Documents</h1>
      
      <Tabs value={activeDocument || ''} onValueChange={setActiveDocument} className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          {documents.map(doc => (
            <TabsTrigger key={doc.id} value={doc.id} className="min-w-fit">
              {doc.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {documents.map(doc => (
          <TabsContent key={doc.id} value={doc.id} className="border rounded-md p-6">
            <div className="prose dark:prose-invert max-w-none">
              <Markdown>{doc.content}</Markdown>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
