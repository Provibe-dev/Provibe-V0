// HeroSection.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Layers, Zap, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypewriterHeadline } from "./TypewriterHeadline";
import { FloatingIcons } from "./FloatingIcons"; // Import the new component

export function HeroSection() {
  const [activeWord, setActiveWord] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 z-0"> {/* Removed opacity-10 */}
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="h-full w-full bg-binary-pattern opacity-5"></div>
        {/* Use the FloatingIcons component */}
        <FloatingIcons />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="mb-6 animate-pulse border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
            Turn raw ideas into build-ready documentation
          </Badge>

          <TypewriterHeadline />
          
          <p className="mb-8 max-w-2xl text-lg text-secondary">
            ProVibe refines your idea into detailed documentation for your no-code
            tools, to build it right the first time.
          </p>

          <div className="mb-12 w-full max-w-4xl overflow-hidden">
            <div className="relative flex w-full overflow-x-hidden">
              <div className="animate-scroll flex whitespace-nowrap">
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                  Product Requirement Document
                </Button>
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <Layers className="mr-2 h-4 w-4 text-emerald-500" />
                  Architecture
                </Button>
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <GitBranch className="mr-2 h-4 w-4 text-emerald-500" />
                  User Flow
                </Button>
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <Zap className="mr-2 h-4 w-4 text-emerald-500" />
                  Implementation Plan
                </Button>

                {/* Duplicate buttons for continuous scrolling effect */}
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                  Product Requirement Document
                </Button>
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <Layers className="mr-2 h-4 w-4 text-emerald-500" />
                  Architecture
                </Button>
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <GitBranch className="mr-2 h-4 w-4 text-emerald-500" />
                  User Flow
                </Button>
                <Button
                  variant="outline"
                  className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                >
                  <Zap className="mr-2 h-4 w-4 text-emerald-500" />
                  Implementation Plan
                </Button>
              </div>
            </div>
          </div>

          <div className="flex animate-fade-in-up animation-delay-450 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600"
              asChild
            >
              <Link href="/auth/register">
                <span className="relative z-10 flex items-center">
                  Get Started{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-emerald-600 to-cyan-600 transition-transform duration-300 group-hover:translate-y-0"></span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
