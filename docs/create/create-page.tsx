"use client";
import { WizardProvider } from "@/app/dashboard/create/components/WizardContext";
import CreateProjectShell from "@/app/dashboard/create/components/CreateProjectShell";

export default function CreateProjectPage() {
  return (
    <WizardProvider>
      <CreateProjectShell />
    </WizardProvider>
  );
}