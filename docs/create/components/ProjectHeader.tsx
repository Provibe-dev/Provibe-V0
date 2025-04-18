"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Save } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useWizard } from "./WizardContext";
import { useCredits } from "@/lib/hooks/useCredits";

export default function ProjectHeader() {
  const { projectId } = useWizard();
  const { credits } = useCredits();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Untitled Project");
  const inputRef = useRef<HTMLInputElement>(null);

  const save = () => setIsEditing(false); // TODO: call API to persist name

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        {isEditing ? (
          <div className="flex items-center ml-2">
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={save}
              className="h-9 text-xl font-bold"
            />
            <Button variant="ghost" size="sm" onClick={save} className="ml-2">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center ml-2 group">
            <h1
              className="text-2xl font-bold cursor-pointer group-hover:text-emerald-600"
              onClick={() => setIsEditing(true)}
            >
              {name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-1 opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">Credits: {credits}</div>
    </div>
  );
}