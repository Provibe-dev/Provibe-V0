"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Layers, Zap, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  const [activeWord, setActiveWord] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev === 0 ? 1 : 0))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-primary text-primary">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="h-full w-full bg-binary-pattern opacity-5"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="mb-6 animate-pulse border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600"
          >
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
            Transform ideas into products with AI
          </Badge>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <div className="flex items-center justify-center overflow-hidden">
              <div className="relative h-[1.2em] w-[5em] overflow-hidden">
                {["Dream It", "Build It"].map((word, index) => (
                  <motion.span
                    key={index}
                    className="absolute left-0 right-0 text-center gradient-text"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: activeWord === index ? 1 : 0,
                      y: activeWord === index ? 0 : -50,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-secondary">
            ProVibe transforms your ideas into comprehensive product documentation using AI. Get detailed requirements,
            architecture diagrams, user flows, and implementation plans in minutes.
          </p>

          <div className="mb-12 w-full max-w-4xl overflow-hidden">
            <div className="relative flex w-full overflow-x-hidden">
              <div className="animate-marquee flex whitespace-nowrap">
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
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-white transition-all duration-300 hover:bg-slate-800 hover:text-emerald-400"
              asChild
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  )
}