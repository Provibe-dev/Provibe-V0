"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedSection } from "@/components/animated-section"

export function ExampleOutputSection() {
  const [activeTab, setActiveTab] = useState("requirements")

  return (
    <AnimatedSection id="example" className="bg-secondary py-20" delay={0.2}>
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
  )
}