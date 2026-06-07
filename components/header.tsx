'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const navItems = [
    { label: 'Collections', href: '#collections' },
    { label: 'New Arrivals', href: '#new-arrivals' },
    { label: 'Shop', href: '#shop' },
    { label: 'About', href: '#about' },
  ]

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // trigger when section is in middle of viewport
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    const sections = ['collections', 'new-arrivals', 'shop', 'about']
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.unobserve(el)
      })
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <Link href="/" className="flex flex-col items-center gap-1 justify-center">
              <img
                src="/logo.png"
                alt="MN logo"
                style={{ height: '80px', width: 'auto' }}
                className="object-contain"
              />
              <span className="text-sm font-bold font-serif tracking-[0.25em] text-foreground uppercase whitespace-nowrap mt-0.5">
                MN Collection
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1)
              return (
                <motion.div
                  key={item.href}
                  whileHover={{ y: -1 }}
                >
                  <Link
                    href={item.href}
                    className={`transition relative group text-sm font-medium tracking-wider uppercase ${
                      isActive ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-secondary/10 rounded-lg transition text-foreground"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-secondary/10 rounded-lg transition text-foreground"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary/10 rounded-lg transition text-foreground"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 pt-4 border-t border-border/40 flex flex-col gap-3"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`transition py-2 hover:pl-2 duration-200 text-sm font-medium uppercase tracking-wider ${
                    isActive ? 'text-primary font-semibold pl-2' : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </motion.nav>
        )}
      </div>
    </header>
  )
}
