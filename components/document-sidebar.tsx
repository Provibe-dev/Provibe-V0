"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Document {
  id: string
  title: string
  type: string
  icon: React.ReactNode
  status: "completed" | "in-progress" | "pending"
}

interface DocumentSidebarProps {
  documents: Document[]
  activeDocumentId: string
  onSelectDocument: (documentId: string) => void
}

export function DocumentSidebar({ documents, activeDocumentId, onSelectDocument }: DocumentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500"
      case "in-progress":
        return "bg-amber-500"
      case "pending":
        return "bg-slate-400"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <div className="flex h-full w-full flex-col border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium text-muted-foreground">Generated Documents ({documents.length})</div>

          <div className="space-y-1">
            {filteredDocuments.map((doc) => (
              <button
                key={doc.id}
                className={cn(
                  "flex w-full items-center justify-between rounded-md p-2 text-sm transition-colors hover:bg-muted",
                  activeDocumentId === doc.id ? "bg-muted" : "",
                )}
                onClick={() => onSelectDocument(doc.id)}
              >
                <div className="flex items-center gap-3">
                  {doc.icon}
                  <div className="text-left">
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-xs text-muted-foreground">{doc.type}</div>
                  </div>
                </div>
                <div className={cn("h-2 w-2 rounded-full", getStatusColor(doc.status))} />
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
