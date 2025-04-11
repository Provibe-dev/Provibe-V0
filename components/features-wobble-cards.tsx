"use client"
import { WobbleCard } from "@/components/ui/wobble-card"
import { FileText, Layers, GitBranch } from "lucide-react"

export default function FeaturesWobbleCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
      <WobbleCard containerClassName="col-span-1 min-h-[400px] bg-cyan-900">
        <div className="flex flex-col h-full">
          <div className="mb-6 text-cyan-400">
            <FileText size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Comprehensive PRDs</h3>
          <p className="text-slate-300">
            Generate detailed product requirement documents that outline features, user stories, and acceptance criteria
            for your product idea.
          </p>
        </div>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[400px] bg-cyan-900">
        <div className="flex flex-col h-full">
          <div className="mb-6 text-cyan-400">
            <Layers size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">System Architecture</h3>
          <p className="text-slate-300">
            Get detailed architecture diagrams and component breakdowns that help you understand how to structure your
            application.
          </p>
        </div>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[400px] bg-cyan-900">
        <div className="flex flex-col h-full">
          <div className="mb-6 text-cyan-400">
            <GitBranch size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">User Flows</h3>
          <p className="text-slate-300">
            Visualize how users will interact with your product through comprehensive user flow diagrams and journey
            maps.
          </p>
        </div>
      </WobbleCard>
    </div>
  )
}
