import { useAuth } from "@/components/auth-provider";
import { updateProject } from "@/lib/api/projects";
export function useCredits() {
  const { user, refreshUser } = useAuth();
  async function spend(credits: number) {
    if (!user) return false;
    if (user.credits_remaining < credits) return false;
    // TODO: call backend to deduct credits
    await updateProject(user.id, { credits_remaining: user.credits_remaining - credits });
    refreshUser();
    return true;
  }
  return { credits: user?.credits_remaining ?? 0, spend };
}