'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-accent/10 text-foreground relative overflow-hidden border-t border-border/50">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-secondary rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-start gap-2 mb-4">
              <img
                src="/logo.png"
                alt="MN logo"
                style={{ height: '90px', width: 'auto' }}
                className="object-contain"
              />
              <h3 className="text-base font-bold font-serif tracking-[0.25em] text-foreground uppercase mt-2">
                MN Collection
              </h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed font-sans font-light">
              Premium clothing and traditional wear for the modern, sophisticated you.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, color: '#c29f62' }}
                className="hover:text-secondary transition text-primary"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, color: '#c29f62' }}
                className="hover:text-secondary transition text-primary"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, color: '#c29f62' }}
                className="hover:text-secondary transition text-primary"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, color: '#c29f62' }}
                className="hover:text-secondary transition text-primary"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Shop */}
          <div>
            <h4 className="font-serif font-semibold text-base uppercase tracking-wider mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2 text-muted-foreground text-sm font-sans font-light">
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Abayas
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Formal Wear
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Casual Collection
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition font-semibold text-secondary">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif font-semibold text-base uppercase tracking-wider mb-4 text-foreground">Customer Service</h4>
            <ul className="space-y-2 text-muted-foreground text-sm font-sans font-light">
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-secondary transition">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-semibold text-base uppercase tracking-wider mb-4 text-foreground">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed font-sans font-light">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 text-sm font-sans"
              />
              <button className="px-4 py-2 rounded-r-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-sans text-xs uppercase tracking-widest transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground text-xs font-sans font-light">
          <p>&copy; 2024 MN Collection. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-secondary transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-secondary transition">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-secondary transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
