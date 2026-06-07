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
  { label: 'Happy Customers', value: 50000, suffix: '+', icon: '👥' },
  { label: 'Products Designed', value: 1200, suffix: '+', icon: '👗' },
  { label: 'Years Experience', value: 8, suffix: '+', icon: '⭐' },
  { label: 'Countries Served', value: 45, suffix: '+', icon: '🌍' },
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

  return <span>{count}</span>
}

export default function StatsSection() {
  const { ref, isInView } = useScrollAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-background via-accent/5 to-background border-t border-b border-border/30"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-4">
            Our Achievements
          </h2>
          <p className="text-muted-foreground text-lg">
            Trusted by thousands of customers worldwide
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-card backdrop-blur-xl rounded-2xl p-8 border border-border/80 group-hover:border-secondary/40 group-hover:shadow-xl transition-all duration-500 text-center">
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-2">
                  {isInView && <AnimatedCounter target={stat.value} />}
                  {stat.suffix}
                </div>
                <p className="text-muted-foreground text-base font-medium font-sans uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
