"use client";

import { useWizard } from "./WizardContext";
import Step1Idea from "./steps/Step1Idea";
import Step2Tools from "./steps/Step2Tools";
import Step3Details from "./steps/Step3Details";
import Step4Plan from "./steps/Step4Plan";
import Step5Generate from "./steps/Step5Generate";

export default function StepRouter() {
  const { activeStep } = useWizard();
  switch (activeStep) {
    case 1:
      return <Step1Idea />;
    case 2:
      return <Step2Tools />;
    case 3:
      return <Step3Details />;
    case 4:
      return <Step4Plan />;
    case 5:
      return <Step5Generate />;
    default:
      return null;
  }
}