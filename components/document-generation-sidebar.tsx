"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Loader2, RefreshCw, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  title: string
  type: string
  status: "pending" | "generating" | "completed" | "error"
  icon: React.ReactNode
  error_message?: string
}

interface DocumentGenerationSidebarProps {
  documents: Document[]
  activeDocumentId: string
  onSelectDocument: (documentId: string) => void
  onRegenerateDocument?: (documentId: string) => void
  onDownloadDocument?: (documentId: string) => void
}

export function DocumentGenerationSidebar({
  documents,
  activeDocumentId,
  onSelectDocument,
  onRegenerateDocument,
  onDownloadDocument,
}: DocumentGenerationSidebarProps) {
  const [regeneratingDocId, setRegeneratingDocId] = useState<string | null>(null)

  // Handle document regeneration
  const handleRegenerateDocument = async (documentId: string) => {
    try {
      setRegeneratingDocId(documentId)

      if (onRegenerateDocument) {
        onRegenerateDocument(documentId)
      }
    } catch (error) {
      console.error("Error regenerating document:", error)
    } finally {
      // We'll keep the regeneratingDocId set until the document status changes
      // This will be cleared when the document status is updated via Supabase Realtime
    }
  }

  // Clear regeneratingDocId when document status changes
  useEffect(() => {
    if (regeneratingDocId) {
      const doc = documents.find((d) => d.id === regeneratingDocId)
      if (doc && doc.status !== "generating") {
        setRegeneratingDocId(null)
      }
    }
  }, [documents, regeneratingDocId])

  // Handle document download
  const handleDownloadDocument = (documentId: string) => {
    if (onDownloadDocument) {
      onDownloadDocument(documentId)
    }
  }

  return (
    <div className="flex h-full w-full flex-col border-r">
      <div className="p-4 border-b">
        <h3 className="font-medium">Generated Documents</h3>
        <p className="text-sm text-muted-foreground">
          {documents.filter((doc) => doc.status === "completed").length} of {documents.length} completed
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex flex-col rounded-md p-3 transition-colors",
                doc.status === "completed" ? "cursor-pointer" : "",
                activeDocumentId === doc.id ? "bg-muted" : "hover:bg-muted/50",
              )}
              onClick={() => doc.status === "completed" && onSelectDocument(doc.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.icon}
                  <div className="text-left">
                    <div className="font-medium">{doc.title}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {doc.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {doc.status === "generating" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  {doc.status === "completed" && <Check className="h-4 w-4 text-emerald-500" />}
                  {doc.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>

              {doc.status === "completed" && (
                <div className="flex mt-2 gap-2 justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRegenerateDocument(doc.id)
                          }}
                          disabled={regeneratingDocId === doc.id}
                        >
                          {regeneratingDocId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Regenerate document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadDocument(doc.id)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {doc.status === "error" && (
                <div className="flex mt-2 gap-2 justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRegenerateDocument(doc.id)
                          }}
                          disabled={regeneratingDocId === doc.id}
                        >
                          {regeneratingDocId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Try again</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
