// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/steps/Step4.tsx
import { UseFormReturn } from "react-hook-form" // Import UseFormReturn
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Loader2, Edit2 } from "lucide-react" // Added Edit2
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils" // Import cn if needed for styling

// Define expected form data shapes (can be inferred or explicitly defined)
type IdeaFormData = { idea: string; }
type DetailsFormData = {
  targetAudience?: string;
  problemSolved?: string;
  keyFeatures?: string;
  successMetrics?: string;
  timeline?: string;
};

type Step4Props = {
  ideaForm: UseFormReturn<IdeaFormData>; // Use specific form type
  detailsForm: UseFormReturn<DetailsFormData>; // Use specific form type
  selectedTools: string[];
  projectPlan: string;
  isGeneratingPlan: boolean;
  handleGeneratePlan: () => Promise<void>; // Correct handler name
  navigateToStep: (step: number) => void;
}

// Helper to format keys nicely
const formatDetailKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capitals
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};


export default function Step4({
  ideaForm,
  detailsForm,
  selectedTools,
  projectPlan,
  isGeneratingPlan,
  handleGeneratePlan,
  navigateToStep
}: Step4Props) {

  // Get form values directly for display
  const ideaValue = ideaForm.getValues().idea;
  const detailValues = detailsForm.getValues();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Review & Generate Plan</CardTitle>
        <CardDescription>
          Review your inputs and generate a project plan. You can go back to edit any section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Sections */}
        <div className="space-y-4">
          {/* Idea Review */}
          <div className="rounded-md border p-4 relative group">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">Your Idea</h3>
                <Button variant="ghost" size="sm" onClick={() => navigateToStep(1)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{ideaValue || "No idea provided yet."}</p>
          </div>

          {/* Tools Review */}
          <div className="rounded-md border p-4 relative group">
             <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">Selected Tools</h3>
                <Button variant="ghost" size="sm" onClick={() => navigateToStep(2)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedTools.length > 0 ? (
                selectedTools.map((tool) => (
                  <div key={tool} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    {tool}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tools selected</p>
              )}
            </div>
          </div>

          {/* Details Review */}
          <div className="rounded-md border p-4 relative group">
             <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">Project Details</h3>
                <Button variant="ghost" size="sm" onClick={() => navigateToStep(3)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>
            <div className="mt-1 space-y-2 text-sm">
              {Object.entries(detailValues).map(([key, value]) => (
                value ? ( // Only display if a value exists
                    <div key={key}>
                    <span className="font-medium text-foreground">{formatDetailKey(key)}: </span>
                    <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                ) : null
              ))}
              {/* Show message if no details provided */}
              {Object.values(detailValues).every(v => !v) && (
                 <p className="text-sm text-muted-foreground">No details provided yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Plan Section */}
        <div className="mt-6">
          {projectPlan ? (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium">Project Plan</h3>
              {/* Ensure prose styles apply correctly */}
              <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
                <ReactMarkdown>{projectPlan}</ReactMarkdown>
              </div>
               <Button
                  onClick={handleGeneratePlan} // Allow regenerating
                  disabled={isGeneratingPlan}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Regenerating...
                    </>
                  ) : (
                    "Regenerate Plan"
                  )}
                </Button>
            </div>
          ) : (
            <Button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full"
              size="lg" // Make generate button prominent
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(3)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(5)}
          disabled={!projectPlan || isGeneratingPlan} // Disable next if no plan or currently generating
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
