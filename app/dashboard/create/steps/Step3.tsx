import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"

// Form schema for Step 3: Details
const detailsFormSchema = z.object({
  targetAudience: z.string().optional(),
  problemSolved: z.string().optional(),
  keyFeatures: z.string().optional(),
  successMetrics: z.string().optional(),
  timeline: z.string().optional(),
})

type Step3Props = {
  detailsForm: any;
  isRefining: boolean;
  handleAIRefine: (field: string) => Promise<void>;
  navigateToStep: (step: number) => void;
}

export default function Step3({ detailsForm, isRefining, handleAIRefine, navigateToStep }: Step3Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Project Details</CardTitle>
        <CardDescription>
          Provide more details about your project to help generate a comprehensive plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...detailsForm}>
          <form className="space-y-6">
            <FormField
              control={detailsForm.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Target Audience
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAIRefine("targetAudience")}
                      disabled={isRefining}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Suggest
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Who will use your product?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Repeat similar FormField blocks for other fields */}
            {/* problemSolved, keyFeatures, successMetrics, timeline */}
            
            {/* For brevity, I'm only showing one field. Add the others similarly */}
          </form>
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