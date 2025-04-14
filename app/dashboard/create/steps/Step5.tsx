import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Document types available for generation
const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄" },
  { id: "user_flow", title: "User Flow", icon: "🔄" },
  { id: "architecture", title: "Architecture Document", icon: "🏗️" },
  { id: "schema", title: "Database Schema", icon: "🗄️" },
  { id: "api_spec", title: "API Specification", icon: "🔌" },
]

type Step5Props = {
  user: any;
  selectedDocuments: string[];
  setSelectedDocuments: (docs: string[]) => void;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  navigateToStep: (step: number) => void;
}

export default function Step5({
  user,
  selectedDocuments,
  setSelectedDocuments,
  isSubmitting,
  handleSubmit,
  navigateToStep
}: Step5Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Generate Documents</CardTitle>
        <CardDescription>
          Select the documents you want to generate for your project. This will use your available credits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Each document costs 200 credits to generate. You have {user?.credits_remaining || 0} credits
            remaining.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_TYPES.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-colors cursor-pointer",
                selectedDocuments.includes(doc.id)
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-50"
                  : "border-border bg-background hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => {
                if (selectedDocuments.includes(doc.id)) {
                  setSelectedDocuments(selectedDocuments.filter((d) => d !== doc.id))
                } else {
                  setSelectedDocuments([...selectedDocuments, doc.id])
                }
              }}
            >
              <div className="text-3xl">{doc.icon}</div>
              <h3 className="mt-4 font-medium">{doc.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">200 credits</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(4)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedDocuments.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Project...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}