"use client"

import { useState } from "react"
import { Download, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

interface DocumentViewerProps {
  document: {
    id: string
    title: string
    type: string
    content: string
    status: string
    error_message?: string
  }
  onRegenerateDocument?: () => void
  onDownloadDocument?: () => void
}

export function DocumentViewer({ document, onRegenerateDocument, onDownloadDocument }: DocumentViewerProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const { toast } = useToast()

  // Add null check for document
  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg font-medium">No document selected</p>
        <p className="text-sm text-muted-foreground mt-2">Please select a document to view.</p>
      </div>
    )
  }

  const handleRegenerate = async () => {
    if (onRegenerateDocument) {
      setIsRegenerating(true)
      try {
        await onRegenerateDocument()
      } catch (error) {
        toast({
          title: "Regeneration failed",
          description: "There was an error regenerating the document. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsRegenerating(false)
      }
    }
  }

  const handleDownload = () => {
    if (onDownloadDocument) {
      onDownloadDocument()
    }
  }

  // If document is still generating or pending
  if (document.status === "pending" || document.status === "generating") {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-lg font-medium">Generating document...</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a moment.</p>
      </div>
    )
  }

  // If document generation failed
  if (document.status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-lg font-medium">Document generation failed</p>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          {document.error_message || "An error occurred during document generation."}
        </p>
        <Button onClick={handleRegenerate} disabled={isRegenerating}>
          {isRegenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating}>
          {isRegenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
          <Card className="p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{document.content}</ReactMarkdown>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="flex-1 p-4 overflow-auto">
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{document.content}</pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}
