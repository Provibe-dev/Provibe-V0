"use client"

import { FileText, Bell, Share2, Calendar, Code } from "lucide-react"

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

const features = [
  {
    Icon: FileText,
    name: "Instant Product Blueprints",
    description:
      "Turn your raw idea into complete PRDs, user flows, and technical specs—without writing a single document.",
    href: "#",
    cta: "See how it works",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-emerald-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Code,
    name: "AI That Thinks Like a PM",
    description:
      "Provibe's AI doesn't just generate text—it structures your vision like a product manager would.",
    href: "#",
    cta: "Explore the tech",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-cyan-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Share2,
    name: "Made for No-Code Tools",
    description:
      "Send your Provibe-generated docs into Bubble, Glide, or Canva’s AI builder for smarter outputs.",
    href: "#",
    cta: "View integrations",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Calendar,
    name: "Build Timeline & Steps",
    description:
      "Get a step-by-step plan of how to go from idea to launch—including what to build, when.",
    href: "#",
    cta: "See a sample plan",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-blue-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "Insightful Nudges",
    description:
      "Get smart reminders, refinement suggestions, and AI prompts to help you build faster and sharper.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-pink-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
]


export default function FeaturesSection() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}
