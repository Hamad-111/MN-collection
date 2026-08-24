'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

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
  const { products, addToCart, openProductLightbox } = useStore()
  const { toast } = useToast()
  
  const matchedProduct = products.find((p) => p.name === title) || {
    id: Math.floor(Math.random() * 100000) + 2000,
    name: title,
    title: title,
    price,
    originalPrice,
    category: category || 'Premium',
    description: description || 'Premium quality silk fabric with exquisite craftsmanship and tailored finish.',
    image: image || '👗',
  }

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

  const handleCardClick = () => {
    openProductLightbox(matchedProduct)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent flip card lightbox trigger when clicking button
    addToCart(matchedProduct)
    
    toast({
      title: 'Added to Cart! 🛒',
      description: `${title} has been added to your shopping cart.`,
    })
  }

  return (
    <motion.div
      className="h-80 cursor-pointer"
      onClick={handleCardClick}
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
                const newFavorite = !isFavorite
                setIsFavorite(newFavorite)
                toast({
                  title: newFavorite ? 'Added to Wishlist! ❤️' : 'Removed from Wishlist 🤍',
                  description: `${title} has been ${newFavorite ? 'added to' : 'removed from'} your wishlist.`,
                })
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="text-lg cursor-pointer"
            >
              {isFavorite ? '❤️' : '🤍'}
            </motion.button>
          </div>

          <div className="flex-1 flex items-center justify-center py-2 overflow-hidden">
            {image?.startsWith('data:') || image?.startsWith('http') || image?.startsWith('/') ? (
              <img src={image} alt={title} className="w-full h-36 object-cover rounded-xl border border-border/40 shadow-sm" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-secondary/15 to-primary/5 rounded-2xl flex items-center justify-center text-4xl shadow-inner shadow-secondary/5 border border-border/40">
                {image || '👗'}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold font-serif text-foreground mb-1 line-clamp-1">{title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary">{formatPrice(price)}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
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
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-background text-foreground font-semibold font-sans rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted shadow-lg transition-colors cursor-pointer"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
