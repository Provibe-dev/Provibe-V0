"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Layers, Zap, GitBranch, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AnimatedSection } from "@/components/animated-section"
// Removed BackgroundBeams import
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo"
import HowItWorksCards from "@/components/how-it-works-cards"
import FeaturesBentoDemo from "@/components/features-bento-demo"
import { ToolsMarqueeDemo } from "@/components/tools-marquee-demo"

// Removed particles array

export default function Home() {
  const [activeTab, setActiveTab] = useState("requirements")
  const [activeWord, setActiveWord] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev === 0 ? 1 : 0))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-primary text-primary">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern"></div>
          <div className="h-full w-full bg-binary-pattern opacity-5"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="outline"
              className="mb-6 animate-pulse border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600"
            >
              <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
              Transform ideas into products with AI
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <div className="flex items-center justify-center overflow-hidden">
                <div className="relative h-[1.2em] w-[5em] overflow-hidden">
                  {["Dream It", "Build It"].map((word, index) => (
                    <motion.span
                      key={index}
                      className="absolute left-0 right-0 text-center gradient-text"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{
                        opacity: activeWord === index ? 1 : 0,
                        y: activeWord === index ? 0 : -50,
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            </h1>

            <p className="mb-8 max-w-2xl animate-fade-in-up animation-delay-300 text-lg text-secondary sm:text-xl">
              ProVibe transforms your ideas into detailed product documentation for AI agents to build faster for you
            </p>

            {/* Document Type Carousel */}
            <div className="w-full mx-auto mb-8 animate-fade-in-up animation-delay-450 overflow-hidden">
              <div className="document-carousel-container relative w-full overflow-hidden">
                <div className="document-carousel-track flex py-2 whitespace-nowrap">
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                    Product Requirement Document
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <Layers className="mr-2 h-4 w-4 text-emerald-500" />
                    Architecture
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <GitBranch className="mr-2 h-4 w-4 text-emerald-500" />
                    User Flow
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <Zap className="mr-2 h-4 w-4 text-emerald-500" />
                    Implementation Plan
                  </Button>

                  {/* Duplicate buttons for continuous scrolling effect */}
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                    Product Requirement Document
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <Layers className="mr-2 h-4 w-4 text-emerald-500" />
                    Architecture
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <GitBranch className="mr-2 h-4 w-4 text-emerald-500" />
                    User Flow
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <Zap className="mr-2 h-4 w-4 text-emerald-500" />
                    Implementation Plan
                  </Button>

                  {/* Add more duplicates to ensure continuous scrolling */}
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                    Product Requirement Document
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <Layers className="mr-2 h-4 w-4 text-emerald-500" />
                    Architecture
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <GitBranch className="mr-2 h-4 w-4 text-emerald-500" />
                    User Flow
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2 border-slate-200 bg-slate-50/80 text-slate-800 hover:bg-slate-100 hover:text-emerald-600 backdrop-blur-sm"
                  >
                    <Zap className="mr-2 h-4 w-4 text-emerald-500" />
                    Implementation Plan
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex animate-fade-in-up animation-delay-450 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600"
                asChild
              >
                <Link href="/auth/register">
                  <span className="relative z-10 flex items-center">
                    Get Started{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-emerald-600 to-cyan-600 transition-transform duration-300 group-hover:translate-y-0"></span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-white transition-all duration-300 hover:bg-slate-800 hover:text-emerald-400"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <AnimatedSection id="features" className="bg-secondary py-20" >
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
      <AnimatedSection id="how-it-works" className="bg-primary py-20" >
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
      <AnimatedSection id="example" className="bg-secondary py-20" delay={0.2} >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">See ProVibe in Action</h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              Explore the comprehensive documentation ProVibe generates
            </p>
          </div>

          <Tabs
            defaultValue="requirements"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mx-auto max-w-4xl"
          >
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger
                value="requirements"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
              >
                Requirements
              </TabsTrigger>
              <TabsTrigger
                value="architecture"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
              >
                Architecture
              </TabsTrigger>
              <TabsTrigger
                value="userflow"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
              >
                User Flow
              </TabsTrigger>
            </TabsList>
            <TabsContent value="requirements" className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
              <h3 className="mb-4 text-xl font-bold text-white">Product Requirements Document</h3>
              <div className="space-y-4 text-slate-300">
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">1. Product Overview</h4>
                  <p>
                    A mobile application that allows users to track their daily water intake, set hydration goals, and
                    receive reminders.
                  </p>
                </div>
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">2. User Stories</h4>
                  <ul className="ml-4 list-disc space-y-2">
                    <li>As a user, I want to log my water intake throughout the day</li>
                    <li>As a user, I want to set daily hydration goals based on my body weight</li>
                    <li>As a user, I want to receive reminders to drink water</li>
                  </ul>
                </div>
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">3. Features</h4>
                  <ul className="ml-4 list-disc space-y-2">
                    <li>Water intake tracking with different container sizes</li>
                    <li>Customizable daily goals</li>
                    <li>Reminder notifications</li>
                    <li>Progress visualization</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="architecture" className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
              <h3 className="mb-4 text-xl font-bold text-white">System Architecture</h3>
              <div className="space-y-4 text-slate-300">
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">Frontend Components</h4>
                  <ul className="ml-4 list-disc space-y-2">
                    <li>Dashboard Screen: Displays daily progress and quick add buttons</li>
                    <li>History Screen: Shows past water intake data with charts</li>
                    <li>Settings Screen: Allows customization of goals and reminders</li>
                  </ul>
                </div>
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">Backend Services</h4>
                  <ul className="ml-4 list-disc space-y-2">
                    <li>User Authentication Service</li>
                    <li>Water Intake Tracking Service</li>
                    <li>Notification Service</li>
                    <li>Analytics Service</li>
                  </ul>
                </div>
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">Data Model</h4>
                  <p>User, WaterIntake, Goal, and Reminder entities with relationships</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="userflow" className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-6">
              <h3 className="mb-4 text-xl font-bold text-white">User Flow Diagram</h3>
              <div className="space-y-4 text-slate-300">
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">Onboarding Flow</h4>
                  <p>App Launch → Welcome Screen → User Registration → Initial Setup (Weight, Goal) → Dashboard</p>
                </div>
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">Daily Usage Flow</h4>
                  <p>App Launch → Dashboard → Add Water Intake → View Updated Progress → Receive Reminders</p>
                </div>
                <div className="rounded-md bg-slate-900 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-400">Settings Flow</h4>
                  <p>Dashboard → Settings → Update Goals/Reminders → Save Changes → Return to Dashboard</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedSection>

      {/* Tools Section */}
      <AnimatedSection id="tools" className="bg-primary py-20" delay={0.2} >
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

      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="bg-secondary py-20" delay={0.2} >
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

      {/* Pricing Section */}
      <AnimatedSection id="pricing" className="bg-primary py-20" delay={0.2} >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              Choose the plan that's right for you and your team
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="relative overflow-hidden rounded-lg bg-[#0c1116] bg-[radial-gradient(at_88%_40%,#0c1116_0px,transparent_85%),radial-gradient(at_49%_30%,#0c1116_0px,transparent_85%),radial-gradient(at_14%_26%,#0c1116_0px,transparent_85%),radial-gradient(at_0%_64%,#05606e_0px,transparent_85%),radial-gradient(at_41%_94%,#06889b_0px,transparent_85%),radial-gradient(at_100%_99%,#034952_0px,transparent_85%)] p-4 shadow-[0px_-16px_24px_0px_rgba(255,255,255,0.25)_inset]">
              <div className="absolute -z-10 left-1/2 top-1/2 h-[calc(100%+2px)] w-[calc(100%+2px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-gradient-to-b from-white/50 via-white/40 to-white/10">
                <div className="fixed left-1/2 top-1/2 h-10 w-[200%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-[spin_8s_linear_infinite]"></div>
              </div>

              <div className="mb-6">
                <span className="text-xl font-bold text-white">Free</span>
                <p className="mt-1 text-sm text-gray-400 w-2/3">Perfect for trying out ProVibe and small projects.</p>
              </div>

              <hr className="border-slate-700 my-4" />

              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="ml-1 text-xl text-slate-400">/forever</span>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">3 Starter Kits</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">1,000 Monthly Credits</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Create Basic PRDs</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Access to Community</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Complete 3 Projects per Month</span>
                </li>
              </ul>

              <button className="mt-8 w-full rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 py-2 text-sm text-white shadow-[inset_0_-2px_25px_-4px_white]">
                Get Started Free
              </button>
            </div>

            {/* Monthly Plan */}
            <div className="relative overflow-hidden rounded-lg bg-[#0c1116] bg-[radial-gradient(at_88%_40%,#0c1116_0px,transparent_85%),radial-gradient(at_49%_30%,#0c1116_0px,transparent_85%),radial-gradient(at_14%_26%,#0c1116_0px,transparent_85%),radial-gradient(at_0%_64%,#05606e_0px,transparent_85%),radial-gradient(at_41%_94%,#06889b_0px,transparent_85%),radial-gradient(at_100%_99%,#034952_0px,transparent_85%)] p-4 shadow-[0px_-16px_24px_0px_rgba(255,255,255,0.25)_inset]">
              <div className="absolute -z-10 left-1/2 top-1/2 h-[calc(100%+2px)] w-[calc(100%+2px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-gradient-to-b from-white/50 via-white/40 to-white/10">
                <div className="fixed left-1/2 top-1/2 h-10 w-[200%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-[spin_8s_linear_infinite]"></div>
              </div>

              <div className="mb-6">
                <span className="text-xl font-bold text-white">Monthly</span>
                <p className="mt-1 text-sm text-gray-400 w-2/3">Pay monthly with no long-term commitment.</p>
              </div>

              <hr className="border-slate-700 my-4" />

              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$29</span>
                <span className="ml-1 text-xl text-slate-400">/month</span>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Codie - AI Coding Assistant</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">5+ Starter Kits</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Access to Deep Research</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Complete 15 Projects per Month</span>
                </li>
              </ul>

              <button className="mt-8 w-full rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 py-2 text-sm text-white shadow-[inset_0_-2px_25px_-4px_white]">
                Get The Monthly Plan
              </button>
            </div>

            {/* Yearly Plan */}
            <div className="relative overflow-hidden rounded-lg bg-[#0c1116] bg-[radial-gradient(at_88%_40%,#0c1116_0px,transparent_85%),radial-gradient(at_49%_30%,#0c1116_0px,transparent_85%),radial-gradient(at_14%_26%,#0c1116_0px,transparent_85%),radial-gradient(at_0%_64%,#05606e_0px,transparent_85%),radial-gradient(at_41%_94%,#06889b_0px,transparent_85%),radial-gradient(at_100%_99%,#034952_0px,transparent_85%)] p-4 shadow-[0px_-16px_24px_0px_rgba(255,255,255,0.25)_inset]">
              <div className="absolute -right-1 -top-1 z-10 rounded-bl-lg rounded-tr-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                Best Value
              </div>
              <div className="absolute -right-5 -top-5 z-10 rotate-45 bg-emerald-500 px-10 py-1 text-xs font-semibold text-white">
                40% OFF
              </div>

              <div className="absolute -z-10 left-1/2 top-1/2 h-[calc(100%+2px)] w-[calc(100%+2px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-gradient-to-b from-white/50 via-white/40 to-white/10">
                <div className="fixed left-1/2 top-1/2 h-10 w-[200%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-[spin_8s_linear_infinite]"></div>
              </div>

              <div className="mb-6">
                <span className="text-xl font-bold text-white">Yearly</span>
                <p className="mt-1 text-sm text-gray-400 w-2/3">Our best value plan with maximum savings.</p>
              </div>

              <hr className="border-slate-700 my-4" />

              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">$199</span>
                <span className="ml-2 text-2xl text-slate-400 line-through">$348</span>
                <span className="ml-1 text-xl text-slate-400">/year</span>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Everything in Monthly plan</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">30-minute one-on-one call</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">6,000 Monthly Credits</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400">
                    <svg className="h-3 w-3 fill-slate-900" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm text-white">Early Access to New Features</span>
                </li>
              </ul>

              <button className="mt-8 w-full rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 py-2 text-sm text-white shadow-[inset_0_-2px_25px_-4px_white]">
                Get The Yearly Plan
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection id="cta" className="bg-secondary py-20" delay={0.2} >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary sm:text-4xl">
              Ready to transform your ideas into reality?
            </h2>
            <p className="mb-8 text-lg text-secondary">
              Join thousands of developers, founders, and product managers who are building faster with ProVibe.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="gradient-bg text-white">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Demo
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
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors hover:text-emerald-400">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-6 border-slate-800" />
          <div className="flex flex-col items-center justify-between text-sm md:flex-row">
            <p className="mb-4 md:mb-0">© {new Date().getFullYear()} ProVibe. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="transition-colors hover:text-emerald-400">
                Terms of Service
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-emerald-400">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
