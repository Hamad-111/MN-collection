'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Send, ShieldCheck, Banknote, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function Footer() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: 'Error ❌',
        description: 'Please enter an email address to subscribe.',
        variant: 'destructive',
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email ❌',
        description: 'Please provide a valid email format (e.g. user@example.com).',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Subscribed Successfully! ✉️',
      description: `Thank you! ${email} has been subscribed to our boutique newsletter.`,
    })
    setEmail('')
  }

  const handleSimulatedLink = (label: string) => {
    toast({
      title: 'Navigation Info 🌐',
      description: `"${label}" section is ready in the live boutique catalog.`,
    })
  }

  return (
    <footer className="bg-[#f5f1eb] text-stone-800 relative overflow-hidden border-t border-stone-300 font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MN Collection"
                className="h-12 w-auto object-contain drop-shadow-xs"
              />
              <h3 className="text-lg font-bold font-serif tracking-[0.2em] gold-gradient-text uppercase">
                MN Collection
              </h3>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed font-normal">
              Royal oriental fashion, handcrafted silk suits, and luxury couture tailored for timeless elegance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/mncollection_09"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook @mncollection_09"
                className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-amber-800 hover:text-amber-600 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/mncollection_09"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @mncollection_09"
                className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-amber-800 hover:text-amber-600 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/mncollection_09"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter / X @mncollection_09"
                className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-amber-800 hover:text-amber-600 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-xs"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=mncollection09@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Gmail mncollection09@gmail.com"
                className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-amber-800 hover:text-amber-600 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-xs"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Boutique Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-amber-900">Collections</h4>
            <ul className="space-y-2.5 text-stone-600 text-xs font-medium">
              <li>
                <a href="#new-arrivals" className="hover:text-amber-800 transition cursor-pointer">
                  New Arrivals 2026
                </a>
              </li>
              <li>
                <a href="#men-collection" className="hover:text-amber-800 transition cursor-pointer">
                  Men's Royal Collection
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-amber-800 transition cursor-pointer">
                  Oriental Abayas & Dresses
                </a>
              </li>
              <li>
                <button onClick={() => handleSimulatedLink('Accessories')} className="hover:text-amber-800 transition cursor-pointer text-left">
                  Handcrafted Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & COD */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-amber-900">Service & Delivery</h4>
            <div className="space-y-2.5 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-2 text-stone-800">
                <Truck className="w-4 h-4 text-amber-700" /> Free Courier Delivery
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Banknote className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD)
              </div>
              <div className="flex items-center gap-2 text-stone-800">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> 100% Authentic Quality
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-amber-900">VIP Newsletter</h4>
            <p className="text-stone-600 text-xs font-normal leading-relaxed">
              Subscribe for private boutique previews, VIP fashion drops, and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 text-xs shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-300 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-stone-600 text-xs font-normal gap-4">
          <p>&copy; 2026 MN Collection Boutique. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleSimulatedLink('Privacy Policy')} className="hover:text-stone-900 transition cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleSimulatedLink('Terms of Service')} className="hover:text-stone-900 transition cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => handleSimulatedLink('Cash on Delivery Terms')} className="hover:text-stone-900 transition cursor-pointer">
              COD Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
