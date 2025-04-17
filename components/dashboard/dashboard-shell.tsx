import React from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className={cn(
      "space-y-8 p-4 md:p-6 lg:p-8 pt-6", // Consistent padding with adjusted top padding
      className
    )}>
      {children}
    </div>
  );
}