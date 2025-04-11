"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

export const AnimatedSection = ({ children, id, className, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id={id} ref={ref} className={className}>
      <div
        style={{
          transform: isInView ? "none" : "translateY(50px)",
          opacity: isInView ? 1 : 0,
          transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
        }}
      >
        {children}
      </div>
    </section>
  )
}
