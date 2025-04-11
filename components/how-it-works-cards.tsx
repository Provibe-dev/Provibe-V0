"use client"
import { WobbleCard } from "@/components/ui/wobble-card"

export default function HowItWorksCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
      <WobbleCard containerClassName="col-span-1 min-h-[400px] bg-emerald-900">
        <div className="flex flex-col h-full justify-between">
          <div className="text-4xl font-bold text-emerald-400 mb-4">01</div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Share Your Idea</h3>
            <p className="text-slate-300">
              Describe your product idea in a few sentences or paragraphs. The more details you provide, the better the
              output.
            </p>
          </div>
        </div>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[400px] bg-emerald-900">
        <div className="flex flex-col h-full justify-between">
          <div className="text-4xl font-bold text-emerald-400 mb-4">02</div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">AI Generates Documentation</h3>
            <p className="text-slate-300">
              Our AI analyzes your idea and generates comprehensive documentation including requirements, architecture,
              and more.
            </p>
          </div>
        </div>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[400px] bg-emerald-900">
        <div className="flex flex-col h-full justify-between">
          <div className="text-4xl font-bold text-emerald-400 mb-4">03</div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Build or Integrate</h3>
            <p className="text-slate-300">
              Use the generated documentation to build your product yourself or feed it to AI agents and no-code
              platforms.
            </p>
          </div>
        </div>
      </WobbleCard>
    </div>
  )
}
