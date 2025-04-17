import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0",
      className
    )}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex space-x-4">
          {children}
        </div>
      )}
    </div>
  );
}
