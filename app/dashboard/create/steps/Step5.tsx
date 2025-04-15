// /Users/aravindtambad/Documents/Provibe Projects/Provibe-V0-v2/app/dashboard/create/steps/Step5.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Document types available for generation (assuming this is correct)
export const DOCUMENT_TYPES = [
  { id: "prd", title: "Product Requirements Document", icon: "📄", cost: 200 },
  { id: "user_flow", title: "User Flow Diagram", icon: "🔄", cost: 200 },
  { id: "architecture", title: "System Architecture", icon: "🏗️", cost: 200 },
  { id: "schema", title: "Database Schema", icon: "🗄️", cost: 200 },
  { id: "api_spec", title: "API Specification", icon: "🔌", cost: 200 },
  // Add more as needed
]

// Placeholder for the actual user type from your useAuth hook
// Replace 'any' with the imported type if available, e.g., import { User } from '@/path/to/auth';
type UserType = any; // Replace 'any' with your actual User type

type Step5Props = {
  user: UserType | null; // Allow null if user might not be loaded yet
  selectedDocuments: string[];
  setSelectedDocuments: (docs: string[]) => void;
  isSubmitting: boolean;
  handleGenerateDocuments: () => Promise<void>; // Renamed from handleSubmit
  navigateToStep: (step: number) => void;
}

export default function Step5({
  user,
  selectedDocuments,
  setSelectedDocuments,
  isSubmitting,
  handleGenerateDocuments, // Use the correct prop name
  navigateToStep
}: Step5Props) {

  const totalCost = selectedDocuments.reduce((sum, docId) => {
    const doc = DOCUMENT_TYPES.find(d => d.id === docId);
    return sum + (doc?.cost || 0);
  }, 0);

  const canAfford = user ? (user.credits_remaining ?? 0) >= totalCost : false;

  const handleSelectDocument = (docId: string) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter((d) => d !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Generate Documents</CardTitle>
        <CardDescription>
          Select the documents you want AI to generate for your project. Review the credit cost below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-md border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-950">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Credits Available: {user?.credits_remaining ?? 'Loading...'}
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Selected Documents Cost: {totalCost} credits
          </p>
          {selectedDocuments.length > 0 && !canAfford && (
             <p className="mt-1 text-sm font-semibold text-red-600 dark:text-red-400">
                Insufficient credits to generate selected documents.
             </p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_TYPES.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all duration-150 ease-in-out cursor-pointer",
                selectedDocuments.includes(doc.id)
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-900/50 dark:border-emerald-700" // Enhanced selected style
                  : "border-border bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md", // Hover effect
                !user && "opacity-50 cursor-not-allowed" // Dim if user/credits not loaded
              )}
              onClick={() => user && handleSelectDocument(doc.id)} // Only allow click if user loaded
              role="checkbox"
              aria-checked={selectedDocuments.includes(doc.id)}
              tabIndex={user ? 0 : -1} // Make focusable only if interactive
            >
              <div className="text-4xl mb-2">{doc.icon}</div>
              <h3 className="mt-2 font-semibold text-base">{doc.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{doc.cost} credits</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => navigateToStep(4)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleGenerateDocuments} // Use the correct handler
          disabled={isSubmitting || selectedDocuments.length === 0 || !canAfford} // Disable if submitting, nothing selected, or cannot afford
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            `Generate (${totalCost} Credits)` // Show cost on button
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
