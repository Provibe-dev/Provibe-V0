import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { AIToolSelector } from "@/components/ai-tool-selector"

type Step2Props = {
  selectedTools: string[];
  onSelectionChange: (tools: string[]) => void;
  navigateToStep: (step: number) => void;
}

export default function Step2({ selectedTools, onSelectionChange, navigateToStep }: Step2Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Select Tools</CardTitle>
        <CardDescription>Choose the technologies and tools you plan to use for this project.</CardDescription>
      </CardHeader>
      <CardContent>
        <AIToolSelector selectedTools={selectedTools} onSelectionChange={onSelectionChange} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="button" onClick={() => navigateToStep(3)}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}