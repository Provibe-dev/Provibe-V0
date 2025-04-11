"use client"

import type React from "react"

import { FileText, Layers, GitBranch, Code, BarChart } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<FileText className="h-4 w-4 text-emerald-400 dark:text-emerald-400" />}
        title="Product Requirements"
        description="Generate detailed PRDs from your idea description with all the necessary specifications."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Layers className="h-4 w-4 text-emerald-400 dark:text-emerald-400" />}
        title="Architecture Documents"
        description="Get front-end and back-end architecture documents with component breakdowns and API specifications."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<GitBranch className="h-4 w-4 text-emerald-400 dark:text-emerald-400" />}
        title="User Flows"
        description="Visualize how users will interact with your product through detailed user flow diagrams."
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Code className="h-4 w-4 text-emerald-400 dark:text-emerald-400" />}
        title="Database Structure"
        description="Design your database schema with entity relationships and data models."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<BarChart className="h-4 w-4 text-emerald-400 dark:text-emerald-400" />}
        title="Implementation Plan"
        description="Get a step-by-step roadmap for building your product with timelines and milestones."
      />
    </ul>
  )
}

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2.5xl border border-slate-700 bg-slate-800 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 border-slate-700 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-slate-600 bg-slate-700/50 p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-white">
                {title}
              </h3>
              <h2
                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] 
              md:text-base/[1.375rem] text-slate-300"
              >
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
