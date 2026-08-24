'use client'

import { motion } from 'framer-motion'
import { Sparkles, Truck, ShieldCheck, Banknote } from 'lucide-react'

export default function PromoBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#fef3c7] via-[#fef08a] to-[#fef3c7] border-b border-amber-200 py-2 px-4 text-center overflow-hidden font-sans z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-[11px] sm:text-xs font-semibold text-stone-800 tracking-wider">
        <span className="hidden md:flex items-center gap-1 text-amber-900 font-extrabold uppercase tracking-widest text-[10px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" /> EID ROYAL COLLECTION 2026 PAKISTAN
        </span>

        <span className="hidden md:inline text-amber-300">•</span>

        <span className="flex items-center gap-1.5 font-semibold text-stone-800">
          <Truck className="w-3.5 h-3.5 text-amber-700" /> Free Courier Express Delivery Nationwide Pakistan
        </span>

        <span className="text-amber-300">•</span>

        <span className="flex items-center gap-1.5 font-bold text-emerald-800">
          <Banknote className="w-3.5 h-3.5 text-emerald-600" /> 💵 Cash on Delivery (COD) Across Pakistan
        </span>
      </div>
    </div>
  )
}
