'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, ShieldAlert, ShieldCheck, User as UserIcon, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store-provider'
import CartDrawer from './cart-drawer'
import SearchOverlay from './search-overlay'
import AuthModal from './auth-modal'
import UserOrdersModal from './user-orders-modal'

export default function Header() {
  const { cart, setIsCartOpen, currentUser, logout } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const navItems = [
    { label: 'New Arrivals', href: '#new-arrivals' },
    { label: "Men's Collection", href: '#men-collection' },
    { label: 'Shop', href: '#shop' },
    { label: 'About', href: '#about' },
  ]

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    const sections = ['new-arrivals', 'men-collection', 'shop', 'about']
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fbf9f5]/90 backdrop-blur-2xl border-b border-stone-200/80 shadow-sm font-sans text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
          >
            <Link href="/" className="flex items-center gap-3 justify-center group">
              <img
                src="/logo.png"
                alt="MN logo"
                className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-base font-bold font-serif tracking-[0.25em] gold-gradient-text uppercase whitespace-nowrap">
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
                    className={`transition relative group text-xs font-bold tracking-widest uppercase ${
                      isActive ? 'text-amber-700 font-bold' : 'text-stone-700 hover:text-amber-700'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-600 to-yellow-600 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-secondary/10 rounded-lg transition text-foreground cursor-pointer"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Cart Trigger */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-secondary/10 rounded-lg transition text-foreground cursor-pointer"
              aria-label="Open cart drawer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            {/* User Session Trigger */}
            {currentUser ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 p-1 hover:bg-secondary/10 rounded-lg transition cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full border border-secondary/35 object-cover shrink-0"
                  />
                  <span className="text-[11px] font-bold tracking-wide text-foreground hidden lg:inline-block max-w-[85px] truncate font-sans">
                    {currentUser.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border/80 rounded-xl shadow-xl p-2.5 z-50 text-xs text-foreground font-sans"
                    >
                      <div className="p-1.5 border-b border-stone-200 font-bold mb-1.5 text-amber-800 uppercase tracking-wider text-[9px] flex items-center justify-between">
                        <span>Account Profile</span>
                        {(currentUser.role === 'Admin' || currentUser.email.toLowerCase() === 'admin@mncollection.com') && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[8px] font-extrabold uppercase">
                            👑 Admin
                          </span>
                        )}
                      </div>
                      <div className="px-1.5 py-0.5 text-stone-900 font-semibold truncate">
                        {currentUser.name}
                      </div>
                      <div className="px-1.5 pb-2 text-[10px] text-stone-500 truncate border-b border-stone-200">
                        {currentUser.email}
                      </div>
                      {(currentUser.role === 'Admin' || currentUser.email.toLowerCase() === 'admin@mncollection.com') && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-left p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 mt-2 border border-amber-200 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          Go to Admin Portal
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsOrdersModalOpen(true)
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left p-1.5 hover:bg-stone-100 text-stone-800 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 mt-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        My Orders & Receipts
                      </button>
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 mt-1 border-t border-stone-200 pt-2"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => setIsAuthOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-primary/30 text-foreground hover:bg-secondary/10 font-semibold rounded-lg transition text-[10px] uppercase tracking-widest cursor-pointer font-sans"
              >
                Sign In
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary/10 rounded-lg transition text-foreground cursor-pointer"
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

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* User Orders & Receipts Modal */}
      <UserOrdersModal isOpen={isOrdersModalOpen} onClose={() => setIsOrdersModalOpen(false)} />
    </header>
  )
}
