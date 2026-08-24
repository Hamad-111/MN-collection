'use client'

import { motion } from 'framer-motion'
import { Award, Crown, Sparkles, Building2 } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#fcfaf6] text-stone-900 scroll-mt-28 border-t border-stone-200 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* TOP BRAND STORY & HERITAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image / Brand Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden bg-white border border-stone-200 p-8 shadow-md relative group"
          >
            <div className="absolute inset-3 border border-amber-300/40 pointer-events-none rounded-2xl" />
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center shadow-xs">
                <Crown className="w-12 h-12 text-amber-700" />
              </div>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-amber-900 font-serif">Luxury Couture Heritage</p>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">MN Collection Pakistan</h3>
              <p className="text-xs text-stone-600 font-medium max-w-sm mx-auto mt-3 leading-relaxed">
                Crafting timeless elegance, oriental silk garments, and festive couture for fashion connoisseurs nationwide.
              </p>
            </div>
          </motion.div>

          {/* Right Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 font-bold text-[11px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> About MN Collection
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-stone-900 leading-tight">
              Elegance in Every Stitch, Vision in Every Design
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              MN Collection was established to define high fashion in Pakistan, blending traditional oriental embroidery with contemporary silhouette cuts. From luxury bridal formals to everyday chic pret collections, we are committed to unmatched craftsmanship.
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif text-amber-900">10K+</div>
                <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mt-1">Happy Clients</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif text-amber-900">500+</div>
                <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mt-1">Couture Designs</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs text-center">
                <div className="text-2xl font-bold font-serif text-amber-900">100%</div>
                <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mt-1">Nationwide COD</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

