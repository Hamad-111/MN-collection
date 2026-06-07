'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="group rounded-xl overflow-hidden bg-white border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 overflow-hidden flex items-center justify-center">
        {badge && (
          <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            {badge}
          </div>
        )}

        <div className="text-center text-primary/40">
          <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-secondary/20"></div>
          <p className="text-sm">Fashion Item</p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 left-4 p-2 bg-white rounded-full shadow hover:shadow-md transition-all z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-secondary text-secondary' : 'text-muted-foreground'
            } transition`}
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xl font-bold text-secondary">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
