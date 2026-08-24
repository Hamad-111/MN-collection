'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import ProductCube from './3d-product-cube'
import { Sparkles, ArrowRight, ShieldCheck, Truck, Banknote } from 'lucide-react'

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  } as const

  return (
    <div
      ref={containerRef}
      className="relative min-h-[92vh] w-full overflow-hidden bg-gradient-to-br from-[#fcfaf6] via-[#f7f2e8] to-[#fbf9f4] flex items-center pt-20 pb-16 font-sans text-stone-900"
    >
      {/* Dynamic Animated Ambient Light Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(217,119,6,0.25) 0%, rgba(251,191,36,0.08) 60%, rgba(255,255,255,0) 100%)',
          }}
          animate={{
            x: mousePosition.x * 60 - 250,
            y: mousePosition.y * 60 - 250,
          }}
          transition={{ type: 'spring', damping: 40, mass: 1 }}
        />
        <motion.div
          className="absolute right-10 bottom-10 w-[600px] h-[600px] rounded-full filter blur-[140px] opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(180,83,9,0.2) 0%, rgba(245,158,11,0.05) 70%, rgba(255,255,255,0) 100%)',
          }}
          animate={{
            x: -mousePosition.x * 40 + 200,
            y: -mousePosition.y * 40 + 200,
          }}
          transition={{ type: 'spring', damping: 40, mass: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & CTAs */}
          <motion.div
            className="text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Royal Oriental Collection
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300/60">
                <Banknote className="w-3.5 h-3.5 text-emerald-700" /> Cash on Delivery Available
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-[1.1] tracking-tight text-stone-900"
            >
              Exquisite Couture <br />
              <span className="gold-gradient-text">Royal Elegance</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-stone-700 max-w-lg leading-relaxed font-normal"
            >
              Handcrafted oriental abayas, formal tailoring, and luxury accessories. Designed for discerning clients seeking timeless sophistication and flawless detail.
            </motion.p>

            {/* Feature Highlights Badges */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200 backdrop-blur-md text-center shadow-xs">
                <span className="block text-amber-800 font-serif font-bold text-base sm:text-lg">100%</span>
                <span className="text-[10px] text-stone-600 uppercase font-bold">Pure Silk & Velvet</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200 backdrop-blur-md text-center shadow-xs">
                <span className="block text-amber-800 font-serif font-bold text-base sm:text-lg">Free</span>
                <span className="text-[10px] text-stone-600 uppercase font-bold">Courier Express</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200 backdrop-blur-md text-center shadow-xs">
                <span className="block text-emerald-700 font-serif font-bold text-base sm:text-lg">COD</span>
                <span className="text-[10px] text-stone-600 uppercase font-bold">Pay at Doorstep</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                onClick={() => {
                  const el = document.getElementById('shop')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white font-bold rounded-xl gold-glow hover:brightness-105 transition-all font-sans uppercase tracking-widest text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                Explore Luxury Shop <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => {
                  const el = document.getElementById('men-collection')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 border border-stone-300 bg-white/90 hover:bg-stone-50 text-stone-800 font-bold rounded-xl transition-all font-sans uppercase tracking-widest text-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                Men's Collection
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            className="w-full flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />
            <ProductCube />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
