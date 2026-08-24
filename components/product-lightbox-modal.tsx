'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShoppingCart,
  Heart,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  Share2,
  ChevronRight,
  CreditCard
} from 'lucide-react'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default function ProductLightboxModal() {
  const { lightboxProduct, closeProductLightbox, addToCart } = useStore()
  const { toast } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Reset states when lightbox product changes
  useEffect(() => {
    setQuantity(1)
    setIsZoomed(false)
  }, [lightboxProduct])

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeProductLightbox])

  if (!lightboxProduct) return null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(lightboxProduct)
    }
    toast({
      title: 'Added to Cart! 🛒',
      description: `${quantity}x ${lightboxProduct.name} added to your shopping cart.`,
    })
    closeProductLightbox()
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? 'Removed from Wishlist 🤍' : 'Saved to Wishlist! ❤️',
      description: `${lightboxProduct.name} saved to your favorites.`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lightboxProduct.name,
        text: lightboxProduct.description,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link Copied! 🔗',
        description: 'Product link copied to clipboard.',
      })
    }
  }

  const discountPercent =
    lightboxProduct.originalPrice && lightboxProduct.originalPrice > lightboxProduct.price
      ? Math.round(
          ((lightboxProduct.originalPrice - lightboxProduct.price) /
            lightboxProduct.originalPrice) *
            100
        )
      : null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans antialiased">
        {/* Backdrop overlay with luxury blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProductLightbox}
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl transition-opacity"
        />

        {/* Full-Screen Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={closeProductLightbox}
            className="absolute top-4 right-4 z-30 p-2.5 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
            aria-label="Close product picture view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: FULL-FORM PICTURE DISPLAY AREA */}
          <div className="w-full md:w-1/2 bg-[#fcfaf6] relative flex items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-stone-200 min-h-[340px] md:min-h-[550px] overflow-hidden group">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
              {lightboxProduct.badge && (
                <span className="px-3 py-1 bg-amber-800 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md">
                  {lightboxProduct.badge}
                </span>
              )}
              {discountPercent && (
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Full Image */}
            <div className="relative w-full h-full flex items-center justify-center max-h-[70vh]">
              {lightboxProduct.image?.startsWith('/') ||
              lightboxProduct.image?.startsWith('http') ||
              lightboxProduct.image?.startsWith('data:') ? (
                <img
                  src={lightboxProduct.image}
                  alt={lightboxProduct.name}
                  className={`max-h-[65vh] w-auto object-contain rounded-2xl drop-shadow-xl transition-all duration-500 cursor-zoom-in ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              ) : (
                <div className="w-44 h-44 rounded-full bg-stone-200 flex items-center justify-center text-7xl shadow-inner">
                  {lightboxProduct.image || '👗'}
                </div>
              )}
            </div>

            {/* Image Zoom Control Hint */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-stone-800 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md border border-stone-200 backdrop-blur-md transition-colors cursor-pointer"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5 text-amber-800" /> Reset View
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5 text-amber-800" /> Click to Zoom Full Image
                </>
              )}
            </button>
          </div>

          {/* RIGHT: DRESS DETAILS & PURCHASE ACTIONS */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[92vh] space-y-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-amber-900 font-bold uppercase tracking-widest border-b border-stone-100 pb-3">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {lightboxProduct.category || 'Luxury Collection'}
                </span>
                <span className="text-stone-500 font-medium">SKU: MN-{lightboxProduct.id}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                {lightboxProduct.name}
              </h2>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-900">
                  {formatPrice(lightboxProduct.price)}
                </span>
                {lightboxProduct.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(lightboxProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-b border-stone-100 py-3.5 font-normal">
                {lightboxProduct.description}
              </p>

              {/* Features & Pakistan Delivery Guarantee */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 text-stone-700 text-xs font-semibold">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Free Express COD Pakistan</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>100% Authentic Silk Blend</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Quantity Selection
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-stone-700 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold text-sm text-stone-900 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-stone-700 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : 'bg-stone-50 border-stone-300 text-stone-500 hover:text-red-600'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
                    title="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-amber-800 via-amber-700 to-yellow-700 hover:from-amber-700 hover:to-yellow-600 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all shadow-lg cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> Add {quantity > 1 ? `${quantity} Items` : ''} to Cart
              </button>

              <Link
                href="/checkout"
                onClick={() => {
                  addToCart(lightboxProduct)
                  closeProductLightbox()
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all shadow-md cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> Buy Now (Instant Checkout)
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
