import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AudioRecorder } from "@/components/audio-recorder"

// Form schema for Step 1: Idea
const ideaFormSchema = z.object({
  idea: z.string().min(10, { message: "Your idea must be at least 10 characters" }),
})

type Step1Props = {
  ideaForm: any;
  isRecording: boolean;
  toggleRecording: () => void;
  handleTranscription: (text: string) => void;
  navigateToStep: (step: number) => void;
}

export default function Step1({ ideaForm, isRecording, toggleRecording, handleTranscription, navigateToStep }: Step1Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Your Idea</CardTitle>
        <CardDescription>
          Describe your product idea in detail. What problem does it solve? What makes it unique?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...ideaForm}>
          <form className="space-y-6">
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
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={toggleRecording}
                    >
                      {isRecording ? "Stop Recording" : "Record Voice"}
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="mt-4">
                      <AudioRecorder onTranscription={handleTranscription} />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/projects">Cancel</Link>
        </Button>
        <Button
          type="button"
          onClick={() => navigateToStep(2)}
          disabled={!ideaForm.getValues().idea || ideaForm.getValues().idea.length < 10}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}