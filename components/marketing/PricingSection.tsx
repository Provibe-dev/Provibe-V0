import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/animated-section"

export function PricingSection() {
  return (
    <AnimatedSection id="pricing" className="bg-primary py-20" delay={0.2}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mx-auto max-w-2xl text-lg text-secondary">
            Choose the plan that's right for you and start building your next big idea
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-bold text-white">Free</h3>
              <p className="text-slate-400">Perfect for trying out ProVibe</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
            </div>
            <ul className="mb-6 space-y-3">
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                <span className="text-slate-300">3 projects</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                <span className="text-slate-300">Basic documentation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                <span className="text-slate-300">Community support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-lg border border-emerald-500 bg-slate-800 p-6 shadow-lg shadow-emerald-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-1 text-xs font-bold text-white">
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-bold text-white">Pro</h3>
              <p className="text-slate-400">For serious product builders</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">$19</span>
                <span className="text-slate-400">/month</span>
              </div>
            </div>
            <ul className="mb-6 space-y-3">
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                <span className="text-slate-300">Unlimited projects</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                <span className="text-slate-300">Advanced documentation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                <span className="text-slate-300">Priority support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
