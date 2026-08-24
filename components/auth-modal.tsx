'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Sparkles, UserCheck, Lock, Eye, EyeOff, Phone, MapPin, Building } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useStore()
  const { toast } = useToast()
  
  const [isLoginTab, setIsLoginTab] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email) {
      setError('Please fill in the email address field.')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email format.')
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (isLoginTab) {
      // Login flow
      const success = await login(email, password)
      setLoading(false)
      if (success) {
        toast({
          title: 'Welcome Back! 👋',
          description: `Successfully signed in. Happy shopping!`,
        })
        onClose()
      } else {
        setError('Authentication failed. Please check your credentials or register a new account.')
      }
    } else {
      // Register flow
      if (!name) {
        setError('Please fill in your full name.')
        setLoading(false)
        return
      }

      if (!phone || phone.length < 7) {
        setError('Please enter a valid contact phone number for Cash on Delivery / shipping.')
        setLoading(false)
        return
      }

      if (!address) {
        setError('Please enter your delivery street address.')
        setLoading(false)
        return
      }

      if (!city) {
        setError('Please enter your city.')
        setLoading(false)
        return
      }
      
      try {
        await register(name, email, password, phone, address, city)
        setLoading(false)
        toast({
          title: 'Account Created! 🎉',
          description: `Welcome to MN Collection, ${name}! Your Cash on Delivery profile is ready.`,
        })
        onClose()
      } catch (err: any) {
        setLoading(false)
        setError(err.message || 'Registration failed. Please check details or try another email.')
      }
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="z-[9999] my-auto bg-card border border-border/80 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] font-sans text-foreground"
          >
            {/* Gold Accent Blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/10 rounded-lg transition-colors cursor-pointer z-10"
              aria-label="Close authentication"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Title */}
            <div className="text-center mb-6 pt-2">
              <img src="/logo.png" alt="MN Collection" className="w-16 h-auto mx-auto mb-2 object-contain drop-shadow-md" />
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {isLoginTab ? 'Customer Authentication' : 'Create Customer Account'}
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
                MN Collection Boutique Portal
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-muted/60 p-1 rounded-xl border border-border/40 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(true)
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  isLoginTab ? 'bg-background text-primary shadow-sm border border-border/20' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(false)
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  !isLoginTab ? 'bg-background text-primary shadow-sm border border-border/20' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form errors */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg mb-4 text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Form Input fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginTab && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fatima Al-Suwaidi"
                      className="w-full bg-background border border-border/80 hover:border-secondary/35 rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-secondary/65 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number (For Cash on Delivery - Pakistan)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0300-1234567 / +92 300 1234567"
                      className="w-full bg-background border border-border/80 hover:border-secondary/35 rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-secondary/65 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Street Address / House
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. House #12, Block 4, Clifton"
                        className="w-full bg-background border border-border/80 hover:border-secondary/35 rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-secondary/65 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-primary" /> City (Pakistan)
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Karachi / Lahore / Islamabad"
                        className="w-full bg-background border border-border/80 hover:border-secondary/35 rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-secondary/65 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. fatima@example.com"
                  className="w-full bg-background border border-border/80 hover:border-secondary/35 rounded-xl py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-secondary/65 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" /> Secret Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border/80 hover:border-secondary/35 rounded-xl py-2.5 px-4 pr-10 text-sm text-foreground focus:outline-none focus:border-secondary/65 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-xl text-xs uppercase tracking-widest hover:brightness-105 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : isLoginTab ? (
                  <>
                    <UserCheck className="w-4 h-4" /> Authenticate Profile
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Register & Access
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
