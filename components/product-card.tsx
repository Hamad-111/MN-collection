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
    <div className="group rounded-xl overflow-hidden bg-card border border-border/80 hover:border-secondary/35 transition-all duration-300 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-secondary/10 via-primary/5 to-secondary/5 overflow-hidden flex items-center justify-center">
        {badge && (
          <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider z-10">
            {badge}
          </div>
        )}

        <div className="text-center text-primary/40">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-secondary/15 flex items-center justify-center text-2xl">👗</div>
          <p className="text-xs font-sans tracking-wide">Fashion Item</p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="Add to favorites"
          className="absolute top-4 left-4 p-2 bg-card rounded-full shadow border border-border/40 hover:shadow-md transition-all z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-secondary text-secondary' : 'text-muted-foreground'
            } transition`}
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold font-serif text-foreground mb-1 line-clamp-1 group-hover:text-secondary transition">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold font-sans text-primary">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold font-sans rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] py-3.5 transition-all">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
