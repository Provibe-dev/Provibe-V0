"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Two lines of headline text
const headlineText = {
  line1: "Go from ideas",
  line2: "to blueprint"
}

export function TypewriterHeadline() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simple fade-in effect after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="block gradient-text-high-contrast"
          initial={{ y: 20 }}
          animate={{ y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {headlineText.line1}
        </motion.span>
        
        <motion.span
          className="block gradient-text-high-contrast"
          initial={{ y: 20 }}
          animate={{ y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {headlineText.line2}
        </motion.span>
      </motion.div>
    </h1>
  )
}
