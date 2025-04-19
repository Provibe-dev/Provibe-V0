import React from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentViewerProps {
  document: {
    id: string;
    title: string;
    type: string;
    content: string;
  };
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No document to display</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <Card className="border-0 shadow-none">
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-bold">{document.title}</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
