"use client"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" className="py-8" />
    </div>
  )
}

const testimonials = [
  {
    quote: "ProVibe cut our product documentation time by 80%. What used to take days now takes minutes.",
    name: "Sarah J.",
    title: "Product Manager",
  },
  {
    quote: "The architecture documents ProVibe generates are incredibly detailed and saved me hours of planning.",
    name: "Michael T.",
    title: "Senior Developer",
  },
  {
    quote: "I used ProVibe to document my startup idea and secured funding within weeks. Game changer!",
    name: "Alex R.",
    title: "Founder",
  },
  {
    quote:
      "ProVibe's AI-generated documentation is so comprehensive that our development team was able to start building immediately.",
    name: "Jessica L.",
    title: "CTO",
  },
  {
    quote: "The user flow diagrams ProVibe created helped us identify UX issues before we even started coding.",
    name: "David K.",
    title: "UX Designer",
  },
  {
    quote: "As a solo developer, ProVibe feels like having a product team in my pocket. Incredible tool!",
    name: "Ryan M.",
    title: "Indie Developer",
  },
  {
    quote:
      "We've integrated ProVibe into our workflow and it's become an essential part of our product development process.",
    name: "Emma S.",
    title: "Product Owner",
  },
]
