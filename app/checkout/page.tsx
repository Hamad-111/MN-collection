'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  UserCheck,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  KeyRound,
  ChevronRight
} from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { useToast } from '@/hooks/use-toast'
import { User, Product } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { sendAdminOrderNotificationEmail, openGmailDraft, ADMIN_GMAIL } from '@/lib/email-service'


type Step = 'account' | 'shipping' | 'payment' | 'review' | 'success'

export default function CheckoutPage() {
  const { cart, currentUser, login, register, addOrder, clearCart, products } = useStore()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState<Step>('account')
  const [orderId, setOrderId] = useState('')

  // Authentication states
  const [isLogin, setIsLogin] = useState(true)
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [authAddress, setAuthAddress] = useState('')
  const [authCity, setAuthCity] = useState('')
  const [authError, setAuthError] = useState('')

  // Shipping states
  const [shippingName, setShippingName] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingPostal, setShippingPostal] = useState('')
  const [shippingCountry, setShippingCountry] = useState('Pakistan')
  const [shippingPhone, setShippingPhone] = useState('')
  const [shippingError, setShippingError] = useState('')

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [isSameAddress, setIsSameAddress] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Auto pre-fill shipping details from logged-in user profile
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !shippingName) setShippingName(currentUser.name)
      if (currentUser.phone && !shippingPhone) setShippingPhone(currentUser.phone)
      if (currentUser.address && !shippingAddress) setShippingAddress(currentUser.address)
      if (currentUser.city && !shippingCity) setShippingCity(currentUser.city)
    }
  }, [currentUser])

  // Subtotal calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.05 // 5% VAT
  const total = subtotal + tax

  // Stepper helper
  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'account', label: 'Identity', icon: UserCheck },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: ShieldCheck }
  ]

  const getStepIndex = (step: Step) => {
    const list: Step[] = ['account', 'shipping', 'payment', 'review', 'success']
    return list.indexOf(step)
  }

  // Handle local checkout auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (!authEmail) {
      setAuthError('Email is required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authEmail)) {
      setAuthError('Please enter a valid email address.')
      return
    }

    if (isLogin) {
      const success = await login(authEmail)
      if (success) {
        toast({
          title: 'Welcome Back! 👋',
          description: 'Successfully authenticated. Proceeding to Shipping details.',
        })
        setCurrentStep('shipping')
      } else {
        setAuthError('No customer record matches this email. Register an account below!')
      }
    } else {
      if (!authName) {
        setAuthError('Please enter your full name.')
        return
      }
      if (!authPhone || authPhone.length < 7) {
        setAuthError('Please enter a valid contact phone number for Cash on Delivery.')
        return
      }
      if (!authAddress) {
        setAuthError('Please enter your delivery street address.')
        return
      }
      if (!authCity) {
        setAuthError('Please enter your city.')
        return
      }
      try {
        const user = await register(authName, authEmail, undefined, authPhone, authAddress, authCity)
        setShippingName(authName)
        setShippingPhone(authPhone)
        setShippingAddress(authAddress)
        setShippingCity(authCity)
        toast({
          title: 'Account Created! 🎉',
          description: `Welcome, ${authName}! Delivery profile saved.`,
        })
        setCurrentStep('shipping')
      } catch (err: any) {
        setAuthError(err.message || 'Registration failed. Please try another email.')
      }
    }
  }

  // Validate shipping details
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShippingError('')

    if (!shippingName || !shippingAddress || !shippingCity || !shippingPostal || !shippingPhone) {
      setShippingError('Please fill out all shipping fields.')
      return
    }

    if (shippingPhone.length < 8) {
      setShippingError('Please enter a valid contact phone number.')
      return
    }

    setCurrentStep('payment')
  }

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    const matches = val.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '))
    } else {
      setCardNumber(val)
    }
  }

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length >= 2) {
      const month = val.substring(0, 2)
      const year = val.substring(2, 4)
      setCardExpiry(`${month}/${year}`)
    } else {
      setCardExpiry(val)
    }
  }

  // Get Credit Card Brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '')
    if (clean.startsWith('4')) return 'Visa'
    if (clean.startsWith('5')) return 'MasterCard'
    if (clean.startsWith('37') || clean.startsWith('34')) return 'Amex'
    return 'Credit Card'
  }

  // Validate payment details
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '')
      if (cleanCard.length < 13) {
        setPaymentError('Please enter a valid credit card number.')
        return
      }

      if (cardExpiry.length < 5) {
        setPaymentError('Please enter expiration details (MM/YY).')
        return
      }

      if (cardCvv.length < 3) {
        setPaymentError('Please enter card security verification code (CVV).')
        return
      }
    }

    setCurrentStep('review')
  }

  // Submit Order
  const handlePlaceOrder = () => {
    if (isProcessing || !currentUser || cart.length === 0) return
    setIsProcessing(true)

    setTimeout(() => {
      const generatedOrderId = 'ord_' + Math.random().toString(36).substr(2, 9)
      
      const cleanCard = cardNumber.replace(/\s/g, '')
      const cardBrand = paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : getCardBrand(cardNumber)
      const paymentDetails = {
        cardholderName: paymentMethod === 'cod' ? shippingName : (cardName || currentUser.name),
        last4: paymentMethod === 'cod' ? 'COD' : (cleanCard.length >= 4 ? cleanCard.substring(cleanCard.length - 4) : '0000'),
        brand: cardBrand
      }

      const shippingDetails = {
        name: shippingName,
        address: shippingAddress,
        city: shippingCity,
        postalCode: shippingPostal,
        country: shippingCountry,
        phone: shippingPhone
      }

      // Add orders into the global boutique database & trigger Gmail notifications
      cart.forEach((item) => {
        addOrder({
          userId: currentUser.id,
          productId: item.product.id,
          quantity: item.quantity,
          status: 'Pending',
          shippingDetails,
          paymentDetails
        })

        // Generate email payload for admin Gmail
        const emailPayload = sendAdminOrderNotificationEmail({
          id: generatedOrderId,
          userId: currentUser.id,
          productId: item.product.id,
          quantity: item.quantity,
          status: 'Pending',
          shippingDetails,
          paymentDetails
        }, currentUser, item.product)

        // Attempt to launch mailto draft for user convenience
        openGmailDraft(emailPayload)
      })

      setOrderId(generatedOrderId)
      toast({
        title: paymentMethod === 'cod' ? 'Cash on Delivery Order Placed! 🚚' : 'Payment Confirmed! 💳',
        description: `Order #${generatedOrderId} placed! Gmail alert sent to ${ADMIN_GMAIL}.`,
      })
      
      setIsProcessing(false)
      clearCart()
      setCurrentStep('success')
    }, 1800)
  }

  // Stepper Header
  const renderStepper = () => (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {steps.map((s, idx) => {
        const Icon = s.icon
        const stepIdx = getStepIndex(s.id)
        const currentIdx = getStepIndex(currentStep)
        const isCompleted = stepIdx < currentIdx
        const isActive = s.id === currentStep

        return (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border text-xs font-bold font-sans transition-all duration-300 ${
                  isCompleted
                    ? 'bg-secondary border-secondary text-stone-950 shadow-lg shadow-secondary/15'
                    : isActive
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/15 scale-110'
                    : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-[9px] uppercase tracking-wider font-bold mt-2 font-sans transition-colors duration-300 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-stone-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-stone-900 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-secondary transition-all duration-500"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080605] text-stone-200 font-sans antialiased pb-20">
      {/* Checkout Navbar */}
      <header className="border-b border-stone-900 bg-stone-950/80 backdrop-blur-md sticky top-0 z-30 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="MN Collection" className="h-10 w-auto object-contain" />
            <span className="text-sm font-bold font-serif tracking-[0.2em] text-stone-100 uppercase">
              MN Collection
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold tracking-wide bg-stone-900 px-3.5 py-1.5 rounded-full border border-stone-850">
            <Lock className="w-3.5 h-3.5 text-secondary animate-pulse" />
            <span className="uppercase text-[9px] font-bold text-stone-400 tracking-widest">
              Secure Encrypted Billing
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {currentStep !== 'success' && renderStepper()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT WIZARD SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: IDENTITY & AUTHENTICATION */}
              {currentStep === 'account' && (
                <motion.div
                  key="step-account"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="bg-stone-950 border border-stone-900 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  {currentUser ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-5 bg-stone-900/40 border border-stone-850 rounded-xl">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-14 h-14 rounded-full border border-stone-850 object-cover"
                        />
                        <div>
                          <h3 className="text-base font-bold text-stone-100">{currentUser.name}</h3>
                          <p className="text-xs text-stone-500">{currentUser.email}</p>
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authenticated Client Profile
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-400 font-light leading-relaxed">
                        You are logged in and ready. Click continue to enter shipping address details.
                      </p>
                      <button
                        onClick={() => setCurrentStep('shipping')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Continue to Shipping <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold font-serif text-amber-500">Sign In or Register</h2>
                        <p className="text-xs text-stone-500 mt-1">Please authenticate your profile to access billing details</p>
                      </div>

                      <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-850">
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(true)
                            setAuthError('')
                          }}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                            isLogin ? 'bg-stone-950 text-amber-400 shadow-sm border border-stone-850' : 'text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(false)
                            setAuthError('')
                          }}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                            !isLogin ? 'bg-stone-950 text-amber-400 shadow-sm border border-stone-850' : 'text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          Register Account
                        </button>
                      </div>

                      {authError && (
                        <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs p-3 rounded-lg text-center font-medium">
                          {authError}
                        </div>
                      )}

                      <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {!isLogin && (
                          <>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
                              <input
                                type="text"
                                required
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                placeholder="Fatima Al-Suwaidi"
                                className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Phone Number (For Cash on Delivery Courier)</label>
                              <input
                                type="tel"
                                required
                                value={authPhone}
                                onChange={(e) => setAuthPhone(e.target.value)}
                                placeholder="+971 50 123 4567"
                                className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Street Address</label>
                                <input
                                  type="text"
                                  required
                                  value={authAddress}
                                  onChange={(e) => setAuthAddress(e.target.value)}
                                  placeholder="Villa 12, Al Bateen"
                                  className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">City</label>
                                <input
                                  type="text"
                                  required
                                  value={authCity}
                                  onChange={(e) => setAuthCity(e.target.value)}
                                  placeholder="Abu Dhabi"
                                  className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                                />
                              </div>
                            </div>
                          </>
                        )}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="fatima@example.com"
                            className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                          />
                          {isLogin && (
                            <span className="text-[9px] text-stone-500 block mt-1">
                              Hint: Log in using <code className="bg-stone-900 px-1 py-0.5 rounded text-amber-500">fatima@example.com</code> or write any email to create an account!
                            </span>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          Authenticate Profile <ChevronRight className="w-4.5 h-4.5" />
                        </button>
                      </form>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: SHIPPING ADDRESS DETAILS */}
              {currentStep === 'shipping' && (
                <motion.div
                  key="step-shipping"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="bg-stone-950 border border-stone-900 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                    <h2 className="text-xl font-bold font-serif text-amber-500">Shipping Information</h2>
                    <button
                      onClick={() => setCurrentStep('account')}
                      className="text-[10px] font-bold text-stone-500 hover:text-stone-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Identity
                    </button>
                  </div>

                  {shippingError && (
                    <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs p-3 rounded-lg text-center font-medium animate-pulse">
                      {shippingError}
                    </div>
                  )}

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Fatima Al-Suwaidi"
                        className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Street Address / House / Flat</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="e.g. House #12, Block 4, Clifton / Gulberg"
                        className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">City (Pakistan)</label>
                        <input
                          type="text"
                          required
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          placeholder="Karachi / Lahore / Islamabad"
                          className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Postal / Zip Code</label>
                        <input
                          type="text"
                          required
                          value={shippingPostal}
                          onChange={(e) => setShippingPostal(e.target.value)}
                          placeholder="75500 / 54000 / 44000"
                          className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Country</label>
                        <select
                          value={shippingCountry}
                          onChange={(e) => setShippingCountry(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40 cursor-pointer"
                        >
                          <option value="Pakistan">Pakistan</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Courier Contact Phone (Pakistan)</label>
                        <input
                          type="tel"
                          required
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="0300-1234567 / +92 300 1234567"
                          className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Continue to Payment <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: BILLING & PAYMENT GATEWAY */}
              {currentStep === 'payment' && (
                <motion.div
                  key="step-payment"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="bg-stone-950 border border-stone-900 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                    <h2 className="text-xl font-bold font-serif text-amber-500">Payment & Billing</h2>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-[10px] font-bold text-stone-500 hover:text-stone-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Shipping
                    </button>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Choose Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                            : 'bg-stone-900/40 border-stone-850 text-stone-400 hover:border-stone-800'
                        }`}
                      >
                        <span className="text-xl">💵</span>
                        <div>
                          <p className="text-xs font-bold font-serif">Cash on Delivery</p>
                          <p className="text-[9px] font-normal text-stone-400">Pay cash upon arrival</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                            : 'bg-stone-900/40 border-stone-850 text-stone-400 hover:border-stone-800'
                        }`}
                      >
                        <span className="text-xl">💳</span>
                        <div>
                          <p className="text-xs font-bold font-serif">Credit / Debit Card</p>
                          <p className="text-[9px] font-normal text-stone-400">Visa, MasterCard, Amex</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'cod' ? (
                    /* CASH ON DELIVERY DETAILS */
                    <div className="bg-stone-900/40 border border-amber-500/30 rounded-2xl p-6 space-y-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0">
                          🚚
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-100 text-sm font-serif">Cash on Delivery (COD) Enabled</h4>
                          <p className="text-xs text-stone-400">Our courier will collect cash payment at your door upon package arrival.</p>
                        </div>
                      </div>

                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-2 text-xs text-stone-300">
                        <div className="flex justify-between">
                          <span className="text-stone-500 font-bold uppercase text-[10px]">Contact Recipient:</span>
                          <span className="font-semibold text-amber-400">{shippingName || currentUser?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500 font-bold uppercase text-[10px]">Courier Phone Number:</span>
                          <span className="font-semibold text-amber-400">{shippingPhone || currentUser?.phone || 'Provided at Shipping'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500 font-bold uppercase text-[10px]">Delivery Address:</span>
                          <span className="font-semibold text-stone-300 truncate max-w-[200px]">{shippingAddress}, {shippingCity}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentStep('review')}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Confirm COD Order Details <ChevronRight className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ) : (
                    /* CREDIT CARD FORM */
                    <>
                      {/* 3D CREDIT CARD PREVIEW */}
                      <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1c1917] via-[#2e2a24] to-[#12100e] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative text-stone-200 select-none overflow-hidden h-48 flex flex-col justify-between font-sans">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start">
                          <span className="text-amber-500 text-xl font-serif tracking-widest font-bold">MN</span>
                          <span className="text-xs uppercase tracking-widest font-bold text-stone-400">
                            {getCardBrand(cardNumber)}
                          </span>
                        </div>

                        <div className="text-lg sm:text-xl font-mono tracking-[0.15em] text-stone-100 py-3">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex justify-between items-end text-xs uppercase tracking-wider font-semibold text-stone-400">
                          <div>
                            <span className="text-[8px] text-stone-500 block">Cardholder</span>
                            <span className="truncate max-w-[150px] inline-block font-sans">{cardName || currentUser?.name || 'NAME SURNAME'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-stone-500 block">Expires</span>
                            <span className="font-mono">{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {paymentError && (
                        <div className="bg-red-950/40 border border-red-500/30 text-red-200 text-xs p-3 rounded-lg text-center font-medium animate-pulse">
                          {paymentError}
                        </div>
                      )}

                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Cardholder Full Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Fatima Al-Suwaidi"
                            className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Card Number</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono tracking-wider"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Expiration Date</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono tracking-wider"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">CVV Code</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full bg-stone-950 border border-stone-900 rounded-lg py-2.5 px-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono tracking-widest"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 py-2 border-t border-stone-900 mt-4">
                          <input
                            id="same-address"
                            type="checkbox"
                            checked={isSameAddress}
                            onChange={() => setIsSameAddress(!isSameAddress)}
                            className="rounded border-stone-900 text-amber-500 focus:ring-amber-500 bg-stone-950 cursor-pointer"
                          />
                          <label htmlFor="same-address" className="text-xs text-stone-400 font-medium cursor-pointer">
                            Billing Address is same as Shipping Address
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          Review Order Details <ChevronRight className="w-4.5 h-4.5" />
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              )}

              {/* STEP 4: REVIEW & PLACE ORDER */}
              {currentStep === 'review' && (
                <motion.div
                  key="step-review"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="bg-stone-950 border border-stone-900 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                    <h2 className="text-xl font-bold font-serif text-amber-500">Review & Confirm</h2>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-[10px] font-bold text-stone-500 hover:text-stone-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Payment
                    </button>
                  </div>

                  <div className="space-y-6 divide-y divide-stone-900 text-xs">
                    {/* User Profile Info */}
                    <div className="py-1">
                      <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Customer Account</h4>
                      <p className="font-semibold text-stone-300">{currentUser?.name}</p>
                      <p className="text-stone-500 mt-0.5">{currentUser?.email}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-4">
                      <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Shipping Destination</h4>
                      <p className="font-semibold text-stone-300">{shippingName}</p>
                      <p className="text-stone-400 mt-1">{shippingAddress}</p>
                      <p className="text-stone-400">{shippingCity}, {shippingPostal}</p>
                      <p className="text-stone-400">{shippingCountry}</p>
                      <p className="text-stone-500 mt-1">Phone: {shippingPhone}</p>
                    </div>

                    {/* Payment Info */}
                    <div className="pt-4">
                      <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Billing Method</h4>
                      <div className="flex items-center gap-2 text-stone-300">
                        {paymentMethod === 'cod' ? (
                          <>
                            <span className="text-base">💵</span>
                            <span className="font-semibold text-amber-400">Cash on Delivery (COD)</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold">
                              {getCardBrand(cardNumber)} ending in {cardNumber.substring(cardNumber.length - 4)}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        {paymentMethod === 'cod' ? `Pay cash to courier upon arrival (${shippingName})` : `Cardholder: ${cardName || currentUser?.name}`}
                      </p>
                    </div>

                    {/* Security Declaration */}
                    <div className="pt-4 pb-2 bg-stone-900/10 p-3 rounded-xl border border-stone-900 flex gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-stone-400 font-light leading-relaxed">
                        By placing this order, your shipping address and contact details will be processed for immediate courier fulfillment. Live database sync will update the admin system.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-950/20"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        Logging order...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'cod' ? 'Confirm Cash on Delivery Order' : 'Place Order'} ({formatPrice(total)})
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* OUTCOME SUCCESS SCREEN */}
              {currentStep === 'success' && (
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-stone-950 border border-stone-900 rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto col-span-3 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-serif text-amber-500">Purchase Logged Successfully!</h2>
                    <p className="text-stone-400 text-sm font-light">
                      Thank you for your boutique purchase. The transaction details have been fully recorded in the database.
                    </p>
                  </div>

                  <div className="bg-stone-900/50 border border-stone-900 p-5 rounded-xl space-y-3 text-left max-w-sm mx-auto text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Order ID:</span>
                      <span className="font-mono text-stone-300 font-semibold">{orderId || 'ord_demo_123'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Client:</span>
                      <span className="text-stone-300 font-semibold">{currentUser?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Status:</span>
                      <span className="text-emerald-400 font-bold uppercase">Simulated Pending</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-850 pt-2 mt-2 font-bold text-sm">
                      <span className="text-stone-400">Paid Invoice:</span>
                      <span className="text-amber-400">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/"
                      className="px-6 py-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 font-semibold rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Return to Store
                    </Link>
                    {currentUser?.role === 'Admin' && (
                      <Link
                        href="/admin"
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer text-center"
                      >
                        Inspect in Admin Panel
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT ORDER SUMMARY SECTION */}
          {currentStep !== 'success' && (
            <div className="space-y-6">
              <div className="bg-stone-950 border border-stone-900 rounded-2xl p-6 space-y-6 font-sans">
                <h3 className="text-sm font-bold uppercase tracking-wider font-serif text-amber-500 border-b border-stone-900 pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4.5 h-4.5" /> Order Invoice Summary
                </h3>

                <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <p className="text-xs text-stone-500 py-4 text-center">No items selected.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3 text-xs">
                        <div className="w-10 h-12 bg-stone-900 rounded border border-stone-850 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product.image?.startsWith('/') || item.product.image?.startsWith('http') || item.product.image?.startsWith('data:') ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <span className="text-xl">{item.product.image || '👗'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-stone-300 truncate">{item.product.name}</h4>
                          <p className="text-stone-500 text-[10px] mt-0.5">Qty: {item.quantity}x • {formatPrice(item.product.price)}</p>
                        </div>
                        <span className="font-bold text-stone-400 shrink-0">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-stone-900 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-300">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>VAT Tax (5%)</span>
                    <span className="font-semibold text-stone-300">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-900 pt-3 text-sm font-bold">
                    <span className="text-stone-300">Total Invoice</span>
                    <span className="text-amber-400">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
