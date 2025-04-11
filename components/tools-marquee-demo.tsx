"use client"

import { OrbitingCircles } from "@/registry/magicui/orbiting-circles"
import Image from "next/image"

export function ToolsMarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden py-8">
      <OrbitingCircles iconSize={50} radius={180}>
        <Image src="https://logo.clearbit.com/v0.dev" alt="v0" width={40} height={40} className="rounded-full" />
        <Image src="https://logo.clearbit.com/notion.so" alt="Notion" width={40} height={40} className="rounded-full" />
        <Image
          src="https://logo.clearbit.com/openai.com"
          alt="OpenAI"
          width={40}
          height={40}
          className="rounded-full"
        />
        <Image
          src="https://logo.clearbit.com/google.com"
          alt="Google Drive"
          width={40}
          height={40}
          className="rounded-full"
        />
        <Image
          src="https://logo.clearbit.com/github.com"
          alt="GitHub"
          width={40}
          height={40}
          className="rounded-full"
        />
      </OrbitingCircles>
      <OrbitingCircles iconSize={40} radius={100} reverse speed={2}>
        <Image src="https://logo.clearbit.com/figma.com" alt="Figma" width={30} height={30} className="rounded-full" />
        <Image
          src="https://logo.clearbit.com/vercel.com"
          alt="Vercel"
          width={30}
          height={30}
          className="rounded-full"
        />
        <Image
          src="https://logo.clearbit.com/nextjs.org"
          alt="Next.js"
          width={30}
          height={30}
          className="rounded-full"
        />
        <Image
          src="https://logo.clearbit.com/reactjs.org"
          alt="React"
          width={30}
          height={30}
          className="rounded-full"
        />
      </OrbitingCircles>
    </div>
  )
}
