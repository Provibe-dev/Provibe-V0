// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/steps/Step1.tsx
import { z } from "zod"
import { useForm, UseFormReturn } from "react-hook-form" // Import UseFormReturn
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Mic, MicOff, Sparkles, Loader2 } from "lucide-react" // Import needed icons
import Link from "next/link"
import { AudioRecorder } from "@/components/audio-recorder"
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { forwardRef, useImperativeHandle } from "react";

// Add a ref type for the component
export type Step1Ref = {
  refineIdea: (idea: string) => Promise<string | undefined>;
};

// No need to redefine schema here if managed in parent
// const ideaFormSchema = z.object({
//   idea: z.string().min(10, { message: "Your idea must be at least 10 characters" }),
// })

// Define the expected shape of the form data
type IdeaFormData = {
  idea: string;
}

type Step1Props = {
  ideaForm: UseFormReturn<IdeaFormData>; // Use the specific form type
  isRecording: boolean;
  toggleRecording: () => void;
  handleTranscription: (text: string, audioUrl: string) => void; // Include audioUrl if needed by handler
  navigateToStep: (step: number) => void;
  isRefining: boolean; // Add prop for refining state
  handleRefineIdea: () => Promise<void>; // Add prop for refine handler
  projectId?: string; // Optional: if needed for direct updates (use cautiously)
  isTestUser?: boolean; // Optional: if behavior differs for test user
}

const Step1 = forwardRef<Step1Ref, Step1Props>(({
  ideaForm,
  isRecording,
  toggleRecording,
  handleTranscription,
  navigateToStep,
  isRefining,
  handleRefineIdea,
  projectId,
  isTestUser
}, ref) => {
  const ideaValue = ideaForm.watch("idea");
  
  // Expose the refineIdea function to the parent via ref
  useImperativeHandle(ref, () => ({
    refineIdea: async (idea: string): Promise<string | undefined> => {
      console.log("Step1: Calling enhance-idea API endpoint with idea:", idea.substring(0, 30) + "...");
      
      try {
        const response = await fetch('/api/enhance-idea', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea }),
        });

        console.log("API response status:", response.status);
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("API returned non-JSON response");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `API call failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("API response received:", data);
        
        // Return the enhanced idea to the parent
        return data.enhancedIdea;
      } catch (error) {
        console.error("Error refining idea in Step1:", error);
        throw error; // Re-throw to let parent handle it
      }
    }
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Your Idea</CardTitle>
        <CardDescription>
          Describe your product idea in detail. What problem does it solve? What makes it unique? Use text or record audio. You can optionally refine your idea with AI assistance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pass the form instance down */}
        <Form {...ideaForm}>
          {/* Remove the extra <form> tag, FormProvider handles it */}
          <div className="space-y-6">
            <FormField
              control={ideaForm.control}
              name="idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Your Idea</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product idea in detail..."
                        className="min-h-[200px] resize-none pr-[180px]" // Add padding for buttons
                        {...field}
                        // onChange is handled by react-hook-form's field object
                        // Debounced DB updates are handled in page.tsx via watch
                      />
                    </FormControl>
                    {/* Buttons absolutely positioned inside the relative container */}
                    <div className="absolute right-3 top-3 flex flex-col space-y-2">
                       <Button
                         type="button"
                         size="sm"
                         variant="outline"
                         onClick={toggleRecording}
                         className={
                           isRecording ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700" : ""
                         }
                       >
                         {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                         {isRecording ? "Stop" : "Record"}
                       </Button>

                       <Button
                         type="button"
                         size="sm"
                         variant="outline"
                         onClick={handleRefineIdea} // Use passed handler
                         disabled={isRefining || !field.value || field.value.length < 10} // Use passed state
                       >
                         {isRefining ? (
                           <>
                             <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Refining...
                           </>
                         ) : (
                           <>
                             <Sparkles className="h-4 w-4 mr-1" /> Refine
                           </>
                         )}
                       </Button>
                     </div>
                  </div>

                  {isRecording && (
                    <div className="mt-4 rounded-md border p-4">
                       <p className="text-sm text-muted-foreground mb-2">Recording audio...</p>
                      <AudioRecorder onTranscription={handleTranscription} />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/projects">Cancel</Link>
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(2)}
          disabled={!ideaValue || ideaValue.length < 10}
          className="opacity-100" // Force full opacity
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

// Add display name
Step1.displayName = "Step1";

export default Step1;
