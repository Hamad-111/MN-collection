'use client'

import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  name: string
  price: number
  originalPrice?: number
  image?: string
  badge?: string
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  image,
  badge,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { products, addToCart, openProductLightbox } = useStore()
  const { toast } = useToast()

  const matchedProduct = products.find((p) => p.name === name) || {
    id: Math.floor(Math.random() * 100000) + 1000,
    name,
    title: name,
    price,
    originalPrice,
    category: badge || 'Fashion',
    description: 'Premium quality oriental silk blend fabric with exquisite craftsmanship and tailored finish.',
    badge,
    image: image || '👗',
  }

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    addToCart(matchedProduct)
    
    toast({
      title: 'Added to Cart! 🛒',
      description: `${name} has been added to your shopping cart.`,
    })
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? 'Removed from Wishlist 🤍' : 'Added to Wishlist! ❤️',
      description: `${name} has been ${isFavorite ? 'removed from' : 'added to'} your wishlist.`,
    })
  }

  const handleOpenLightbox = () => {
    openProductLightbox(matchedProduct)
  }

  // Calculate discount percentage if original price exists
  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-amber-500/40 transition-all duration-500 hover:shadow-xl font-sans flex flex-col justify-between">
      {/* Top Image Container (Clickable for Full Picture View) */}
      <div 
        onClick={handleOpenLightbox}
        className="relative aspect-[3/4] bg-stone-100/70 overflow-hidden flex items-center justify-center cursor-pointer group/img"
        title="Click to view full picture"
      >
        {/* Badges Container */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-20">
          {badge && (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md">
              {badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 overflow-hidden">
          {image?.startsWith('data:') || image?.startsWith('http') || image?.startsWith('/') ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-108"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-stone-200/80 border border-stone-300 flex items-center justify-center text-3xl shrink-0 group-hover/img:scale-110 transition-transform duration-500">
              {image || '👗'}
            </div>
          )}
        </div>

        {/* Full View Hover Overlay Hint */}
        <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="px-3.5 py-2 bg-stone-900/90 text-white rounded-full font-bold text-[10px] uppercase tracking-widest border border-amber-400/40 shadow-lg flex items-center gap-1.5">
            🔍 Full Picture View
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleFavoriteToggle}
          aria-label="Add to favorites"
          className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-full border border-stone-200 text-stone-600 hover:text-red-600 transition-all z-20 cursor-pointer shadow-xs"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-600 text-red-600' : 'text-stone-400'
            } transition-colors`}
          />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
            ))}
            <span className="text-[10px] font-semibold text-stone-500 ml-1">4.9 (48)</span>
          </div>

          {/* Name */}
          <h3 className="text-sm sm:text-base font-bold font-serif text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {name}
          </h3>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-base sm:text-lg font-bold font-serif text-amber-800">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] py-3 transition-all cursor-pointer shadow-md hover:shadow-amber-700/20"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
