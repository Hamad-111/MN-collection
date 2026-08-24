'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useStore()
  const { toast } = useToast()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsCartOpen(false)
    router.push('/checkout')
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] cursor-pointer"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border/80 shadow-2xl z-[9999] flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-bold font-serif text-foreground">Your Shopping Cart</h2>
                <span className="bg-secondary/15 text-primary text-xs px-2.5 py-1 rounded-full font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-secondary/10 rounded-lg text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4 text-3xl">
                    🛍️
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    Browse our premium collections and add elegance to your personal wardrobe.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-xs uppercase tracking-wider hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-xl border border-border/80 bg-background/50 hover:border-secondary/20 hover:bg-accent/5 transition-all group"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-20 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-lg flex items-center justify-center border border-border/40 shrink-0 overflow-hidden">
                      {item.product.image?.startsWith('/') || item.product.image?.startsWith('http') || item.product.image?.startsWith('data:') ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-2xl">{item.product.image || '👗'}</span>
                      )}
                    </div>

                    {/* Content info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-serif font-semibold text-sm text-foreground truncate group-hover:text-secondary transition-colors">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                          {item.product.category}
                        </p>
                      </div>

                      {/* Price and Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-1 bg-muted/60 border border-border/40 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-background rounded-md text-foreground transition-all cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-sans px-2 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-background rounded-md text-foreground transition-all cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="flex items-start">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-border/40 bg-muted/20 space-y-4 shrink-0 font-sans">
                {/* Cash on Delivery Badge */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-2.5 rounded-lg flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                    💵 Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] text-emerald-300 font-sans font-normal">Available at checkout</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated VAT (5%)</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Courier Delivery</span>
                    <span className="text-emerald-500 font-bold uppercase text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-foreground border-t border-border/40 pt-2.5 mt-1">
                    <span className="font-serif">Estimated Total</span>
                    <span className="text-primary">{formatPrice(subtotal * 1.05)}</span>
                  </div>
                </div>

                <div className="pt-2 gap-2 flex flex-col">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-lg text-xs uppercase tracking-widest hover:brightness-105 transition-all shadow-lg cursor-pointer"
                  >
                    Proceed to Checkout / COD
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2.5 text-center text-xs text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
