'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'

interface FlipCardProps {
  title: string
  price: number
  originalPrice?: number
  image?: string
  category?: string
  description?: string
}

export default function FlipCard({
  title,
  price,
  originalPrice,
  image,
  category,
  description,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // 3D tilt coordinates
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Tilt limits: -10 to +10 degrees
    const rX = -(y / (rect.height / 2)) * 10
    const rY = (x / (rect.width / 2)) * 10
    
    setRotateX(rX)
    setRotateY(rY)
  }

  const handleMouseLeave = () => {
    setIsFlipped(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      className="h-80 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsFlipped(true)}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isFlipped ? 1.04 : 1,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 15 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (Classic Off-White Card) */}
        <motion.div
          className="absolute inset-0 bg-card rounded-2xl p-6 border border-border/80 shadow-md flex flex-col justify-between select-none"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            {category && (
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-primary text-[10px] font-bold tracking-widest uppercase font-sans">
                {category}
              </span>
            )}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="text-lg"
            >
              {isFavorite ? '❤️' : '🤍'}
            </motion.button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-secondary/15 to-primary/5 rounded-2xl flex items-center justify-center text-4xl shadow-inner shadow-secondary/5 border border-border/40">
              👗
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-serif text-foreground mb-1 line-clamp-1">{title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary">${price}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Back (Gold/Bronze Plate Card) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 border border-secondary/20 flex flex-col justify-between shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <h3 className="text-lg font-bold font-serif text-primary-foreground mb-3">{title}</h3>
            <p className="text-primary-foreground/90 text-xs leading-relaxed font-sans font-light">
              {description ||
                'Premium quality fabric with exquisite craftsmanship. Perfect for any occasion with timeless elegance.'}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-background text-foreground font-semibold font-sans rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted shadow-lg transition-colors"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
