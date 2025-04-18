import { useRef } from "react";
import { updateProject } from "@/lib/api/projects";

export const useAutoSaveField = (projectId: string, column: string) => {
  return useDebouncedCallback(async (value: unknown) => {
    if (!projectId) return;
    await updateProject(projectId, { [column]: value });
  }, 1000);
};
