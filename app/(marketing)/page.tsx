"use client"

import { useState } from "react"
import { HeroSection } from "@/components/marketing/HeroSection"
import { ExampleOutputSection } from "@/components/marketing/ExampleOutputSection"
import { AnimatedSection } from "@/components/animated-section"
import { PricingSection } from "@/components/marketing/PricingSection"
import { StickyScrollRevealDemo } from "@/components/marketing/StickyScrollRevealDemo"
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo"
import HowItWorksCards from "@/components/how-it-works-cards"
import FeaturesBentoDemo from "@/components/features-bento-demo"
import { ToolsMarqueeDemo } from "@/components/tools-marquee-demo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("requirements")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <AnimatedSection id="features" className="bg-secondary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">
              Everything you need to build your next big idea
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              ProVibe generates comprehensive documentation and plans that you can use to build your product or feed to
              AI agents and no-code platforms.
            </p>
          </div>

          <FeaturesBentoDemo />
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection id="how-it-works" className="bg-primary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">How ProVibe Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              A simple process to transform your ideas into comprehensive documentation
            </p>
          </div>

          <HowItWorksCards />
        </div>
      </AnimatedSection>

      {/* Example Output Section */}
      <ExampleOutputSection />

      {/* Tools Section */}
      <AnimatedSection id="tools" className="bg-primary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">Compatible with Your Favorite Tools</h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              ProVibe integrates seamlessly with the tools and platforms you already use
            </p>
          </div>

          <ToolsMarqueeDemo />
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection id="tools" className="bg-primary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
          </div>

          <PricingSection />
        </div>
      </AnimatedSection>

      {/* Sticky Scroll Section */}
      <AnimatedSection id="tools" className="bg-primary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
          </div>

          <StickyScrollRevealDemo />
        </div>
      </AnimatedSection>


      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="bg-secondary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              Hear from developers, founders, and product managers who use ProVibe
            </p>
          </div>

          <InfiniteMovingCardsDemo />
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection id="cta" className="bg-secondary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary sm:text-4xl">
              Ready to transform your ideas into reality?
            </h2>
            <p className="mb-8 text-lg text-secondary">
              Join thousands of developers, founders, and product managers who are building faster with ProVibe.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="gradient-bg text-white" asChild>
                <Link href="/auth/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Schedule a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">ProVibe</span>
                <span className="ml-1 text-xs text-emerald-400">BETA</span>
              </div>
              <p className="mt-2 text-sm">Transform ideas into products with AI</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#features" className="transition-colors hover:text-emerald-400">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#how-it-works" className="transition-colors hover:text-emerald-400">
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
