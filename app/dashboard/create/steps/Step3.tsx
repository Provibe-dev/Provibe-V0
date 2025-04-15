// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/steps/Step3.tsx
import { z } from "zod"
import { UseFormReturn } from "react-hook-form"; // Import UseFormReturn
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for potentially longer answers
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react" // Import Loader2

// Define the expected shape of the form data (matches the schema in page.tsx)
const detailsFormSchema = z.object({
  targetAudience: z.string().optional(),
  problemSolved: z.string().optional(),
  keyFeatures: z.string().optional(),
  successMetrics: z.string().optional(),
  timeline: z.string().optional(),
});

type DetailsFormData = z.infer<typeof detailsFormSchema>;

// Define field names type based on the schema keys
type DetailField = keyof DetailsFormData;

// *** Corrected Step3Props ***
type Step3Props = {
  detailsForm: UseFormReturn<DetailsFormData>; // Use specific form type from schema
  isGeneratingAnswer: boolean; // Changed from isRefining
  generatingAnswerField: DetailField | null; // Added this prop to track loading field
  handleGenerateAnswer: (field: DetailField) => Promise<void>; // Changed from handleAIRefine and updated signature
  navigateToStep: (step: number) => void;
  projectId?: string; // Added optional prop
  isTestUser?: boolean; // Added optional prop
}

export default function Step3({
    detailsForm,
    isGeneratingAnswer, // Use correct prop name
    generatingAnswerField, // Use correct prop name
    handleGenerateAnswer, // Use correct prop name
    navigateToStep,
    projectId, // Destructure added props
    isTestUser // Destructure added props
}: Step3Props) {

  // Define the fields based on the schema for iteration
  const fields: { name: DetailField; label: string; placeholder: string }[] = [
    { name: "targetAudience", label: "Who is your target audience?", placeholder: "Describe your target users..." },
    { name: "problemSolved", label: "What problem does your product solve?", placeholder: "Describe the problem your product addresses..." },
    { name: "keyFeatures", label: "What are the key features?", placeholder: "List the main features..." },
    { name: "successMetrics", label: "How will you measure success?", placeholder: "Describe your success metrics..." },
    { name: "timeline", label: "What is your expected timeline?", placeholder: "Describe your project timeline..." },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Product Details</CardTitle>
        <CardDescription>
          Answer these questions to help us understand your product better. You can skip questions or use AI to generate answers (costs 25 credits each).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...detailsForm}>
          {/* Removed the redundant <form> tag */}
          <div className="space-y-6">
            {fields.map((item) => (
              <FormField
                key={item.name}
                control={detailsForm.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{item.label}</FormLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGenerateAnswer(item.name)} // Use correct handler
                        disabled={isGeneratingAnswer} // Disable all AI buttons if any is running
                        className="text-xs"
                      >
                        {/* Show loader only for the specific field being generated */}
                        {isGeneratingAnswer && generatingAnswerField === item.name ? (
                           <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                           <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        {isGeneratingAnswer && generatingAnswerField === item.name ? 'Generating...' : 'AI Answer'}
                      </Button>
                    </div>
                    <FormControl>
                      {/* Use Textarea instead of Input for potentially longer answers */}
                      <Textarea placeholder={item.placeholder} rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(2)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="button" onClick={() => navigateToStep(4)}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
