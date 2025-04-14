// FloatingIcons.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Database,
  Code,
  Layers,
  LayoutTemplate,
  Workflow,
  Lightbulb,
  Rocket,
  Puzzle,
  Cpu,
  Terminal,
  Globe,
  KeyRound,
  Cloud,
  Anchor,
  Compass,
} from "lucide-react";

const leftIcons = [FileText, Database, Code, Layers, Cpu, Terminal, Cloud];
const rightIcons = [LayoutTemplate, Workflow, Lightbulb, Rocket, Puzzle, Globe, KeyRound, Anchor, Compass];

export function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Left side icons */}
      <div className="absolute left-0 top-0 h-full w-1/3 lg:block">
        {leftIcons.map((Icon, index) => {
          // Calculate vertical spacing
          const verticalPosition = (index / leftIcons.length) * 100;
          // Fixed horizontal position between 10% and 25%
          const horizontalPosition = 10 + (index % 3) * 20; // Positions at 10%, 15%, 20%, then repeat
          
          return (
            <motion.div
              key={`left-icon-${index}`}
              className="absolute"
              style={{
                left: `${horizontalPosition}%`,
                top: `${verticalPosition}vh`,
                color: ['#4ade80', '#38bdf8', '#a855f7', '#facc15', '#64748b', '#10b981', '#9ca3af'][index % 7],
                opacity: 0.95,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 5 + index % 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <Icon className="h-8 w-8" />
            </motion.div>
          );
        })}
      </div>

      {/* Right side icons */}
      <div className="absolute right-0 top-0 h-full w-1/3 lg:block">
        {rightIcons.map((Icon, index) => {
          // Calculate vertical spacing
          const verticalPosition = (index / rightIcons.length) * 100;
          // Fixed horizontal position between 10% and 25%
          const horizontalPosition = 10 + (index % 3) * 20; // Positions at 10%, 15%, 20%, then repeat
          
          return (
            <motion.div
              key={`right-icon-${index}`}
              className="absolute"
              style={{
                right: `${horizontalPosition}%`,
                top: `${verticalPosition}vh`,
                color: ['#f472b6', '#818cf8', '#f97316', '#84cc16', '#eab308', '#a78bfa', '#22c55e', '#d97706', '#0ea5e9'][index % 9],
                opacity: 0.95,
              }}
              animate={{
                y: [0, 15, 0],
                x: [0, -20, 0],
              }}
              transition={{
                duration: 5 + index % 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <Icon className="h-8 w-8" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
