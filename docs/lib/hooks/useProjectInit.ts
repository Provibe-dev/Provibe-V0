import { useEffect } from "react";
import { createProject } from "@/lib/api/projects";
import { useWizard } from "@/app/dashboard/create/components/WizardContext";
import { useAuth } from "@/components/auth-provider";

export function useProjectInit(projectName = "Untitled Project") {
  const { user } = useAuth();
  const { projectId, setProjectId } = useWizard();

  useEffect(() => {
    if (!user || projectId) return;
    createProject(user.id, projectName).then((p) => setProjectId(p.id));
  }, [user, projectId, projectName, setProjectId]);
}