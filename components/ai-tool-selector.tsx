"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AITool {
  id: string
  name: string
  logo: string
  description: string
}

interface AIToolSelectorProps {
  selectedTools: string[]
  onSelectionChange: (tools: string[]) => void
}

export function AIToolSelector({ selectedTools, onSelectionChange }: AIToolSelectorProps) {
  // Mock AI tools data
  const aiTools: AITool[] = [
    {
      id: "openai",
      name: "OpenAI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
      description: "GPT models for text generation and analysis",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png",
      description: "Claude models for safe and helpful AI assistants",
    },
    {
      id: "midjourney",
      name: "Midjourney",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/600px-Midjourney_Emblem.png",
      description: "AI image generation from text descriptions",
    },
    {
      id: "stability",
      name: "Stability AI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Stability_AI_logo.svg/1200px-Stability_AI_logo.svg.png",
      description: "Open source image and video generation models",
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
      description: "Open-source AI models and datasets",
    },
    {
      id: "cohere",
      name: "Cohere",
      logo: "https://assets-global.website-files.com/64f6f2c0e3f4c5a91c1e823a/654aa9e9a7ec8d7af52d7f75_cohere-logo.svg",
      description: "Large language models for text understanding",
    },
    {
      id: "replicate",
      name: "Replicate",
      logo: "https://replicate.com/static/favicon.e392dd9c6a07.png",
      description: "Run open-source models with a cloud API",
    },
    {
      id: "runwayml",
      name: "Runway",
      logo: "https://cdn.sanity.io/images/u0v1th4q/production/bc5f4e9d13a053b4594c0d55b5e3159c1910cf0c-1046x1046.jpg",
      description: "AI video generation and editing tools",
    },
  ]

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onSelectionChange(selectedTools.filter((id) => id !== toolId))
    } else {
      onSelectionChange([...selectedTools, toolId])
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {aiTools.map((tool) => (
        <div
          key={tool.id}
          className={cn(
            "relative flex flex-col items-center rounded-lg border p-4 transition-colors cursor-pointer",
            selectedTools.includes(tool.id)
              ? "border-emerald-500 bg-emerald-50/10"
              : "hover:border-emerald-200 hover:bg-emerald-50/5",
          )}
          onClick={() => toggleTool(tool.id)}
        >
          {selectedTools.includes(tool.id) && (
            <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="h-3 w-3" />
            </div>
          )}
          <div className="h-12 w-12 overflow-hidden rounded-md bg-background p-1">
            <img
              src={tool.logo || "/placeholder.svg"}
              alt={`${tool.name} logo`}
              className="h-full w-full object-contain"
            />
          </div>
          <h3 className="mt-3 font-medium text-sm">{tool.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground text-center">{tool.description}</p>
        </div>
      ))}
    </div>
  )
}
