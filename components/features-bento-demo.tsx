"use client"

import { FileText, Bell, Share2, Calendar, Code } from "lucide-react"

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

const features = [
  {
    Icon: FileText,
    name: "Comprehensive Documentation",
    description: "Generate detailed product requirements, architecture diagrams, and implementation plans.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-emerald-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Code,
    name: "AI-Powered Generation",
    description: "Our AI analyzes your idea and generates comprehensive documentation in minutes.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-cyan-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Share2,
    name: "Integrations",
    description: "Connect with your favorite development tools and AI agents for seamless workflow.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Calendar,
    name: "Project Timeline",
    description: "Visualize your project timeline and track progress with our interactive calendar.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-blue-500 blur-3xl"></div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "Smart Notifications",
    description: "Get notified about project updates, AI-generated insights, and collaboration opportunities.",
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

export default function FeaturesBentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}
