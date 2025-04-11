import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-rows-3", className)}>{children}</div>
}

export const BentoCard = ({
  className,
  Icon,
  name,
  description,
  background,
  cta,
  href,
}: {
  className?: string
  Icon?: React.ElementType
  name: string
  description: string
  background?: React.ReactNode
  cta?: string
  href?: string
}) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all duration-200 hover:shadow-xl",
        className,
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4">{Icon && <Icon className="h-8 w-8 text-emerald-400" />}</div>
        <div className="mt-auto">
          <div className="mb-2 font-bold text-xl text-white">{name}</div>
          <p className="text-sm text-slate-300">{description}</p>
          {cta && href && (
            <div className="mt-4">
              <Link
                href={href}
                className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
              >
                {cta}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0">{background}</div>
    </div>
  )
}

export const BentoGridItem = BentoCard
