'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { useEffect, useState } from 'react'

interface Stat {
  label: string
  value: number
  suffix: string
  icon: string
}

const stats: Stat[] = [
  { label: 'Satisfied Boutique Clients', value: 50000, suffix: '+', icon: '👥' },
  { label: 'Exquisite Designs', value: 1200, suffix: '+', icon: '👗' },
  { label: 'Years of Haute Couture', value: 12, suffix: '+', icon: '👑' },
  { label: 'Global Cities Served', value: 45, suffix: '+', icon: '🌍' },
]

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start: number
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = (timestamp - start) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(target * progress))
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function StatsSection() {
  const { ref, isInView } = useScrollAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fbf9f5] border-t border-stone-200 font-sans text-stone-900 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300">
            ✨ Boutique Distinction
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-serif gold-gradient-text">
            Our Achievements
          </h2>
          <p className="text-stone-600 text-base max-w-lg mx-auto font-normal">
            Crafting royal elegance and delivering satisfaction across the globe
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 text-center space-y-3 shadow-xs"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-serif gold-gradient-text">
                {isInView ? <AnimatedCounter target={stat.value} /> : '0'}
                <span>{stat.suffix}</span>
              </div>
              <p className="text-stone-600 text-xs uppercase tracking-wider font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
