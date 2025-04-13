"use client";
import React from "react";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"; // Assuming this component exists

const provibeFeaturesContent = [
  {
    title: "Generate Core Product Docs Instantly with AI",
    description:
      "Stop wasting time on manual documentation. Provibe Lite uses AI to generate essential product documents like PRDs and user flows in minutes from your idea. [cite: 6, 7]",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
        {/* Replace with actual content showcasing AI document generation */}
        AI Document Generation Demo
      </div>
    ),
  },
  {
    title: "Effortless 5-Step Idea to Document Process",
    description:
      "Transform your ideas into structured documents with our simple 5-step wizard. From refining your concept to generating key documentation, Provibe Lite guides you through each stage. [cite: 17]",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-purple-500 text-white">
        {/* Replace with actual content demonstrating the 5-step wizard */}
        Project Creation Wizard Interface
      </div>
    ),
  },
  {
    title: "Manage Projects and Track Progress Easily",
    description:
      "Organize your documentation efforts with project management features. View key statistics on your dashboard and monitor the real-time generation status of your documents. [cite: 20, 30]",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-green-500 text-white">
        {/* Replace with actual content of project management and dashboard */}
        Project Management and Dashboard Overview
      </div>
    ),
  },
  {
    title: "Secure Account Access with Freemium Option",
    description:
      "Get started for free with secure account management powered by Supabase. Enjoy easy signup and login, and explore the power of AI documentation with our freemium model. [cite: 19, 38]",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-yellow-500 text-black">
        {/* Replace with actual content on account management and freemium access */}
        Secure Access and Tier Information
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={provibeFeaturesContent} />
    </div>
  );
}