"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AIToolSelector } from "@/components/ai-tool-selector";

import { useWizard } from "../WizardContext";

export default function Step2Tools() {
  const { selectedTools, setSelectedTools, setActiveStep } = useWizard();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2 — Select Tools</CardTitle>
        <CardDescription>
          Choose the technologies and tools you plan to use for this project.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AIToolSelector
          selectedTools={selectedTools}
          onSelectionChange={setSelectedTools}
        />
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => setActiveStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="button" onClick={() => setActiveStep(3)}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}