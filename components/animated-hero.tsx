'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import ProductCube from './3d-product-cube'

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
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  } as const

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background flex items-center pt-24"
    >
      {/* Animated background gradient mesh */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-secondary/15 to-primary/10 rounded-full filter blur-3xl opacity-40"
          animate={{
            x: mousePosition.x * 40 - 192,
            y: mousePosition.y * 40 - 192,
          }}
          transition={{ type: 'spring', damping: 50, mass: 1 }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-96 h-96 bg-gradient-to-r from-accent/25 to-secondary/10 rounded-full filter blur-3xl opacity-35"
          animate={{
            x: -mousePosition.x * 20 + 192,
            y: -mousePosition.y * 20 + 192,
          }}
          transition={{ type: 'spring', damping: 50, mass: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & CTA */}
          <motion.div
            className="text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-block"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-primary text-xs font-semibold tracking-widest uppercase font-sans">
                ✨ Premium Fashion Collection
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-foreground mb-6 leading-tight"
            >
              Royal Elegance
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl lg:text-3xl font-light text-primary mb-6 tracking-wide"
            >
              Timeless Style, Modern Design
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-foreground/80 mb-10 max-w-lg leading-relaxed"
            >
              Discover our exclusive collection of premium clothing and fashion pieces, crafted with elegance and sophistication for the modern you.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all font-sans uppercase tracking-wider text-xs"
              >
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-primary/25 text-foreground font-semibold rounded-lg hover:bg-secondary/10 transition-all font-sans uppercase tracking-wider text-xs"
              >
                Explore Collections
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            className="w-full flex items-center justify-center relative"
          >
            {/* Ambient gold rings around 3D canvas */}
            <div className="absolute inset-0 bg-radial-gradient from-secondary/5 to-transparent filter blur-2xl rounded-full" />
            <ProductCube />
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border-2 border-secondary/10 rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-24 h-24 border-2 border-primary/10 rounded-full pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
