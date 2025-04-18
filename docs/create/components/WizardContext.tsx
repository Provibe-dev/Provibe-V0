"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface WizardState {
  activeStep: number;
  setActiveStep: (s: number) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  selectedTools: string[];
  setSelectedTools: (t: string[]) => void;
  // add other top‑level fields as needed
}

const WizardContext = createContext<WizardState | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [activeStep, setActiveStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  return (
    <WizardContext.Provider
      value={{ activeStep, setActiveStep, projectId, setProjectId, selectedTools, setSelectedTools }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}