'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Printer, Download, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, Phone, Mail, FileText, ChevronRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useStore } from './store-provider'
import { Order, Product } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface UserOrdersModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserOrdersModal({ isOpen, onClose }: UserOrdersModalProps) {
  const { currentUser, orders, products } = useStore()
  const [mounted, setMounted] = useState(false)
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted || !currentUser) return null

  // Filter orders for the currently authenticated user
  const userOrders = orders.filter((o) => o.userId === currentUser.id)

  const handlePrintReceipt = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        )
      case 'processing':
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full">
            <Truck className="w-3 h-3 animate-pulse" /> Out for Delivery / Shipped
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            <Clock className="w-3 h-3" /> Pending Delivery
          </span>
        )
    }
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-stone-950 border border-stone-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans text-stone-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-850 bg-stone-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif text-amber-500">My Orders & Purchase Receipts</h2>
                <p className="text-xs text-stone-400">View delivery status and download official boutique invoices</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-850 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List Container */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {userOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Package className="w-12 h-12 text-stone-600 mx-auto" />
                <h3 className="text-base font-serif font-bold text-stone-300">No Orders Logged Yet</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  When you place an order with Cash on Delivery or Card, your receipts will appear here automatically.
                </p>
              </div>
            ) : (
              userOrders.map((order) => {
                const product = products.find((p) => p.id === order.productId)
                const subtotal = product ? product.price * order.quantity : 0
                const vat = subtotal * 0.05
                const total = subtotal + vat

                return (
                  <div
                    key={order.id}
                    className="bg-stone-900/40 border border-stone-850 rounded-xl p-5 space-y-4 hover:border-amber-500/30 transition-all"
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-850/80 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                          Order ID
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">#{order.id}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" /> View & Print Receipt
                        </button>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-16 bg-stone-950 rounded-lg border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
                        {product?.image?.startsWith('/') || product?.image?.startsWith('http') || product?.image?.startsWith('data:') ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{product?.image || '👗'}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-xs space-y-1">
                        <h4 className="font-bold text-stone-200 truncate">{product?.name || `Product #${order.productId}`}</h4>
                        <p className="text-stone-400 text-[11px]">
                          Qty: <span className="font-bold text-stone-200">{order.quantity}x</span> • Price: {formatPrice(product?.price || 0)}
                        </p>
                        <div className="text-[10px] text-stone-500 flex items-center gap-2 flex-wrap">
                          <span>Payment: <strong className="text-stone-300">{order.paymentDetails?.brand || 'Cash on Delivery'}</strong></span>
                          <span>•</span>
                          <span>Recipient: <strong className="text-stone-300">{order.shippingDetails?.name || currentUser.name}</strong></span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block">Total Paid / Due</span>
                        <span className="text-sm font-bold font-serif text-amber-400">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* PRINTABLE RECEIPT MODAL / OVERLAY */}
          {selectedReceiptOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
              <div className="bg-stone-950 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-900 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Printable Invoice Branding Header */}
                <div className="text-center border-b border-stone-850 pb-6 space-y-2">
                  <img src="/logo.png" alt="MN Collection" className="h-12 mx-auto object-contain" />
                  <h1 className="text-xl font-bold font-serif tracking-[0.2em] text-amber-500 uppercase">
                    MN Collection
                  </h1>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                    Official Boutique Purchase Receipt & Delivery Invoice
                  </p>
                </div>

                {/* Receipt Meta */}
                <div className="grid grid-cols-2 gap-4 bg-stone-900/50 p-4 rounded-xl border border-stone-850 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-stone-500 uppercase block">Receipt / Order ID</span>
                    <span className="font-mono font-bold text-amber-400">#{selectedReceiptOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-stone-500 uppercase block">Delivery Status</span>
                    <span className="font-bold text-emerald-400 uppercase">{selectedReceiptOrder.status}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-stone-500 uppercase block">Date & Time</span>
                    <span className="text-stone-300">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-stone-500 uppercase block">Payment Method</span>
                    <span className="font-semibold text-stone-200">{selectedReceiptOrder.paymentDetails?.brand || 'Cash on Delivery (COD)'}</span>
                  </div>
                </div>

                {/* Recipient & Shipping Information */}
                <div className="bg-stone-900/30 p-4 rounded-xl border border-stone-850 space-y-2 text-xs">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-850 pb-1">
                    Delivery Address & Contact
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-stone-300">
                    <div>
                      <span className="text-stone-500 text-[10px] block">Customer Name</span>
                      <p className="font-semibold">{selectedReceiptOrder.shippingDetails?.name || currentUser.name}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">Courier Contact Phone</span>
                      <p className="font-semibold text-amber-400">{selectedReceiptOrder.shippingDetails?.phone || currentUser.phone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-500 text-[10px] block">Street Address / City</span>
                      <p className="font-light">{selectedReceiptOrder.shippingDetails?.address || 'Standard Delivery'}, {selectedReceiptOrder.shippingDetails?.city || 'Karachi'}, {selectedReceiptOrder.shippingDetails?.country || 'Pakistan'}</p>
                    </div>
                  </div>
                </div>

                {/* Purchased Items Table */}
                <div className="border border-stone-850 rounded-xl overflow-hidden text-xs">
                  <div className="bg-stone-900 px-4 py-2 flex justify-between font-bold text-stone-400 uppercase text-[9px] tracking-wider">
                    <span>Item Summary</span>
                    <span>Subtotal</span>
                  </div>
                  {(() => {
                    const prod = products.find((p) => p.id === selectedReceiptOrder.productId)
                    const itemSubtotal = prod ? prod.price * selectedReceiptOrder.quantity : 0
                    const itemVat = itemSubtotal * 0.05
                    const itemTotal = itemSubtotal + itemVat

                    return (
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-stone-900 pb-3">
                          <div>
                            <p className="font-semibold text-stone-200">{prod?.name || `Product #${selectedReceiptOrder.productId}`}</p>
                            <p className="text-[10px] text-stone-500">Qty: {selectedReceiptOrder.quantity}x @ {formatPrice(prod?.price || 0)}</p>
                          </div>
                          <span className="font-bold text-stone-300">{formatPrice(itemSubtotal)}</span>
                        </div>

                        <div className="space-y-1.5 text-stone-400 text-xs pt-1">
                          <div className="flex justify-between text-[11px]">
                            <span>Items Subtotal</span>
                            <span>{formatPrice(itemSubtotal)}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span>VAT (5%)</span>
                            <span>{formatPrice(itemVat)}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span>Courier Delivery Fee</span>
                            <span className="text-emerald-400 font-bold uppercase text-[10px]">FREE</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-stone-100 border-t border-stone-850 pt-2.5 mt-2">
                            <span>Total Invoice Amount</span>
                            <span className="text-amber-400">{formatPrice(itemTotal)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Printer className="w-4 h-4" /> Save / Print Receipt PDF
                  </button>
                  <button
                    onClick={() => setSelectedReceiptOrder(null)}
                    className="px-5 py-3 bg-stone-900 hover:bg-stone-850 text-stone-300 font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
