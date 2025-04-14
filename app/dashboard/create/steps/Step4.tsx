import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Markdown } from "@/components/markdown"

type Step4Props = {
  ideaForm: any;
  detailsForm: any;
  selectedTools: string[];
  projectPlan: string;
  isGeneratingPlan: boolean;
  handleGeneratePlan: () => Promise<void>;
  navigateToStep: (step: number) => void;
}

export default function Step4({
  ideaForm,
  detailsForm,
  selectedTools,
  projectPlan,
  isGeneratingPlan,
  handleGeneratePlan,
  navigateToStep
}: Step4Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Review & Generate Plan</CardTitle>
        <CardDescription>
          Review your inputs and generate a project plan. You can go back to edit any section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium">Your Idea</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm">{ideaForm.getValues().idea}</p>
            <Button variant="ghost" size="sm" onClick={() => navigateToStep(1)} className="mt-2">
              Edit
            </Button>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium">Selected Tools</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTools.length > 0 ? (
                selectedTools.map((tool) => (
                  <div key={tool} className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
                    {tool}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tools selected</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigateToStep(2)} className="mt-2">
              Edit
            </Button>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium">Project Details</h3>
            <div className="mt-2 space-y-2 text-sm">
              {Object.entries(detailsForm.getValues()).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: </span>
                  <span>{value || "Not specified"}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigateToStep(3)} className="mt-2">
              Edit
            </Button>
          </div>
        </div>

        {projectPlan ? (
          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium">Project Plan</h3>
            <div className="prose prose-sm mt-2 max-w-none dark:prose-invert">
              <Markdown content={projectPlan} />
            </div>
          </div>
        ) : (
          <Button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="w-full"
          >
            {isGeneratingPlan ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...
              </>
            ) : (
              "Generate Project Plan"
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(5)}
          disabled={!projectPlan}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}