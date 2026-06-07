'use client'

import { motion } from 'framer-motion'

export default function PromoBanner() {
  return (
    <section className="relative bg-gradient-to-r from-black via-yellow-900/40 to-black backdrop-blur-sm py-4 text-center border-b border-yellow-600/30 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{
          backgroundImage:
            'linear-gradient(45deg, #1f1f1f 0%, #ca8a04 50%, #b45309 100%)',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.p
          className="text-white/90 font-semibold text-sm sm:text-base"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎁 <span className="text-yellow-400">Free Shipping</span> on orders over $100 |{' '}
          <span className="text-yellow-300">
            Exclusive Offers
          </span>{' '}
          for Newsletter Members ✨
        </motion.p>
      </div>
    </section>
  )
}
