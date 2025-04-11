"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { FileText, FileCode, FileQuestion, FileSpreadsheet, ArrowLeft, Sparkles, Loader2 } from "lucide-react"

export default function NewDocumentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: "prd",
      title: "Product Requirements Document",
      description: "Define product features, requirements, and specifications",
      icon: <FileText className="h-10 w-10 text-emerald-500" />,
    },
    {
      id: "tech-spec",
      title: "Technical Specification",
      description: "Detailed technical implementation guidelines",
      icon: <FileCode className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "user-guide",
      title: "User Guide",
      description: "End-user documentation and instructions",
      icon: <FileQuestion className="h-10 w-10 text-purple-500" />,
    },
    {
      id: "api-docs",
      title: "API Documentation",
      description: "Document API endpoints, parameters, and responses",
      icon: <FileCode className="h-10 w-10 text-blue-500" />,
    },
    {
      id: "comparison",
      title: "Feature Comparison",
      description: "Compare features across different products or versions",
      icon: <FileSpreadsheet className="h-10 w-10 text-orange-500" />,
    },
    {
      id: "release-notes",
      title: "Release Notes",
      description: "Document changes, improvements, and fixes in a release",
      icon: <FileText className="h-10 w-10 text-emerald-500" />,
    },
  ]

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleGenerateDocument = async () => {
    if (!title || !description || !selectedTemplate) {
      toast({
        title: "Missing information",
        description: "Please provide a title, description, and select a template.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // In a real app, this would be an API call to generate the document
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Document generated successfully",
        description: "Your document has been created and is ready to edit.",
      })

      router.push("/dashboard/documents")
    } catch (error) {
      toast({
        title: "Failed to generate document",
        description: "An error occurred while generating your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-2 text-3xl font-bold tracking-tight">Create New Document</h1>
      </div>

      <Tabs defaultValue="ai-assisted" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ai-assisted">AI-Assisted</TabsTrigger>
          <TabsTrigger value="from-scratch">From Scratch</TabsTrigger>
          <TabsTrigger value="from-template">From Template</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-assisted" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="Enter document title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (What should this document cover?)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to document..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Document Type</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:border-emerald-500 ${
                        selectedTemplate === template.id ? "border-2 border-emerald-500" : ""
                      }`}
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start">{template.icon}</div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardTitle className="text-base">{template.title}</CardTitle>
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleGenerateDocument}
                disabled={isGenerating || !title || !description || !selectedTemplate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Document with AI
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-medium">AI-Assisted Document Creation</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Our AI will help you create a comprehensive document based on your description. The more details you
                provide, the better the result.
              </p>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 text-sm font-medium">Tips for better results:</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    <li>Be specific about what you want to document</li>
                    <li>Include key points you want to cover</li>
                    <li>Mention your target audience</li>
                    <li>Specify any formatting preferences</li>
                    <li>Include relevant technical details</li>
                  </ul>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 text-sm font-medium">Example:</h4>
                  <p className="text-sm italic text-muted-foreground">
                    "Create a PRD for a new feature that allows users to export their documents in multiple formats. The
                    target audience is product managers and developers. Include sections for user stories, requirements,
                    and technical considerations."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="from-scratch" className="space-y-6">
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Create from scratch</h3>
              <p className="mt-2 text-sm text-muted-foreground">Start with a blank document and build it your way</p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/documents/editor")}>
                Create blank document
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="from-template" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer transition-all hover:border-emerald-500"
                onClick={() => router.push(`/dashboard/documents/template/${template.id}`)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start">{template.icon}</div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
