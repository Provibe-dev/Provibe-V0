// FloatingIcons.tsx
"use client";
import React from "react";
import { 
  FcCommandLine, 
  FcDataBackup, 
  FcDatabase, 
  FcComboChart,
  FcElectronics, 
  FcMultipleDevices, 
  FcSettings, 
  FcServices,
  FcAddImage, 
  FcBinoculars, 
  FcBullish, 
  FcCalendar, 
  FcCollaboration, 
  FcDocument, 
  FcGlobe, 
  FcIdea, 
  FcMindMap, 
  FcSearch, 
  FcVideoCall
} from "react-icons/fc";
import { motion } from "framer-motion";

// Define arrays of icons we know exist
const leftIcons = [
  FcComboChart,
  FcCommandLine, 
  FcDataBackup, 
  FcDatabase, 
  FcElectronics, 
  FcMultipleDevices, 
  FcSettings, 
  FcServices
];

const rightIcons = [
  FcAddImage, 
  FcBinoculars, 
  FcBullish, 
  FcCalendar, 
  FcCollaboration, 
  FcDocument, 
  FcGlobe, 
  FcIdea, 
  FcMindMap, 
  FcSearch, 
  FcVideoCall
];

export function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Left side icons */}
      <div className="absolute left-0 top-0 h-full w-1/3 lg:block">
        {leftIcons.map((Icon, index) => {
          // Calculate vertical spacing
          const verticalPosition = (index / leftIcons.length) * 100;
          // Fixed horizontal position between 10% and 25%
          const horizontalPosition = 10 + (index % 3) * 5;
          
          return (
            <motion.div
              key={`left-icon-${index}`}
              className="absolute"
              style={{
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
              <Icon className="h-10 w-10" />
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
          const horizontalPosition = 10 + (index % 3) * 5;
          
          return (
            <motion.div
              key={`right-icon-${index}`}
              className="absolute"
              style={{
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
              <Icon className="h-10 w-10" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
