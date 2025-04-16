import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BentoGridProps {
  className?: string
  children: React.ReactNode
}

export function BentoGrid({
  className,
  children,
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:auto-rows-[28rem] md:grid-cols-3 lg:auto-rows-fr",
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  className?: string
  Icon?: React.ElementType
  name: string
  description: string
  href?: string
  cta?: string
  background?: React.ReactNode
}

export function BentoCard({
  className,
  Icon,
  name,
  description,
  href,
  cta,
  background,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {background}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {Icon && (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <h3 className="mb-2 font-semibold leading-none tracking-tight text-xl">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {href && cta && (
          <Link
            href={href}
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus:underline group-hover:underline"
          >
            {cta}
            <span className="sr-only">{name}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export const BentoGridItem = BentoCard
