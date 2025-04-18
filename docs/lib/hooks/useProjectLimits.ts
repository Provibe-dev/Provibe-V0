import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase-client";

interface LimitStatus {
  ok: boolean;          // true if user can still create projects
  count: number;        // projects already created
  limit: number;        // tier limit pulled from user. projects_limit
  reason?: string;      // optional message ("limit" | "error:<msg>")
}

/**
 * Checks how many projects the current user has and whether they’ve hit their tier cap.
 * Runs on mount and whenever the authenticated user changes.
 */
export function useProjectLimits(): LimitStatus {
  const { user } = useAuth();
  const [status, setStatus] = useState<LimitStatus>({ ok: false, count: 0, limit: 0 });

  useEffect(() => {
    if (!user) return;
    if (!user?.id) return;

    let cancel = false;

    async function fetchCount() {
      // Head‑only query for count ‑ cheapest on Supabase
      const { count, error } = await supabase
        .from("projects")
        .select("id", { head: true, count: "exact" })
        .eq("user_id", user!.id);

      if (cancel) return; // bail if component unmounted

      if (error) {
        setStatus({ ok: false, count: 0, limit: user.projects_limit, reason: `error:${error.message}` });
        return;
      }

      const projectCount = count ?? 0;
      if (projectCount >= user.projects_limit) {
        setStatus({ ok: false, count: projectCount, limit: user.projects_limit, reason: "limit" });
      } else {
        setStatus({ ok: true, count: projectCount, limit: user.projects_limit });
      }
    }

    fetchCount();
    return () => {
      cancel = true;
    };
  }, [user]);

  return status;
}
