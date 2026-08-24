'use client'

import { useStore } from './store-provider'
import ProductCard from './product-card'
import { motion } from 'framer-motion'
import { Sparkles, Shirt, ShieldCheck, ArrowRight } from 'lucide-react'

export default function MenCollection() {
  const { products } = useStore()

  // Filter for products that belong to Men Collection
  const menProducts = products.filter(
    (p) =>
      p.category === 'Men Collection' ||
      p.badge === 'Men Collection' ||
      p.id === 301 ||
      p.id === 302 ||
      p.name.toLowerCase().includes('mandarin') ||
      p.name.toLowerCase().includes('suit')
  )

  return (
    <section
      id="men-collection"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f6f2ec] border-t border-stone-200 scroll-mt-24 font-sans text-stone-900 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Exclusive Men's Line
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif gold-gradient-text tracking-tight">
            Men's Royal Collection
          </h2>
          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Handcrafted Oriental Mandarin Collar Suits, Silk Tunics & Tailored Formal Ensembles
          </p>
        </div>

        {/* Featured Spotlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 relative overflow-hidden rounded-3xl bg-white border border-stone-200 shadow-xl p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                <img
                  src="/images/bamboo-silk-set-men.jpg"
                  alt="Bamboo Print Mandarin Silk Set Showcase"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-700 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Lookbook Showcase
                </span>
              </div>
              <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-stone-200 hidden sm:block">
                <img
                  src="/images/bamboo-silk-shirt-men.jpg"
                  alt="Bamboo Print Mandarin Silk Shirt"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-amber-900 border border-stone-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Single Tunic Shirt
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
              <div className="inline-flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-widest">
                <Shirt className="w-4 h-4 text-amber-700" /> Signature Release
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                Bamboo Print Mandarin Silk Ensemble
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-normal">
                Elevate your look with our signature oriental bamboo ink print tunic set in soft lavender grey. Crafted with breathable silk-linen fabric, featuring band collar details and dark slate tailored trousers.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200">
                  <ShieldCheck className="w-4 h-4 text-amber-700" /> Premium Silk-Linen Blend
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200">
                  ✨ Handcrafted Mandarin Collar
                </div>
              </div>
              <div className="pt-3">
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                >
                  Explore All Suits <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              badge={product.badge || 'Men Collection'}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
