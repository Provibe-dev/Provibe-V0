"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Github, Slack, Twitter } from "lucide-react"

import { cn } from "@/lib/utils"

const integrations = [
  {
    name: "GitHub",
    icon: Github,
    color: "bg-slate-800",
  },
  {
    name: "Slack",
    icon: Slack,
    color: "bg-green-600",
  },
  {
    name: "Twitter",
    icon: Twitter,
    color: "bg-blue-500",
  },
]

export default function AnimatedBeamMultipleOutputDemo({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % integrations.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-4", className)}>
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white">Integrations</h3>
        <p className="text-sm text-slate-300">Connect ProVibe with your favorite tools</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-emerald-400 to-cyan-400" />

        <div className="space-y-8">
          <div className="relative">
            <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-emerald-400" />
            <div className="ml-8 rounded-lg border border-slate-700 bg-slate-900 p-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-emerald-400/20 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs font-bold">AI</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">ProVibe</p>
                  <p className="text-xs text-slate-400">Generating integrations...</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cyan-400" />
            <div className="ml-8 rounded-lg border border-slate-700 bg-slate-900 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-md flex items-center justify-center",
                      integrations[activeIndex]?.color,
                    )}
                  >
                    {(() => {
                      const IconComponent = integrations[activeIndex]?.icon
                      return IconComponent ? <IconComponent className="h-4 w-4 text-white" /> : null
                    })()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{integrations[activeIndex].name}</p>
                    <p className="text-xs text-slate-400">Connected successfully</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
