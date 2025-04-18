"use client";
import StepRouter from "./StepRouter";
import ProjectHeader from "./ProjectHeader";
import StepIndicator from "./StepIndicator";

export default function CreateProjectShell() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 pt-6">
      <ProjectHeader />
      <StepIndicator />
      <StepRouter />
    </div>
  );
}