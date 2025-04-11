"use client"

import React, { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OrbitingCirclesProps {
  children: React.ReactNode[]
  radius?: number
  speed?: number
  reverse?: boolean
  iconSize?: number
  className?: string
}

export function OrbitingCircles({
  children,
  radius = 150,
  speed = 0.5,
  reverse = false,
  iconSize = 40,
  className,
}: OrbitingCirclesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const numItems = React.Children.count(children)
    if (numItems === 0) return

    const angleStep = (2 * Math.PI) / numItems

    const animate = () => {
      const time = (Date.now() / 1000) * speed

      itemsRef.current.forEach((item, index) => {
        if (!item) return

        const angle = angleStep * index + (reverse ? -time : time)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        item.style.transform = `translate(${x}px, ${y}px)`
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [children, radius, speed, reverse])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {React.Children.map(children, (child, index) => (
          <div
            ref={(el) => (itemsRef.current[index] = el)}
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800/50 p-1 backdrop-blur-sm ring-1 ring-white/10 shadow-lg text-white">
              {child}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
