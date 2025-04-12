"use client"
import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"

interface AITool {
  id: string
  name: string
  category: string
  logo: string
  description: string
}

interface AIToolSelectorProps {
  selectedTools: string[]
  onSelectionChange: (tools: string[]) => void
}

export function AIToolSelector({ selectedTools, onSelectionChange }: AIToolSelectorProps) {
  const [aiTools, setAiTools] = useState<AITool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAITools() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('ai_tools')
          .select('*')
          .order('name')
        
        if (error) {
          throw error
        }
        
        setAiTools(data || [])
      } catch (err: any) {
        console.error('Error fetching AI tools:', err)
        setError(err.message || 'Failed to load AI tools')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAITools()
  }, [])

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onSelectionChange(selectedTools.filter((id) => id !== toolId))
    } else {
      onSelectionChange([...selectedTools, toolId])
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Failed to load AI tools. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {aiTools.map((tool) => (
        <div
          key={tool.id}
          className={cn(
            "relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
            selectedTools.includes(tool.id)
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-800"
          )}
          onClick={() => toggleTool(tool.id)}
        >
          {selectedTools.includes(tool.id) && (
            <div className="absolute top-2 right-2">
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          )}
          <div className="flex-shrink-0">
            <img
              src={tool.logo}
              alt={`${tool.name} logo`}
              className="h-10 w-10 rounded-md object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium">{tool.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {tool.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
