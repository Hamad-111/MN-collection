'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ClipboardList,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  TrendingUp,
  Banknote,
  Package,
  ShieldAlert,
  Filter,
  PlusCircle,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck
} from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { useToast } from '@/hooks/use-toast'
import { Product, User, Order } from '@/lib/store'
import { formatPrice, CURRENCY_SYMBOL } from '@/lib/utils'
import { openGmailDraft, sendAdminOrderNotificationEmail } from '@/lib/email-service'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

export default function AdminPage() {
  const { toast } = useToast()
  const {
    products,
    users,
    orders,
    activities,
    currentUser,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addUser,
    updateUser,
    deleteUser,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    refreshStore
  } = useStore()

  // Mounted state for SSR safe Portals
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Auto unlock admin portal if current logged-in user is an admin
  useEffect(() => {
    if (currentUser?.role === 'Admin' || currentUser?.email?.toLowerCase() === 'admin@mncollection.com') {
      setIsLoggedIn(true)
    }
  }, [currentUser])

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'orders'>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Product Modals & Search State
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('All')
  const [productPage, setProductPage] = useState(1)
  const productsPerPage = 8

  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Product Form State
  const [prodName, setProdName] = useState('')
  const [prodPrice, setProdPrice] = useState('')
  const [prodOriginalPrice, setProdOriginalPrice] = useState('')
  const [prodCategory, setProdCategory] = useState('Premium')
  const [prodDescription, setProdDescription] = useState('')
  const [prodBadge, setProdBadge] = useState('')
  const [prodImage, setProdImage] = useState('👗')

  // Image file upload handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImage(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // User Modals & Search State
  const [userSearch, setUserSearch] = useState('')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<User | null>(null)
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false)

  // User Form State
  const [usrName, setUsrName] = useState('')
  const [usrEmail, setUsrEmail] = useState('')
  const [usrRole, setUsrRole] = useState<'Admin' | 'User' | 'Staff'>('User')
  const [usrStatus, setUsrStatus] = useState<'Active' | 'Suspended'>('Active')
  const [usrAvatar, setUsrAvatar] = useState('')

  // Assign Order Form State (Inside User Detail Sheet)
  const [assignProductId, setAssignProductId] = useState<string>('')
  const [assignQuantity, setAssignQuantity] = useState(1)

  // Order Search & Filters
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('All')

  // Order Detail Sheet State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false)

  const handleOpenOrderSheet = (ord: Order) => {
    setSelectedOrder(ord)
    setIsOrderSheetOpen(true)
  }

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@mncollection.com' && (password === 'admin' || password === 'password123')) {
      await login('admin@mncollection.com', password || 'admin')
      setIsLoggedIn(true)
      setAuthError('')
    } else {
      const success = await login(email, password)
      if (success) {
        setIsLoggedIn(true)
        setAuthError('')
      } else {
        setAuthError('Invalid credentials. Access restricted.')
      }
    }
  }

  const handleDemoLogin = async () => {
    await login('admin@mncollection.com', 'admin')
    setIsLoggedIn(true)
    setAuthError('')
  }

  const handleSignOut = async () => {
    await logout()
    setIsLoggedIn(false)
  }

  // Dashboard Aggregates
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0)
  }, [orders])

  const totalUsersCount = useMemo(() => users.filter((u) => u.role === 'User').length, [users])

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const baseRevenue = { Jan: 1500, Feb: 1800, Mar: 2400, Apr: 2900, May: 3500, Jun: 3800 }
    
    // Group active orders by month
    const grouped = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((acc, order) => {
        const d = new Date(order.date)
        const m = d.toLocaleString('default', { month: 'short' })
        acc[m] = (acc[m] || 0) + order.totalPrice
        return acc
      }, {} as Record<string, number>)

    return months.map((m) => ({
      name: m,
      Revenue: (baseRevenue[m as keyof typeof baseRevenue] || 0) + (grouped[m] || 0)
    }))
  }, [orders])

  const categoryChartData = useMemo(() => {
    const counts = products.reduce((acc, prod) => {
      acc[prod.category] = (acc[prod.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }))
  }, [products])

  const colors = ['#d97706', '#f59e0b', '#fbbf24', '#fef08a', '#eab308']

  // Products filtering & pagination
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                            p.description.toLowerCase().includes(productSearch.toLowerCase())
      const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, productSearch, productCategoryFilter])

  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * productsPerPage
    return filteredProducts.slice(start, start + productsPerPage)
  }, [filteredProducts, productPage])

  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage) || 1

  // Users filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      return (
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    })
  }, [users, userSearch])

  // Orders filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const user = users.find((u) => u.id === o.userId)
      const product = products.find((p) => p.id === o.productId)
      const matchesSearch = (user?.name || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
                            (product?.name || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.id.toLowerCase().includes(orderSearch.toLowerCase())
      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, users, products, orderSearch, orderStatusFilter])

  // Product Form Actions
  const handleOpenAddProduct = () => {
    setProdName('')
    setProdPrice('')
    setProdOriginalPrice('')
    setProdCategory('Premium')
    setProdDescription('')
    setProdBadge('')
    setProdImage('👗')
    setIsAddProductOpen(true)
  }

  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prodName || !prodPrice || isSubmittingProduct) return
    setIsSubmittingProduct(true)
    try {
      await addProduct({
        name: prodName,
        price: parseFloat(prodPrice),
        originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
        category: prodCategory,
        description: prodDescription,
        badge: prodBadge || undefined,
        image: prodImage
      })
      setIsAddProductOpen(false)
    } finally {
      setIsSubmittingProduct(false)
    }
  }

  const handleOpenEditProduct = (prod: Product) => {
    setSelectedProduct(prod)
    setProdName(prod.name)
    setProdPrice(prod.price.toString())
    setProdOriginalPrice(prod.originalPrice?.toString() || '')
    setProdCategory(prod.category)
    setProdDescription(prod.description)
    setProdBadge(prod.badge || '')
    setProdImage(prod.image || '👗')
    setIsEditProductOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !prodName || !prodPrice || isSubmittingProduct) return
    setIsSubmittingProduct(true)
    try {
      await updateProduct({
        ...selectedProduct,
        name: prodName,
        price: parseFloat(prodPrice),
        originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
        category: prodCategory,
        description: prodDescription,
        badge: prodBadge || undefined,
        image: prodImage
      })
      setIsEditProductOpen(false)
    } finally {
      setIsSubmittingProduct(false)
    }
  }

  const handleOpenDeleteProduct = (prod: Product) => {
    setSelectedProduct(prod)
    setIsDeleteProductOpen(true)
  }

  const handleDeleteProductConfirm = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id)
      setIsDeleteProductOpen(false)
      setSelectedProduct(null)
    }
  }

  // User Form Actions
  const handleOpenAddUser = () => {
    setUsrName('')
    setUsrEmail('')
    setUsrRole('User')
    setUsrStatus('Active')
    setUsrAvatar('')
    setIsAddUserOpen(true)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usrName || !usrEmail || isSubmittingUser) return
    setIsSubmittingUser(true)
    try {
      await addUser({
        name: usrName,
        email: usrEmail,
        role: usrRole,
        status: usrStatus,
        avatar: usrAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      })
      setIsAddUserOpen(false)
    } finally {
      setIsSubmittingUser(false)
    }
  }

  const handleToggleUserStatus = (user: User) => {
    updateUser({
      ...user,
      status: user.status === 'Active' ? 'Suspended' : 'Active'
    })
  }

  const handleOpenDeleteUser = (user: User) => {
    setSelectedUserToDelete(user)
    setIsDeleteUserOpen(true)
  }

  const handleDeleteUserConfirm = () => {
    if (selectedUserToDelete) {
      deleteUser(selectedUserToDelete.id)
      setIsDeleteUserOpen(false)
      setSelectedUserToDelete(null)
    }
  }

  const handleOpenUserSheet = (user: User) => {
    setSelectedUser(user)
    setAssignProductId('')
    setAssignQuantity(1)
    setIsUserSheetOpen(true)
  }

  const handleAssignProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !assignProductId) return
    addOrder({
      userId: selectedUser.id,
      productId: parseInt(assignProductId),
      quantity: assignQuantity,
      status: 'Delivered'
    })
    // Reset inputs
    setAssignProductId('')
    setAssignQuantity(1)
  }

  // Get purchases for active selected user
  const selectedUserOrders = useMemo(() => {
    if (!selectedUser) return []
    return orders.filter((o) => o.userId === selectedUser.id)
  }, [orders, selectedUser])

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-stone-900 font-sans antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* LUXURY LOGIN SCREEN */
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#fbf9f5] via-[#f5f1eb] to-[#fef3c7]/40 relative"
          >
            {/* Background design elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative z-10">
              <div className="text-center">
                <img src="/logo.png" alt="MN Collection" className="w-20 h-auto mx-auto mb-2 object-contain drop-shadow-md" />
                <h2 className="mt-4 text-3xl font-bold font-serif tracking-tight text-amber-900">
                  MN Collection
                </h2>
                <p className="mt-2 text-sm text-stone-600 font-sans font-medium uppercase tracking-widest">
                  Administrative Workspace
                </p>
              </div>

              <div className="mt-8 bg-white border border-stone-200 p-8 rounded-2xl shadow-xl shadow-amber-950/5">
                <form className="space-y-6" onSubmit={handleLogin}>
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg flex items-center gap-2 font-medium">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mncollection.com"
                      className="w-full bg-white border border-stone-300 rounded-lg py-2.5 px-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 transition-colors text-sm shadow-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Secret Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-stone-300 rounded-lg py-2.5 px-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 transition-colors text-sm shadow-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer"
                    >
                      Authenticate Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ROYAL ADMIN PANEL WORKSPACE */
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen bg-[#fcfaf6]"
          >
            {/* SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 py-6 px-4 justify-between shrink-0 shadow-xs">
              <div className="space-y-8">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2">
                  <img src="/logo.png" alt="MN Collection" className="w-9 h-auto object-contain" />
                  <div>
                    <h1 className="font-serif font-bold tracking-wider text-amber-900 text-lg">
                      MN Admin
                    </h1>
                    <p className="text-[9px] text-stone-500 uppercase tracking-widest font-bold mt-0.5">
                      Collection Panel
                    </p>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'products', label: 'Products', icon: ShoppingBag },
                    { id: 'users', label: 'Users & Products', icon: Users },
                    { id: 'orders', label: 'Orders & Logs', icon: ClipboardList }
                  ].map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-700 pl-3.5 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Logout */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                Sign Out
              </button>
            </aside>

            {/* MAIN CONTAINER */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* TOP HEADER */}
              <header className="h-16 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 flex items-center justify-between z-10 shrink-0 shadow-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-stone-100 rounded-lg text-stone-700"
                  >
                    👑
                  </button>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-amber-900 font-serif">
                    {activeTab === 'dashboard' && 'Dashboard Overview'}
                    {activeTab === 'products' && 'Product Control Index'}
                    {activeTab === 'users' && 'User Profiles & Assigned Products'}
                    {activeTab === 'orders' && 'Transactional Logs & Order Management'}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      await refreshStore()
                      toast({
                        title: 'Real-Time Sync Complete! 🔄',
                        description: 'Imported latest database users, orders, and products.',
                      })
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    title="Fetch latest database records"
                  >
                    🔄 Sync Real-Time Data
                  </button>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800">
                      Live Supabase Sync
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-bold text-stone-900">{currentUser?.name || 'Hamad Khan (CEO)'}</p>
                      <p className="text-[9px] text-amber-800 uppercase font-extrabold tracking-wider">
                        {currentUser?.role === 'Admin' ? 'Super Administrator' : currentUser?.role || 'Administrator'}
                      </p>
                    </div>
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-amber-300 object-cover shadow-xs"
                    />
                  </div>
                </div>
              </header>

              {/* MOBILE MENU DROPDOWN */}
              {isMobileMenuOpen && (
                <div className="md:hidden bg-stone-950 border-b border-stone-900 px-4 py-4 space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'products', label: 'Products', icon: ShoppingBag },
                    { id: 'users', label: 'Users & Products', icon: Users },
                    { id: 'orders', label: 'Orders & Logs', icon: ClipboardList }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                        activeTab === tab.id ? 'bg-amber-500/10 text-amber-400' : 'text-stone-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* CONTENT AREA */}
              <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'dashboard' && (
                    /* TAB 1: DASHBOARD OVERVIEW */
                    <motion.div
                      key="dashboard-tab"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="space-y-8"
                    >
                      {/* STATS ROW */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          {
                            label: 'Total Revenue',
                            value: formatPrice(totalRevenue),
                            desc: 'Cumulative completed orders',
                            icon: Banknote,
                            color: 'text-amber-500'
                          },
                          {
                            label: 'Product Count',
                            value: products.length,
                            desc: 'Active boutique inventory',
                            icon: Package,
                            color: 'text-yellow-500'
                          },
                          {
                            label: 'Active Users',
                            value: totalUsersCount,
                            desc: 'Registered customers',
                            icon: Users,
                            color: 'text-amber-600'
                          },
                          {
                            label: 'Sales Volume',
                            value: orders.length,
                            desc: 'Simulated customer orders',
                            icon: TrendingUp,
                            color: 'text-yellow-600'
                          }
                        ].map((stat, idx) => {
                          const Icon = stat.icon
                          return (
                            <div
                              key={idx}
                              className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs hover:border-amber-400/80 transition-all flex items-center justify-between"
                            >
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                                  {stat.label}
                                </p>
                                <h3 className="text-2xl font-bold font-serif text-stone-900">{stat.value}</h3>
                                <p className="text-[10px] text-stone-500 font-medium">{stat.desc}</p>
                              </div>
                              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 shadow-xs">
                                <Icon className="w-5 h-5" />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* CHARTS CONTAINER */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Area Chart */}
                        <div className="lg:col-span-2 bg-white border border-stone-200 p-6 rounded-2xl shadow-xs">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-widest font-serif text-amber-900">
                                Revenue Curve
                              </h4>
                              <p className="text-xs text-stone-600 font-medium">Overview of dynamic store turnover</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              +12.4% MoM
                            </div>
                          </div>

                          <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#b45309" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#78716c" fontSize={10} tickLine={false} />
                                <YAxis stroke="#78716c" fontSize={10} tickLine={false} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d6d3d1',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    color: '#1c1917',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="Revenue"
                                  stroke="#b45309"
                                  strokeWidth={2}
                                  fillOpacity={1}
                                  fill="url(#colorRevenue)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs">
                          <h4 className="text-sm font-bold uppercase tracking-widest font-serif text-amber-900 mb-2">
                            Product Categorization
                          </h4>
                          <p className="text-xs text-stone-600 font-medium mb-6">Distribution by luxury category</p>

                          <div className="h-64 w-full flex items-center justify-center">
                            {categoryChartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryChartData}>
                                  <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                                  <XAxis dataKey="name" stroke="#78716c" fontSize={10} tickLine={false} />
                                  <YAxis stroke="#78716c" fontSize={10} tickLine={false} allowDecimals={false} />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: '#ffffff',
                                      border: '1px solid #d6d3d1',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      color: '#1c1917',
                                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                  />
                                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {categoryChartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <p className="text-xs text-stone-500">No category data available</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RECENT ACTIVITIES LOG */}
                      <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs">
                        <div className="flex items-center gap-2 mb-6">
                          <Clock className="w-5 h-5 text-amber-700" />
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest font-serif text-amber-900">
                              System Audit Log
                            </h4>
                            <p className="text-xs text-stone-600 font-medium">Track operations and simulated activity logs</p>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                          {activities.length > 0 ? (
                            activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-start justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs hover:border-amber-300 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {act.type === 'product' && '🛍️'}
                                    {act.type === 'user' && '👤'}
                                    {act.type === 'order' && '💸'}
                                    {act.type === 'system' && '⚙️'}
                                  </span>
                                  <div>
                                    <p className="text-stone-900 font-bold">{act.message}</p>
                                    <p className="text-[10px] text-stone-500 mt-0.5 font-medium">
                                      ID: {act.id} • Type: {act.type}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-stone-500 font-sans shrink-0 font-bold ml-4">
                                  {new Date(act.time).toLocaleTimeString()}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-stone-500 text-center py-8">No logged actions recorded</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'products' && (
                    /* TAB 2: PRODUCTS MANAGEMENT */
                    <motion.div
                      key="products-tab"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="space-y-6"
                    >
                      {/* Controls header */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                          {/* Search */}
                          <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            <input
                              type="text"
                              placeholder="Search products..."
                              value={productSearch}
                              onChange={(e) => {
                                setProductSearch(e.target.value)
                                setProductPage(1)
                              }}
                              className="w-full pl-9 pr-3 bg-white border border-stone-300 rounded-xl py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs transition-colors"
                            />
                          </div>

                          {/* Category Filter */}
                          <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            <select
                              value={productCategoryFilter}
                              onChange={(e) => {
                                setProductCategoryFilter(e.target.value)
                                setProductPage(1)
                              }}
                              className="pl-9 pr-8 bg-white border border-stone-300 rounded-xl py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs transition-colors appearance-none cursor-pointer"
                            >
                              <option value="All">All Categories</option>
                              <option value="Premium">Premium</option>
                              <option value="Formal">Formal</option>
                              <option value="Casual">Casual</option>
                              <option value="Accessories">Accessories</option>
                              <option value="Men Collection">Men Collection</option>
                            </select>
                          </div>
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={handleOpenAddProduct}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Product
                        </button>
                      </div>

                      {/* PRODUCTS TABLE */}
                      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#f6f2ec] border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-widest">
                                <th className="py-4 px-6">Product</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6 text-right">Original Price</th>
                                <th className="py-4 px-6 text-right">Retail Price</th>
                                <th className="py-4 px-6">Badge</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-xs">
                              {paginatedProducts.length > 0 ? (
                                paginatedProducts.map((prod) => (
                                  <tr key={prod.id} className="hover:bg-amber-50/40 transition-colors">
                                    <td className="py-4.5 px-6 font-medium">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0 overflow-hidden shadow-xs">
                                          {prod.image?.startsWith('data:') || prod.image?.startsWith('http') || prod.image?.startsWith('/') ? (
                                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                          ) : (
                                            prod.image || '👗'
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-stone-900 font-bold line-clamp-1">{prod.name}</p>
                                          <p className="text-[10px] text-stone-500 font-medium mt-0.5 line-clamp-1">{prod.description}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4.5 px-6">
                                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[9px] uppercase tracking-wider">
                                        {prod.category}
                                      </span>
                                    </td>
                                    <td className="py-4.5 px-6 text-right font-medium text-stone-400 line-through">
                                      {prod.originalPrice ? formatPrice(prod.originalPrice) : '—'}
                                    </td>
                                    <td className="py-4.5 px-6 text-right font-bold text-amber-800">
                                      {formatPrice(prod.price)}
                                    </td>
                                    <td className="py-4.5 px-6">
                                      {prod.badge ? (
                                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-bold uppercase tracking-wider">
                                          {prod.badge}
                                        </span>
                                      ) : (
                                        <span className="text-stone-400">—</span>
                                      )}
                                    </td>
                                    <td className="py-4.5 px-6">
                                      <div className="flex justify-center items-center gap-2">
                                        <button
                                          onClick={() => handleOpenEditProduct(prod)}
                                          className="p-1.5 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-lg border border-stone-200 transition-colors text-stone-700 cursor-pointer shadow-xs"
                                          title="Modify details"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleOpenDeleteProduct(prod)}
                                          className="p-1.5 bg-stone-100 hover:bg-red-100 hover:text-red-700 rounded-lg border border-stone-200 transition-colors text-stone-700 cursor-pointer shadow-xs"
                                          title="Remove product"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={6} className="py-12 text-center text-stone-500">
                                    No products found matching filters
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* PAGINATION PANEL */}
                        {totalProductPages > 1 && (
                          <div className="border-t border-stone-200 px-6 py-4 flex items-center justify-between text-xs bg-stone-50">
                            <span className="text-stone-600 font-medium">
                              Showing Page {productPage} of {totalProductPages} ({filteredProducts.length} items)
                            </span>
                            <div className="flex gap-2">
                              <button
                                disabled={productPage === 1}
                                onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
                                className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors text-stone-700 cursor-pointer shadow-xs"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                disabled={productPage === totalProductPages}
                                onClick={() => setProductPage((p) => Math.min(p + 1, totalProductPages))}
                                className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors text-stone-700 cursor-pointer shadow-xs"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'users' && (
                    /* TAB 3: USER PROFILES & PURCHASES */
                    <motion.div
                      key="users-tab"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                          <input
                            type="text"
                            placeholder="Search accounts..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full pl-9 pr-3 bg-stone-950 border border-stone-900 hover:border-stone-800 rounded-xl py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                          />
                        </div>

                        {/* Add User */}
                        <button
                          onClick={handleOpenAddUser}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-4.5 h-4.5" />
                          Add User Account
                        </button>
                      </div>

                      {/* USERS TABLE */}
                      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#f6f2ec] border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-widest">
                                <th className="py-4 px-6">User Account</th>
                                <th className="py-4 px-6">Email Address</th>
                                <th className="py-4 px-6">Role</th>
                                <th className="py-4 px-6">Account Status</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-xs">
                              {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                  <tr key={user.id} className="hover:bg-amber-50/40 transition-colors">
                                    <td className="py-4 px-6 font-medium">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={user.avatar}
                                          alt={user.name}
                                          className="w-9 h-9 rounded-full border border-stone-300 bg-stone-100 object-cover shrink-0 shadow-xs"
                                        />
                                        <p className="text-stone-900 font-bold">{user.name}</p>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 text-stone-600 font-medium">
                                      {user.email}
                                    </td>
                                    <td className="py-4 px-6">
                                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                        user.role === 'Admin' 
                                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                          : user.role === 'Staff'
                                          ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                                          : 'bg-stone-100 border border-stone-200 text-stone-700'
                                      }`}>
                                        {user.role}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                        {user.status}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                                      <div className="flex justify-center items-center gap-2">
                                        {/* Toggle Active/Suspended */}
                                        {user.role !== 'Admin' && (
                                          <>
                                            <button
                                              onClick={() => handleToggleUserStatus(user)}
                                              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg transition-colors cursor-pointer border shadow-xs ${
                                                user.status === 'Active'
                                                  ? 'bg-stone-100 hover:bg-red-100 text-stone-700 border-stone-300 hover:border-red-300 hover:text-red-800'
                                                  : 'bg-stone-100 hover:bg-emerald-100 text-amber-900 border-stone-300 hover:border-emerald-300 hover:text-emerald-900'
                                              }`}
                                            >
                                              {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                            </button>
                                            <button
                                              onClick={() => handleOpenDeleteUser(user)}
                                              className="p-1.5 bg-stone-100 hover:bg-red-100 hover:text-red-700 rounded-lg border border-stone-200 transition-colors text-stone-700 cursor-pointer shadow-xs"
                                              title="Delete user account"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </>
                                        )}

                                        {/* Open detailed sheet */}
                                        <button
                                          onClick={() => handleOpenUserSheet(user)}
                                          className="text-[10px] font-bold tracking-wider uppercase bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition-colors cursor-pointer border border-transparent shadow-xs"
                                        >
                                          Purchases
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-stone-500 font-medium">
                                    No accounts registered
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'orders' && (
                    /* TAB 4: ORDERS & TRANSACTIONS LOG */
                    <motion.div
                      key="orders-tab"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                          {/* Search */}
                          <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            <input
                              type="text"
                              placeholder="Search orders, clients..."
                              value={orderSearch}
                              onChange={(e) => setOrderSearch(e.target.value)}
                              className="w-full pl-9 pr-3 bg-white border border-stone-300 rounded-xl py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs transition-colors"
                            />
                          </div>

                          {/* Status Filter */}
                          <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            <select
                              value={orderStatusFilter}
                              onChange={(e) => setOrderStatusFilter(e.target.value)}
                              className="pl-9 pr-8 bg-white border border-stone-300 rounded-xl py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs transition-colors appearance-none cursor-pointer"
                            >
                              <option value="All">All Orders</option>
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* ORDERS TABLE */}
                      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#f6f2ec] border-b border-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-widest">
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Product Ordered</th>
                                <th className="py-4 px-6 text-center">Quantity</th>
                                <th className="py-4 px-6 text-right">Invoice Sum</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-xs">
                              {filteredOrders.length > 0 ? (
                                filteredOrders.map((ord) => {
                                  const user = users.find((u) => u.id === ord.userId)
                                  const product = products.find((p) => p.id === ord.productId)
                                  return (
                                    <tr key={ord.id} className="hover:bg-amber-50/40 transition-colors">
                                      <td className="py-4 px-6 font-mono text-stone-500 font-bold text-[10px]">
                                        #{ord.id}
                                      </td>
                                      <td className="py-4 px-6 font-medium">
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                                            alt={user?.name || ord.shippingDetails?.name || 'Customer'}
                                            className="w-6.5 h-6.5 rounded-full border border-stone-300 bg-stone-100 object-cover shadow-xs"
                                          />
                                          <span className="text-stone-900 font-bold">
                                            {user?.name || ord.shippingDetails?.name || 'Customer'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-4 px-6 font-semibold">
                                        {product ? (
                                          <div className="flex items-center gap-2">
                                            <span className="text-base">{product.image || '👗'}</span>
                                            <span className="text-stone-900 font-bold">{product.name}</span>
                                          </div>
                                        ) : (
                                          <span className="text-stone-400">Deleted Product</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-center font-bold text-stone-700">
                                        {ord.quantity}x
                                      </td>
                                      <td className="py-4 px-6 text-right font-bold text-amber-800">
                                        {formatPrice(ord.totalPrice)}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                          ord.status === 'Delivered'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                            : ord.status === 'Shipped'
                                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                                            : ord.status === 'Pending'
                                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                            : 'bg-red-50 text-red-800 border-red-200'
                                        }`}>
                                          {ord.status}
                                        </span>
                                      </td>
                                      <td className="py-4 px-6">
                                        <div className="flex justify-center items-center gap-2">
                                          <button
                                            onClick={() => handleOpenOrderSheet(ord)}
                                            className="text-[9px] font-bold tracking-wider uppercase bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
                                          >
                                            Details
                                          </button>
                                          <select
                                            value={ord.status}
                                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                                            className="bg-white border border-stone-300 hover:border-amber-500 rounded-lg py-1 px-2 text-[10px] font-bold text-amber-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                                          >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                          </select>
                                          <button
                                            onClick={() => deleteOrder(ord.id)}
                                            className="p-1 hover:bg-red-50 hover:text-red-700 rounded-lg border border-stone-200 transition-colors text-stone-500 cursor-pointer shadow-xs"
                                            title="Delete record"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              ) : (
                                <tr>
                                  <td colSpan={7} className="py-12 text-center text-stone-600">
                                    No transaction records found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PORTALS FOR OVERLAYS & MODALS */}
      {mounted && createPortal(
        <>
          {/* SLIDE-OUT DETAIL PANEL FOR USER'S PRODUCTS */}
          <AnimatePresence>
            {isUserSheetOpen && selectedUser && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsUserSheetOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50"
                />

                {/* Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-stone-200 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto text-stone-900"
                >
                  <div>
                    {/* Close */}
                    <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
                      <h3 className="text-base font-bold uppercase tracking-wider font-serif text-amber-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-700" />
                        Client Product Portfolio
                      </h3>
                      <button
                        onClick={() => setIsUserSheetOpen(false)}
                        className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-4 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl mb-8 shadow-xs">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-12 h-12 rounded-full border border-amber-300 object-cover shadow-xs"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{selectedUser.name}</h4>
                        <p className="text-xs text-stone-600 font-medium">{selectedUser.email}</p>
                        <p className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider mt-1">
                          Status: {selectedUser.status}
                        </p>
                      </div>
                    </div>

                    {/* Purchased Products List */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif">
                        Purchased Products
                      </h5>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {selectedUserOrders.length > 0 ? (
                          selectedUserOrders.map((ord) => {
                            const product = products.find((p) => p.id === ord.productId)
                            return (
                              <div
                                key={ord.id}
                                className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between hover:border-amber-300 transition-colors text-xs shadow-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{product?.image || '👗'}</span>
                                  <div>
                                    <p className="text-stone-900 font-bold">{product?.name || 'Deleted Product'}</p>
                                    <p className="text-[10px] text-stone-500 font-medium mt-0.5">
                                      Qty: {ord.quantity}x • Price: {formatPrice(product?.price || 0)} • Date: {new Date(ord.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-amber-800">{formatPrice(ord.totalPrice)}</span>
                                  <button
                                    onClick={() => deleteOrder(ord.id)}
                                    className="p-1.5 hover:bg-red-100 hover:text-red-700 border border-stone-200 rounded-lg transition-colors text-stone-400 cursor-pointer"
                                    title="Revoke purchase"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-xs text-stone-500 py-6 text-center">
                            No products assigned/purchased by this user.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ASSIGN PRODUCT WORKFLOW */}
                    <div className="mt-8 border-t border-stone-200 pt-6">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif mb-4 flex items-center gap-2">
                        <PlusCircle className="w-4.5 h-4.5 text-amber-700" />
                        Simulate Product Purchase
                      </h5>

                      <form onSubmit={handleAssignProduct} className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Select Product</label>
                            <select
                              required
                              value={assignProductId}
                              onChange={(e) => setAssignProductId(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 appearance-none cursor-pointer shadow-xs"
                            >
                              <option value="">Choose item...</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({formatPrice(p.price)})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Quantity</label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={assignQuantity}
                              onChange={(e) => setAssignQuantity(parseInt(e.target.value))}
                              className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={!assignProductId || selectedUser.status === 'Suspended'}
                          className="w-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-widest disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm"
                        >
                          Assign purchase to account
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-4 mt-6">
                    <button
                      onClick={() => setIsUserSheetOpen(false)}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer text-center border border-stone-300 shadow-xs"
                    >
                      Close Portfolio
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* SLIDE-OUT DETAIL PANEL FOR ORDER DETAILS */}
          <AnimatePresence>
            {isOrderSheetOpen && selectedOrder && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOrderSheetOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50"
                />

                {/* Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-stone-200 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto text-stone-900"
                >
                  <div>
                    {/* Close Header */}
                    <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
                      <h3 className="text-base font-bold uppercase tracking-wider font-serif text-amber-900 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-amber-700" />
                        Transaction Order Details
                      </h3>
                      <button
                        onClick={() => setIsOrderSheetOpen(false)}
                        className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Order general info */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-stone-50 p-4 border border-stone-200 rounded-xl text-xs shadow-xs">
                        <div>
                          <p className="text-stone-500 font-bold uppercase tracking-wider text-[9px]">Order ID</p>
                          <p className="font-mono text-amber-900 font-bold text-sm mt-0.5">#{selectedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 font-bold uppercase tracking-wider text-[9px]">Date Placed</p>
                          <p className="text-stone-800 font-semibold mt-0.5">{new Date(selectedOrder.date).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Interactive Status & Delete Controls inside sheet */}
                      <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-amber-50/40">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-serif">Order Status & Operations</h4>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs text-stone-600 font-medium">Status:</span>
                            <select
                              value={selectedOrder.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as Order['status']
                                updateOrderStatus(selectedOrder.id, newStatus)
                                setSelectedOrder({ ...selectedOrder, status: newStatus })
                              }}
                              className="bg-white border border-stone-300 rounded-lg py-1.5 px-3 text-xs font-bold text-amber-900 focus:outline-none focus:border-amber-600 cursor-pointer shadow-xs"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              deleteOrder(selectedOrder.id)
                              setIsOrderSheetOpen(false)
                              setSelectedOrder(null)
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Order
                          </button>
                        </div>
                      </div>

                      {/* Customer */}
                      <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white shadow-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif">Customer Details</h4>
                        {(() => {
                          const user = users.find((u) => u.id === selectedOrder.userId)
                          const name = user?.name || selectedOrder.shippingDetails?.name || 'Customer'
                          const email = user?.email || 'customer@mncollection.com'
                          const avatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          return (
                            <div className="flex items-center gap-3">
                              <img src={avatar} alt={name} className="w-10 h-10 rounded-full border border-stone-300 object-cover shadow-xs" />
                              <div>
                                <p className="text-stone-900 font-bold text-xs">{name}</p>
                                <p className="text-stone-500 text-[11px] font-medium">{email}</p>
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Product info */}
                      <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white shadow-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif">Product Purchased</h4>
                        {(() => {
                          const product = products.find((p) => p.id === selectedOrder.productId)
                          return product ? (
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{product.image || '👗'}</span>
                                <div>
                                  <p className="text-stone-900 font-bold">{product.name}</p>
                                  <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">{product.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-stone-700 font-bold">{selectedOrder.quantity}x @ {formatPrice(product.price)}</p>
                                <p className="text-amber-800 font-extrabold mt-0.5">Total: {formatPrice(selectedOrder.totalPrice)}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-stone-500 text-xs">Deleted boutique item</p>
                          )
                        })()}
                      </div>

                      {/* Shipping details */}
                      <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white shadow-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif">Shipping Destination</h4>
                        {selectedOrder.shippingDetails ? (
                          <div className="text-xs text-stone-800 space-y-1.5 leading-relaxed font-sans font-medium">
                            <p><span className="text-stone-500 font-bold uppercase tracking-widest text-[9px] mr-2">Recipient:</span> {selectedOrder.shippingDetails.name}</p>
                            <p><span className="text-stone-500 font-bold uppercase tracking-widest text-[9px] mr-2">Street:</span> {selectedOrder.shippingDetails.address}</p>
                            <p><span className="text-stone-500 font-bold uppercase tracking-widest text-[9px] mr-2">Location:</span> {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.postalCode}</p>
                            <p><span className="text-stone-500 font-bold uppercase tracking-widest text-[9px] mr-2">Country:</span> {selectedOrder.shippingDetails.country}</p>
                            <p><span className="text-stone-500 font-bold uppercase tracking-widest text-[9px] mr-2">Contact:</span> {selectedOrder.shippingDetails.phone}</p>
                          </div>
                        ) : (
                          <p className="text-stone-500 text-xs italic">No shipping details provided (Simulated Order).</p>
                        )}
                      </div>

                      {/* Payment details */}
                      <div className="border border-amber-200/80 rounded-xl p-4 space-y-3 bg-[#fdfbf7] shadow-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-serif flex items-center justify-between">
                          <span>Billing Method & Saved Credentials</span>
                          {selectedOrder.paymentDetails?.cardNumber && (
                            <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                              💳 Card Saved
                            </span>
                          )}
                        </h4>
                        {selectedOrder.paymentDetails ? (
                          <div className="text-xs text-stone-800 space-y-2 font-sans font-medium">
                            <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-stone-200">
                              <span className="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Cardholder Name:</span>
                              <span className="font-semibold text-stone-900">{selectedOrder.paymentDetails.cardholderName}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-stone-200">
                              <span className="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Payment Gateway / Brand:</span>
                              <span className="font-semibold text-amber-800">{selectedOrder.paymentDetails.brand}</span>
                            </div>
                            {selectedOrder.paymentDetails.cardNumber ? (
                              <>
                                <div className="flex justify-between items-center bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                                  <span className="text-amber-900 font-bold uppercase tracking-widest text-[9px]">Full Card Number:</span>
                                  <span className="font-mono font-bold text-amber-900 text-sm tracking-wider">{selectedOrder.paymentDetails.cardNumber}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-stone-200">
                                    <span className="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Expiry (MM/YY):</span>
                                    <span className="font-mono font-bold text-stone-900">{selectedOrder.paymentDetails.cardExpiry}</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-stone-200">
                                    <span className="text-stone-500 font-bold uppercase tracking-widest text-[9px]">CVV Code:</span>
                                    <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">{selectedOrder.paymentDetails.cardCvv}</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-stone-200">
                                <span className="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Card Ending:</span>
                                <span className="font-mono font-bold text-stone-800">•••• •••• •••• {selectedOrder.paymentDetails.last4}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-stone-500 text-xs italic">No payment details provided (Simulated Order).</p>
                        )}
                      </div>

                      {/* Admin Gmail Notification */}
                      <div className="border border-amber-300 bg-amber-50/80 rounded-xl p-4 space-y-2 shadow-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-serif flex items-center gap-1.5">
                          📧 Admin Gmail Alert Status
                        </h4>
                        <p className="text-[11px] text-stone-700 font-medium">
                          Notifications for this order are routed to <code className="text-amber-900 bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">mncollection09@gmail.com</code>.
                        </p>
                        <button
                          onClick={() => {
                            const u = users.find((usr) => usr.id === selectedOrder.userId)
                            const p = products.find((prd) => prd.id === selectedOrder.productId)
                            const payload = sendAdminOrderNotificationEmail(selectedOrder, u, p)
                            openGmailDraft(payload)
                          }}
                          className="w-full mt-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-2.5 px-3 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer text-center shadow-sm"
                        >
                          ✉️ Open Gmail Draft to mncollection09@gmail.com
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-4 mt-6">
                    <button
                      onClick={() => setIsOrderSheetOpen(false)}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer text-center font-sans border border-stone-300 shadow-xs"
                    >
                      Close Details
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ADD PRODUCT MODAL */}
          <AnimatePresence>
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAddProductOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl z-10 space-y-6 text-stone-900"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-serif text-amber-900">
                      Upload boutique item
                    </h3>
                    <button
                      onClick={() => setIsAddProductOpen(false)}
                      className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Product Name</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="e.g. Royal Gold Abaya"
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Retail Price ({CURRENCY_SYMBOL})</label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="e.g. 199.99"
                          className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Original Price ({CURRENCY_SYMBOL})</label>
                        <input
                          type="number"
                          step="0.01"
                          value={prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value)}
                          placeholder="e.g. 249.99"
                          className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Category</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                        >
                          <option value="Premium">Premium</option>
                          <option value="Formal">Formal</option>
                          <option value="Casual">Casual</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Men Collection">Men Collection</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Product Image / Representation</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="add-prod-file"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="add-prod-file"
                              className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-amber-900 text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 font-bold transition-colors shadow-xs"
                            >
                              📁 Upload Image File
                            </label>
                            <span className="text-[10px] text-stone-500 font-mono font-medium truncate max-w-[160px]">
                              {prodImage.startsWith('data:') ? 'Local File Attached' : prodImage.startsWith('http') || prodImage.startsWith('/') ? 'URL Linked' : 'Preset Emoji'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={prodImage.startsWith('data:') || prodImage.startsWith('http') || prodImage.startsWith('/') ? 'custom' : prodImage}
                              onChange={(e) => {
                                if (e.target.value !== 'custom') setProdImage(e.target.value)
                              }}
                              className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                            >
                              <option value="👗">👗 Dress / Abaya</option>
                              <option value="👔">👔 Formal Suit</option>
                              <option value="👕">👕 Casual Tee</option>
                              <option value="💎">💎 Accessory Gem</option>
                              <option value="👜">👜 Handbag</option>
                              <option value="👢">👢 High Boot</option>
                              <option value="custom">✨ Custom File / Link</option>
                            </select>

                            <input
                              type="text"
                              value={prodImage}
                              onChange={(e) => setProdImage(e.target.value)}
                              placeholder="Or paste Image URL..."
                              className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                            />
                          </div>

                          {/* Preview box */}
                          <div className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Preview:</span>
                            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                              {prodImage.startsWith('data:') || prodImage.startsWith('http') || prodImage.startsWith('/') ? (
                                <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">{prodImage || '👗'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Ribbon Tag / Badge</label>
                      <input
                        type="text"
                        value={prodBadge}
                        onChange={(e) => setProdBadge(e.target.value)}
                        placeholder="e.g. New, Sale, Limited (Optional)"
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Description</label>
                      <textarea
                        rows={3}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        placeholder="Craftsmanship, material quality, cut details..."
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
                      >
                        Create Product
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* EDIT PRODUCT MODAL */}
          <AnimatePresence>
            {isEditProductOpen && selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsEditProductOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl z-10 space-y-6 text-stone-900"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-serif text-amber-900">
                      Modify boutique item (ID: {selectedProduct.id})
                    </h3>
                    <button
                      onClick={() => setIsEditProductOpen(false)}
                      className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Product Name</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Retail Price ({CURRENCY_SYMBOL})</label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Original Price ({CURRENCY_SYMBOL})</label>
                        <input
                          type="number"
                          step="0.01"
                          value={prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Category</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                        >
                          <option value="Premium">Premium</option>
                          <option value="Formal">Formal</option>
                          <option value="Casual">Casual</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Men Collection">Men Collection</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Product Image / Representation</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="edit-prod-file"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="edit-prod-file"
                              className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-amber-900 text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 font-bold transition-colors shadow-xs"
                            >
                              📁 Upload Image File
                            </label>
                            <span className="text-[10px] text-stone-500 font-mono font-medium truncate max-w-[160px]">
                              {prodImage.startsWith('data:') ? 'Local File Attached' : prodImage.startsWith('http') || prodImage.startsWith('/') ? 'URL Linked' : 'Preset Emoji'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={prodImage.startsWith('data:') || prodImage.startsWith('http') || prodImage.startsWith('/') ? 'custom' : prodImage}
                              onChange={(e) => {
                                if (e.target.value !== 'custom') setProdImage(e.target.value)
                              }}
                              className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                            >
                              <option value="👗">👗 Dress / Abaya</option>
                              <option value="👔">👔 Formal Suit</option>
                              <option value="👕">👕 Casual Tee</option>
                              <option value="💎">💎 Accessory Gem</option>
                              <option value="👜">👜 Handbag</option>
                              <option value="👢">👢 High Boot</option>
                              <option value="custom">✨ Custom File / Link</option>
                            </select>

                            <input
                              type="text"
                              value={prodImage}
                              onChange={(e) => setProdImage(e.target.value)}
                              placeholder="Or paste Image URL..."
                              className="bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                            />
                          </div>

                          {/* Preview box */}
                          <div className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Preview:</span>
                            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                              {prodImage.startsWith('data:') || prodImage.startsWith('http') || prodImage.startsWith('/') ? (
                                <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">{prodImage || '👗'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Ribbon Tag / Badge</label>
                      <input
                        type="text"
                        value={prodBadge}
                        onChange={(e) => setProdBadge(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Description</label>
                      <textarea
                        rows={3}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsEditProductOpen(false)}
                        className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DELETE PRODUCT CONFIRMATION DIALOG */}
          <AnimatePresence>
            {isDeleteProductOpen && selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDeleteProductOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 space-y-6 text-stone-900"
                >
                  <div className="flex items-center gap-3 text-red-600 pb-1">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-serif">
                      Confirm Product Deletion
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    Are you sure you want to permanently delete the product{' '}
                    <strong className="text-stone-900">"{selectedProduct.name}"</strong>? This action cannot be
                    undone and will remove the item from all client collection galleries.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteProductOpen(false)}
                      className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteProductConfirm}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xs"
                    >
                      Delete Item
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ADD USER MODAL */}
          <AnimatePresence>
            {isAddUserOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAddUserOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 space-y-6 text-stone-900"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-serif text-amber-900">
                      Create client account
                    </h3>
                    <button
                      onClick={() => setIsAddUserOpen(false)}
                      className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        value={usrName}
                        onChange={(e) => setUsrName(e.target.value)}
                        placeholder="e.g. Fatima Ahmed (Karachi / Lahore)"
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={usrEmail}
                        onChange={(e) => setUsrEmail(e.target.value)}
                        placeholder="e.g. fatima@example.com"
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Privilege Role</label>
                        <select
                          value={usrRole}
                          onChange={(e) => setUsrRole(e.target.value as any)}
                          className="w-full bg-white border border-stone-300 rounded-lg py-2.5 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                        >
                          <option value="User">User (Client)</option>
                          <option value="Staff">Staff (Boutique)</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Account Status</label>
                        <select
                          value={usrStatus}
                          onChange={(e) => setUsrStatus(e.target.value as any)}
                          className="w-full bg-white border border-stone-300 rounded-lg py-2.5 px-3 text-xs text-stone-900 focus:outline-none focus:border-amber-600 shadow-xs cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Avatar Image URL (Optional)</label>
                      <input
                        type="text"
                        value={usrAvatar}
                        onChange={(e) => setUsrAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white border border-stone-300 rounded-lg py-2 px-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddUserOpen(false)}
                        className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DELETE USER CONFIRMATION DIALOG */}
          <AnimatePresence>
            {isDeleteUserOpen && selectedUserToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDeleteUserOpen(false)}
                  className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 space-y-6 text-stone-900"
                >
                  <div className="flex items-center gap-3 text-red-600 pb-1">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-serif">
                      Confirm Account Deletion
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    Are you sure you want to permanently delete the user account{' '}
                    <strong className="text-stone-900">"{selectedUserToDelete.name}" ({selectedUserToDelete.email})</strong>? This action cannot be undone.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteUserOpen(false)}
                      className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteUserConfirm}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xs"
                    >
                      Delete Account
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  )
}
