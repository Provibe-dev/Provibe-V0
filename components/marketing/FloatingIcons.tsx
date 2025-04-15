// FloatingIcons.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { aiTools } from "@/data/ai-tools";

// Split the AI tools into left and right groups
const leftTools = aiTools.slice(0, Math.floor(aiTools.length / 2));
const rightTools = aiTools.slice(Math.floor(aiTools.length / 2));

export function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Left side icons */}
      <div className="absolute left-0 top-0 h-full w-1/3 lg:block">
        {leftTools.map((tool, index) => {
          // Calculate vertical spacing
          const verticalPosition = (index / leftTools.length) * 100;
          // Fixed horizontal position between 10% and 25%
          const horizontalPosition = 10 + (index % 3) * 20;
          
          return (
            <motion.div
              key={`left-icon-${index}`}
              className="absolute"
              initial={{
                left: `${horizontalPosition}%`,
                top: `${verticalPosition}vh`,
                opacity: 0.9,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 5 + index % 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <img 
                src={tool.logo} 
                alt={`${tool.name} logo`}
                className="h-10 w-10 object-contain"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Right side icons */}
      <div className="absolute right-0 top-0 h-full w-1/3 lg:block">
        {rightTools.map((tool, index) => {
          // Calculate vertical spacing
          const verticalPosition = (index / rightTools.length) * 100;
          // Fixed horizontal position between 10% and 25%
          const horizontalPosition = 10 + (index % 4) * 20;
          
          return (
            <motion.div
              key={`right-icon-${index}`}
              className="absolute"
              initial={{
                right: `${horizontalPosition}%`,
                top: `${verticalPosition}vh`,
                opacity: 0.9,
              }}
              animate={{
                y: [0, 15, 0],
                x: [0, -10, 0],
              }}
              transition={{
                duration: 5 + index % 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <img 
                src={tool.logo} 
                alt={`${tool.name} logo`}
                className="h-10 w-10 object-contain"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
