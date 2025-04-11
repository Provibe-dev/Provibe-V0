"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export const TestimonialCard = ({ quote, author, role, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <Card
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(50px)",
        opacity: isInView ? 1 : 0,
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
      }}
    >
      <CardContent>
        <div className="mb-4 italic text-slate-300">"{quote}"</div>
        <div className="font-semibold text-white">{author}</div>
        <div className="text-sm text-slate-400">{role}</div>
      </CardContent>
    </Card>
  )
}
