'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ShoppingCart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { products, addToCart } = useStore()
  const { toast } = useToast()
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter((prod) =>
        prod.name.toLowerCase().includes(query.toLowerCase()) ||
        prod.category.toLowerCase().includes(query.toLowerCase()) ||
        prod.description.toLowerCase().includes(query.toLowerCase())
      )

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation()
    addToCart(product)
    toast({
      title: 'Added to Cart! 🛒',
      description: `Successfully added ${product.name} to your cart.`,
    })
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-[9999] overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col font-sans"
        >
          {/* Header Controls */}
          <div className="max-w-4xl mx-auto w-full flex justify-end mb-6 shrink-0">
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary/15 text-foreground rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"
            >
              Close <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
            <div className="relative border-b-2 border-border focus-within:border-secondary transition-colors shrink-0 mb-8">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search premium collections (e.g. Abaya, Formal, Casual)..."
                className="w-full bg-transparent pl-9 pr-4 py-4 text-xl sm:text-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              {query.trim() === '' ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg">What are you looking for today?</p>
                  <p className="text-xs uppercase tracking-widest mt-1">Start typing to search boutique inventory</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg">No matching products found</p>
                  <p className="text-xs uppercase tracking-widest mt-1">Try another search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onClose()
                        // Scroll to the product
                        const el = document.getElementById('shop')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="flex gap-4 p-4 rounded-xl border border-border/80 bg-card hover:border-secondary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-20 bg-gradient-to-br from-secondary/15 to-primary/5 rounded-lg flex items-center justify-center border border-border/40 shrink-0 select-none overflow-hidden">
                        {product.image?.startsWith('/') || product.image?.startsWith('http') || product.image?.startsWith('data:') ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-3xl">{product.image || '👗'}</span>
                        )}
                      </div>

                      {/* Info & CTA */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif font-bold text-base text-foreground truncate group-hover:text-secondary transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-sm font-bold text-primary shrink-0">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                            {product.category}
                          </p>
                          <p className="text-xs text-muted-foreground/80 line-clamp-1 mt-1 font-light">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex justify-end mt-2">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="px-3 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
