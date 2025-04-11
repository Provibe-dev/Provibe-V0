"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const Marquee = ({
  className,
  reverse,
  pauseOnHover = false,
  children,
  ...props
}: {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    addAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (reverse) {
        containerRef.current.style.setProperty("--animation-direction", "forwards")
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse")
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 flex w-full overflow-hidden [--duration:40s] [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]",
        className,
        start && "animate-scroll",
        pauseOnHover && "hover:[animation-play-state:paused]",
      )}
      {...props}
    >
      <div
        ref={scrollerRef}
        className={cn("flex shrink-0 items-center justify-around gap-[--gap] min-w-full", start && "animate-scroll")}
        style={{
          animationDirection: "var(--animation-direction)",
          animationDuration: "var(--duration)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
