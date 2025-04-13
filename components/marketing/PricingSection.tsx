import React from 'react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Check } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  return (
    <div className="w-full">
      <SectionHeader
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that's right for you"
      />
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Free Plan */}
        <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="text-muted-foreground mt-1">Perfect for trying out ProVibe</p>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>3 projects</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Basic documentation</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Community support</span>
            </li>
          </ul>
          
          <Button className="mt-auto" asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
        
        {/* Pro Plan */}
        <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm relative">
          <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
            Popular
          </div>
          
          <div className="mb-4">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-muted-foreground mt-1">For serious product builders</p>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold">$19</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Unlimited projects</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Advanced documentation</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Priority support</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Export to multiple formats</span>
            </li>
          </ul>
          
          <Button variant="default" className="mt-auto bg-emerald-500 hover:bg-emerald-600" asChild>
            <Link href="/auth/register?plan=pro">Get Started</Link>
          </Button>
        </div>
        
        {/* Enterprise Plan */}
        <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Enterprise</h3>
            <p className="text-muted-foreground mt-1">For teams and organizations</p>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold">Custom</span>
          </div>
          
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Everything in Pro</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Custom integrations</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Dedicated support</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Team collaboration</span>
            </li>
          </ul>
          
          <Button variant="outline" className="mt-auto" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
