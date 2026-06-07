'use client'

import { motion } from 'framer-motion'
import FlipCard from './flip-card'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const products = [
  {
    id: 1,
    title: 'Silk Elegance Abaya',
    price: 189,
    originalPrice: 249,
    category: 'Premium',
    description: 'Luxurious silk blend abaya with intricate embroidery details',
  },
  {
    id: 2,
    title: 'Royal Blue Formal',
    price: 219,
    originalPrice: 299,
    category: 'Formal',
    description: 'Sophisticated formal wear perfect for special occasions',
  },
  {
    id: 3,
    title: 'Modern Casual Dress',
    price: 129,
    originalPrice: 169,
    category: 'Casual',
    description: 'Contemporary design with comfortable everyday wear',
  },
  {
    id: 4,
    title: 'Golden Border Abaya',
    price: 199,
    originalPrice: 279,
    category: 'Premium',
    description: 'Exquisite abaya with golden embellishments and details',
  },
  {
    id: 5,
    title: 'Pearl White Ensemble',
    price: 209,
    originalPrice: 289,
    category: 'Formal',
    description: 'Elegant pearl-white formal ensemble for grand occasions',
  },
  {
    id: 6,
    title: 'Casual Comfort Wear',
    price: 119,
    originalPrice: 159,
    category: 'Casual',
    description: 'Breathable casual wear designed for maximum comfort',
  },
  {
    id: 7,
    title: 'Emerald Luxury',
    price: 239,
    originalPrice: 319,
    category: 'Premium',
    description: 'Stunning emerald green with premium fabric quality',
  },
  {
    id: 8,
    title: 'Diamond Sparkle Dress',
    price: 229,
    originalPrice: 309,
    category: 'Premium',
    description: 'Sparkling dress with diamond-cut embellishments',
  },
]

export default function AnimatedProductGrid() {
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
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <FlipCard
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                category={product.category}
                description={product.description}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-primary text-primary-foreground font-semibold font-sans rounded-lg text-xs uppercase tracking-widest shadow-xl shadow-primary/10 transition-all"
          >
            Load More Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
