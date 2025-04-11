"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bell, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const notifications = [
  {
    title: "New Project Created",
    description: "Your project 'Mobile App Redesign' has been created",
    time: "Just now",
    read: false,
  },
  {
    title: "Document Generated",
    description: "PRD for 'E-commerce Platform' is ready",
    time: "5 min ago",
    read: false,
  },
  {
    title: "Feedback Received",
    description: "John left feedback on your architecture document",
    time: "1 hour ago",
    read: true,
  },
  {
    title: "AI Analysis Complete",
    description: "AI has analyzed your project requirements",
    time: "2 hours ago",
    read: true,
  },
  {
    title: "Team Member Invited",
    description: "Sarah has accepted your invitation",
    time: "Yesterday",
    read: true,
  },
]

export default function AnimatedListDemo({ className }: { className?: string }) {
  const [items, setItems] = useState(notifications)

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) => {
        const newItems = [...prevItems]
        const firstItem = newItems.shift()
        if (firstItem) {
          newItems.push({ ...firstItem, time: "Just now", read: false })
        }
        return newItems
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        <Bell className="h-5 w-5 text-emerald-400" />
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={`${item.title}-${i}`}
            initial={{ opacity: i === items.length - 1 ? 0 : 1, height: i === items.length - 1 ? 0 : "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 rounded-md border border-slate-700 bg-slate-900 p-3"
          >
            <div className={cn("mt-1 h-2 w-2 rounded-full", item.read ? "bg-slate-500" : "bg-emerald-400")} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{item.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{item.time}</span>
                  {!item.read && (
                    <button className="rounded-full p-1 hover:bg-slate-800">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-300">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
