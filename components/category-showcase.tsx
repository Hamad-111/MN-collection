'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const categories = [
  {
    id: 1,
    name: 'Abayas',
    icon: '👗',
    description: 'Elegant traditional wear',
    gradient: 'from-yellow-600 to-yellow-700',
  },
  {
    id: 2,
    name: 'Formal Wear',
    icon: '👔',
    description: 'Premium formal collection',
    gradient: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 3,
    name: 'Casual Collection',
    icon: '👕',
    description: 'Comfortable everyday style',
    gradient: 'from-yellow-600 to-yellow-700',
  },
  {
    id: 4,
    name: 'Accessories',
    icon: '💎',
    description: 'Exquisite finishing touches',
    gradient: 'from-yellow-500 to-yellow-600',
  },
]

export default function CategoryShowcase() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  } as const

  return (
    <section
      id="collections"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-accent/5 to-background scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-4">
            Collections
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our curated collection of premium fashion
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative h-64 rounded-2xl overflow-hidden bg-card backdrop-blur-xl border border-border/80 p-6 flex flex-col justify-between cursor-pointer group-hover:border-secondary/40 group-hover:shadow-xl transition-all duration-500">
                <div className="flex items-start justify-between">
                  <span className="text-5xl">{category.icon}</span>
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary"
                    whileHover={{ rotate: 45, scale: 1.1 }}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-serif text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <motion.div
                  className="flex items-center gap-2 text-secondary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Explore
                  <span>→</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
