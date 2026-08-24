'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import FlipCard from './flip-card'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { useStore } from '@/components/store-provider'

export default function AnimatedProductGrid() {
  const { products } = useStore()
  const [limit, setLimit] = useState(8)
  const { ref, isInView } = useScrollAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  const displayProducts = products.slice(0, limit)

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-accent/5 to-background"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-4">
            Featured Collection
          </h2>
          <p className="text-muted-foreground text-lg">
            Hover over items to see more details
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <FlipCard
                title={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                category={product.category}
                description={product.description}
                image={product.image}
              />
            </motion.div>
          ))}
        </motion.div>

        {limit < products.length && (
          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              onClick={() => setLimit((prev) => prev + 4)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-primary text-primary-foreground font-semibold font-sans rounded-lg text-xs uppercase tracking-widest shadow-xl shadow-primary/10 transition-all cursor-pointer"
            >
              Load More Products
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
