"use client"

import { useState } from "react"
import { HeroSection } from "@/components/marketing/HeroSection"
import { ExampleOutputSection } from "@/components/marketing/ExampleOutputSection"
import { AnimatedSection } from "@/components/animated-section"
import { PricingSection } from "@/components/marketing/PricingSection"
import { StickyScrollRevealDemo } from "@/components/marketing/StickyScrollRevealDemo"
import { ToolsLogo } from "@/components/marketing/ToolsLogo"
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo"
import HowItWorksCards from "@/components/how-it-works-cards"
import FeaturesBentoDemo from "@/components/features-bento-demo"
import FeaturesSection from "@/components/marketing/FeaturesSection"
import { ToolsMarqueeDemo } from "@/components/tools-marquee-demo"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import WhyProVibeSection from "@/components/marketing/WhyProVibeSection"

export default function Home() {
  const [activeTab, setActiveTab] = useState("requirements")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Why ProVibe Section */}
       <WhyProVibeSection /> 

      {/* How It Works Section */}
      <AnimatedSection id="how-it-works" className="bg-primary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="How ProVibe Works"
            subtitle="A simple process to transform your ideas into comprehensive documentation"
          />
          <HowItWorksCards />
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" className="bg-secondary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Everything you need to build your next big idea"
            subtitle="ProVibe generates comprehensive documentation and plans that you can use to build your product or feed to AI agents and no-code platforms."
          />
          <FeaturesSection />
        </div>
      </AnimatedSection>

      

        {/* Example Output Section */}
        {/* <ExampleOutputSection /> */}

      {/* Tools Section */}
      <AnimatedSection id="tools" className="bg-primary py-12" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Compatible Tools"
            subtitle="ProVibe integrates with your favorite development tools"
          />
          <ToolsLogo />
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection id="pricing" className="bg-primary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PricingSection />
        </div>
      </AnimatedSection>

      {/* Sticky Scroll Section */}
      {/* <AnimatedSection id="features-detail" className="bg-primary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StickyScrollRevealDemo />
        </div>
      </AnimatedSection> 
      */}

      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="bg-secondary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="What Our Users Say"
            subtitle="Hear from developers, founders, and product managers who use ProVibe"
          />

          <InfiniteMovingCardsDemo />
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      {/*
      <AnimatedSection id="cta" className="bg-secondary py-20" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-section-title font-heading text-primary">
              Ready to transform your ideas into reality?
            </h2>
            <p className="mb-8 text-body-lg text-secondary">
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
      */}

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">ProVibe</span>
              </div>
              <p className="mt-2 text-body">Transform ideas into products with AI</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Product</h3>
                <ul className="space-y-2 text-body">
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
