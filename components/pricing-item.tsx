import { Check } from "lucide-react"

export const PricingItem = ({ children }) => (
  <li className="flex items-center text-slate-300">
    <Check className="mr-2 h-4 w-4 text-emerald-400" />
    {children}
  </li>
)
