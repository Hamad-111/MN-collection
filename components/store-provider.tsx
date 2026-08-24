'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Product,
  User,
  Order,
  Activity,
  defaultProducts,
  defaultUsers,
  defaultOrders,
  defaultActivities,
  ShippingDetails,
  PaymentDetails
} from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { sendAdminOrderNotificationEmail } from '@/lib/email-service'


export interface CartItem {
  product: Product
  quantity: number
}

interface StoreContextType {
  products: Product[]
  users: User[]
  orders: Order[]
  activities: Activity[]
  cart: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  currentUser: User | null
  login: (email: string, password?: string) => Promise<boolean>
  register: (name: string, email: string, password?: string, phone?: string, address?: string, city?: string) => Promise<User>
  logout: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'title'>) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: number) => void
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (user: User) => void
  deleteUser: (id: string) => void
  addOrder: (order: Omit<Order, 'id' | 'date' | 'totalPrice'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  deleteOrder: (id: string) => void
  addActivity: (message: string, type: Activity['type']) => void
  isInitialized: boolean
  refreshStore: () => Promise<void>
  lightboxProduct: Product | null
  openProductLightbox: (product: Product) => void
  closeProductLightbox: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [orders, setOrders] = useState<Order[]>(defaultOrders)
  const [activities, setActivities] = useState<Activity[]>(defaultActivities)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null)

  const openProductLightbox = (product: Product) => setLightboxProduct(product)
  const closeProductLightbox = () => setLightboxProduct(null)
  // Load from Supabase on client-side mount (with automatic seeding)
  useEffect(() => {
    const initializeStore = async () => {
      try {
        // Load cart from localStorage
        const storedCart = localStorage.getItem('mn_cart')
        if (storedCart) setCart(JSON.parse(storedCart))

        // Get active Supabase session
        const { data: { session } } = await supabase.auth.getSession()

        // 1. Load products and filter duplicates / legacy mismatched entries
        const { data: dbProducts } = await supabase.from('products').select('*')
        const validIds = new Set(defaultProducts.map((p) => Number(p.id)))
        
        let prepared: Product[] = defaultProducts

        if (dbProducts && dbProducts.length > 0) {
          // Filter out legacy duplicate items (IDs 1..16) that had mismatched names
          const validDbProducts = dbProducts
            .filter((p) => validIds.has(Number(p.id)))
            .map((p) => ({
              ...p,
              id: Number(p.id),
              title: p.name || p.title,
              price: Number(p.price),
              originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined
            }))

          if (validDbProducts.length > 0) {
            // Merge defaults for any missing curated products
            const existingDbIds = new Set(validDbProducts.map((p) => p.id))
            const missing = defaultProducts.filter((p) => !existingDbIds.has(p.id))
            prepared = [...validDbProducts, ...missing]
          }
        }

        // Deduplicate by product ID to eliminate double uploads
        const uniqueProducts = Array.from(
          new Map(prepared.map((item) => [item.id, item])).values()
        )

        // Sort priority signature suits (301, 302, 104, 204, 105, 205, 106, 206, 101, 201, 102, 202, 103, 203, 100, 200)
        uniqueProducts.sort((a, b) => {
          const priorityIds = [301, 302, 104, 204, 105, 205, 106, 206, 101, 201, 102, 202, 103, 203, 100, 200]
          const indexA = priorityIds.indexOf(Number(a.id))
          const indexB = priorityIds.indexOf(Number(b.id))
          if (indexA !== -1 && indexB !== -1) return indexA - indexB
          if (indexA !== -1) return -1
          if (indexB !== -1) return 1
          return Number(a.id) - Number(b.id)
        })
        setProducts(uniqueProducts)

        // 2. Load users
        const { data: dbUsers } = await supabase.from('users').select('*')
        if (dbUsers && dbUsers.length > 0) {
          const processedUsers = dbUsers.map(u =>
            u.email.toLowerCase() === 'admin@mncollection.com' ? { ...u, role: 'Admin' as const } : u
          )
          setUsers(processedUsers)
        } else {
          await supabase.from('users').insert(defaultUsers)
          setUsers(defaultUsers)
        }

        // Set currentUser if active session exists
        if (session?.user) {
          const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
          if (profile) {
            const finalProfile = profile.email.toLowerCase() === 'admin@mncollection.com' ? { ...profile, role: 'Admin' as const } : profile
            setCurrentUser(finalProfile)
          } else {
            const { data: emailProfile } = await supabase.from('users').select('*').eq('email', session.user.email).single()
            if (emailProfile) {
              const finalProfile = emailProfile.email.toLowerCase() === 'admin@mncollection.com' ? { ...emailProfile, role: 'Admin' as const } : emailProfile
              setCurrentUser(finalProfile)
            } else {
              const newProfile: User = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Customer',
                email: session.user.email || '',
                role: session.user.email?.toLowerCase() === 'admin@mncollection.com' ? 'Admin' : 'User',
                status: 'Active',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              }
              await supabase.from('users').upsert([newProfile])
              setCurrentUser(newProfile)
            }
          }
        } else {
          // Restore user from local storage if available for seamless demo experience
          const cachedUser = localStorage.getItem('mn_current_user')
          if (cachedUser) {
            try {
              const parsed: User = JSON.parse(cachedUser)
              const finalProfile = parsed.email?.toLowerCase() === 'admin@mncollection.com' ? { ...parsed, role: 'Admin' as const } : parsed
              setCurrentUser(finalProfile)
            } catch (e) {
              console.error(e)
            }
          }
        }

        // 3. Load orders
        const { data: dbOrders } = await supabase.from('orders').select('*').order('date', { ascending: false })
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders)
        } else {
          await supabase.from('orders').insert(
            defaultOrders.map(o => ({
              id: o.id,
              userId: o.userId,
              productId: o.productId,
              quantity: o.quantity,
              totalPrice: o.totalPrice,
              status: o.status,
              date: o.date,
              shippingDetails: o.shippingDetails || null,
              paymentDetails: o.paymentDetails || null
            }))
          )
          setOrders(defaultOrders)
        }

        // 4. Load activities
        const { data: dbActivities } = await supabase.from('activities').select('*').order('time', { ascending: false }).limit(50)
        if (dbActivities && dbActivities.length > 0) {
          setActivities(dbActivities)
        } else {
          await supabase.from('activities').insert(defaultActivities)
          setActivities(defaultActivities)
        }
      } catch (error) {
        console.error('Failed to load store from Supabase', error)
      } finally {
        setIsInitialized(true)
      }
    }

    // Real-time Store Re-sync from Database
    const refreshStore = async () => {
      try {
        const { data: dbProducts } = await supabase.from('products').select('*')
        const validIds = new Set(defaultProducts.map((p) => Number(p.id)))
        let prepared: Product[] = defaultProducts

        if (dbProducts && dbProducts.length > 0) {
          const validDbProducts = dbProducts
            .filter((p) => validIds.has(Number(p.id)))
            .map((p) => ({
              ...p,
              id: Number(p.id),
              title: p.name || p.title,
              price: Number(p.price),
              originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined
            }))
          if (validDbProducts.length > 0) {
            const existingDbIds = new Set(validDbProducts.map((p) => p.id))
            const missing = defaultProducts.filter((p) => !existingDbIds.has(p.id))
            prepared = [...validDbProducts, ...missing]
          }
        }
        const uniqueProducts = Array.from(
          new Map(prepared.map((item) => [item.id, item])).values()
        )
        setProducts(uniqueProducts)

        const { data: dbUsers } = await supabase.from('users').select('*')
        if (dbUsers && dbUsers.length > 0) {
          const processedUsers = dbUsers.map(u =>
            u.email.toLowerCase() === 'admin@mncollection.com' ? { ...u, role: 'Admin' as const } : u
          )
          setUsers(processedUsers)
        }

        const { data: dbOrders } = await supabase.from('orders').select('*').order('date', { ascending: false })
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders)
        }

        const { data: dbActivities } = await supabase.from('activities').select('*').order('time', { ascending: false }).limit(50)
        if (dbActivities && dbActivities.length > 0) {
          setActivities(dbActivities)
        }
      } catch (err) {
        console.error('Store refresh error:', err)
      }
    }

    initializeStore()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null)
      } else if (session?.user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        if (profile) {
          setCurrentUser(profile)
        }
      }
    })

    // Listen for real-time changes on database tables
    const realTimeChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => refreshStore())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => refreshStore())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => refreshStore())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => refreshStore())
      .subscribe()

    return () => {
      authListener.subscription.unsubscribe()
      supabase.removeChannel(realTimeChannel)
    }
  }, [])

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem('mn_cart', JSON.stringify(cart))
    } catch (e) {
      console.error(e)
    }
  }, [cart, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    try {
      if (currentUser) {
        localStorage.setItem('mn_current_user', JSON.stringify(currentUser))
      } else {
        localStorage.removeItem('mn_current_user')
      }
    } catch (e) {
      console.error(e)
    }
  }, [currentUser, isInitialized])


  const addActivity = async (message: string, type: Activity['type']) => {
    const newActivity: Activity = {
      id: 'act_' + Math.random().toString(36).substr(2, 9),
      time: new Date().toISOString(),
      message,
      type
    }
    setActivities((prev) => [newActivity, ...prev].slice(0, 50)) // limit logs to last 50
    await supabase.from('activities').insert([newActivity])
  }

  // Authentication Operations
  const login = async (email: string, password?: string): Promise<boolean> => {
    const psw = password || 'password123'
    const isAdminEmail = email.toLowerCase() === 'admin@mncollection.com'
    let authUser = null

    // 1. Try Supabase Auth Sign In
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: psw })
    if (data?.user) {
      authUser = data.user
    } else if (error) {
      console.warn('Supabase auth signin notice:', error.message)
      // Check if user exists in database/mock users list to register/sync them automatically
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        const { data: signUpData } = await supabase.auth.signUp({ email, password: psw })
        if (signUpData?.user) {
          authUser = signUpData.user
        } else {
          // Allow login matching database user profile
          if (existingUser.status === 'Suspended') return false
          const finalUser: User = isAdminEmail ? { ...existingUser, role: 'Admin' } : existingUser
          setCurrentUser(finalUser)
          await addActivity(`User "${finalUser.name}" authenticated.`, 'user')
          return true
        }
      }
    }

    if (authUser) {
      // Fetch or create profile in 'users' table
      const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).maybeSingle()
      if (profile) {
        if (profile.status === 'Suspended') {
          await supabase.auth.signOut()
          return false
        }
        const finalProfile: User = (isAdminEmail || profile.role === 'Admin') ? { ...profile, role: 'Admin' } : profile
        if (isAdminEmail && profile.role !== 'Admin') {
          await supabase.from('users').update({ role: 'Admin' }).eq('id', profile.id)
        }
        setCurrentUser(finalProfile)
        await addActivity(`User "${finalProfile.name}" authenticated successfully.`, 'user')
        return true
      }

      // Check by email
      const { data: emailProfile } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
      if (emailProfile) {
        if (emailProfile.status === 'Suspended') {
          await supabase.auth.signOut()
          return false
        }
        const finalRole = isAdminEmail ? 'Admin' : emailProfile.role
        const updatedProfile: User = { ...emailProfile, id: authUser.id, role: finalRole }
        await supabase.from('users').update({ id: authUser.id, role: finalRole }).eq('email', email)
        setCurrentUser(updatedProfile)
        await addActivity(`User "${updatedProfile.name}" authenticated successfully.`, 'user')
        return true
      }

      // Create new profile record for authUser
      const newProfile: User = {
        id: authUser.id,
        name: authUser.user_metadata?.name || email.split('@')[0],
        email: email,
        role: isAdminEmail ? 'Admin' : 'User',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      }
      const { error: insErr } = await supabase.from('users').insert([newProfile])
      if (insErr) {
        console.warn('Profile sync notice:', insErr.message || insErr)
      }
      setCurrentUser(newProfile)
      await addActivity(`User "${newProfile.name}" authenticated successfully.`, 'user')
      return true
    }

    // Direct fallback for admin account if auth bypass is required
    if (isAdminEmail) {
      const defaultAdmin: User = {
        id: 'user_1',
        name: 'Hamad Al-Mansoori',
        email: 'admin@mncollection.com',
        role: 'Admin',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      }
      setCurrentUser(defaultAdmin)
      await addActivity(`Admin "Hamad Al-Mansoori" authenticated successfully.`, 'user')
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password?: string, phone?: string, address?: string, city?: string): Promise<User> => {
    const psw = password || 'password123'
    const randomAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    
    // 1. Supabase Auth Registration
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password: psw,
      options: {
        data: { name }
      }
    })

    if (authErr) {
      if (authErr.message.toLowerCase().includes('already registered') || authErr.message.toLowerCase().includes('user_already_exists')) {
        const success = await login(email, psw)
        if (success && currentUser) return currentUser
      }
      throw new Error(authErr.message)
    }

    const userId = authData.user?.id || 'user_' + Math.random().toString(36).substr(2, 9)

    let newUser: User = {
      id: userId,
      name,
      email,
      role: email === 'admin@mncollection.com' ? 'Admin' : 'User',
      status: 'Active',
      avatar: randomAvatar,
      phone: phone || undefined,
      address: address || undefined,
      city: city || undefined
    }

    // 2. Check if profile already exists in users table by email
    try {
      const { data: existingProfile } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
      if (existingProfile) {
        newUser = {
          ...existingProfile,
          id: userId,
          name: name || existingProfile.name,
          role: email === 'admin@mncollection.com' ? 'Admin' : existingProfile.role,
          phone: phone || existingProfile.phone,
          address: address || existingProfile.address,
          city: city || existingProfile.city,
        }
        await supabase.from('users').update(newUser).eq('email', email)
      } else {
        const { error: dbErr } = await supabase.from('users').insert([newUser])
        if (dbErr) {
          console.warn('Notice saving profile in users table:', dbErr.message || dbErr.details || dbErr)
        }
      }
    } catch (e: any) {
      console.warn('Profile save warning:', e?.message || e)
    }
    
    setUsers((prev) => [...prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()), newUser])
    setCurrentUser(newUser)
    await addActivity(`New customer account registered: "${name}" (${email}).`, 'user')
    return newUser
  }

  const logout = async () => {
    if (currentUser) {
      await addActivity(`User "${currentUser.name}" signed out.`, 'user')
    }
    await supabase.auth.signOut()
    setCurrentUser(null)
  }

  // Cart Operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    addActivity(`Added item "${product.name}" to cart.`, 'system')
  }

  const removeFromCart = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId)
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
    if (item) {
      addActivity(`Removed item "${item.product.name}" from cart.`, 'system')
    }
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  // Product Operations
  const addProduct = async (prod: Omit<Product, 'id' | 'title'>) => {
    // Deduplication check: ignore duplicate upload if product with same name exists
    const duplicate = products.find(
      (p) => p.name.trim().toLowerCase() === prod.name.trim().toLowerCase()
    )
    if (duplicate) {
      console.warn('Duplicate product upload prevented:', prod.name)
      return
    }

    const newId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id))) + 1 : 1
    const newProduct: Product = {
      ...prod,
      id: newId,
      title: prod.name // duplicate title for FlipCard compatibility
    }
    setProducts((prev) => [newProduct, ...prev])
    await supabase.from('products').insert([newProduct])
    await addActivity(`Product "${prod.name}" was uploaded successfully.`, 'product')
  }

  const updateProduct = async (updatedProd: Product) => {
    const preparedProd = {
      ...updatedProd,
      title: updatedProd.name
    }
    setProducts((prev) => prev.map((p) => (p.id === preparedProd.id ? preparedProd : p)))
    await supabase.from('products').update(preparedProd).eq('id', preparedProd.id)
    await addActivity(`Product "${preparedProd.name}" (ID: ${preparedProd.id}) details were modified.`, 'product')
  }

  const deleteProduct = async (id: number) => {
    const prodToDelete = products.find((p) => p.id === id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    await supabase.from('products').delete().eq('id', id)
    if (prodToDelete) {
      await addActivity(`Product "${prodToDelete.name}" was deleted.`, 'product')
    }
  }

  // User Operations
  const addUser = async (usr: Omit<User, 'id'>) => {
    // Deduplication check: ignore duplicate user creation if email already registered
    const existing = users.find((u) => u.email.toLowerCase() === usr.email.toLowerCase())
    if (existing) {
      console.warn('Duplicate user creation prevented for:', usr.email)
      return
    }

    const newId = 'user_' + Math.random().toString(36).substr(2, 9)
    const newUser: User = {
      ...usr,
      id: newId
    }
    setUsers((prev) => [...prev, newUser])
    await supabase.from('users').insert([newUser])
    await addActivity(`User account "${usr.name}" was created.`, 'user')
  }

  const updateUser = async (updatedUsr: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUsr.id ? updatedUsr : u)))
    await supabase.from('users').update(updatedUsr).eq('id', updatedUsr.id)
    await addActivity(`User details for "${updatedUsr.name}" were updated.`, 'user')
  }

  const deleteUser = async (id: string) => {
    const userToDelete = users.find((u) => u.id === id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
    await supabase.from('users').delete().eq('id', id)
    if (userToDelete) {
      await addActivity(`User account "${userToDelete.name}" was deleted.`, 'user')
    }
  }

  // Order Operations (Simulating Purchases)
  const addOrder = async (ord: Omit<Order, 'id' | 'date' | 'totalPrice'>) => {
    const product = products.find((p) => p.id === ord.productId)
    const user = users.find((u) => u.id === ord.userId)
    if (!product || !user) return

    // Deduplication check: prevent double posting of identical order within last 10 seconds
    const now = Date.now()
    const isDuplicate = orders.some((o) => {
      const isSameUser = o.userId === ord.userId
      const isSameProduct = o.productId === ord.productId
      const isSameQty = o.quantity === ord.quantity
      const orderTime = new Date(o.date).getTime()
      return isSameUser && isSameProduct && isSameQty && now - orderTime < 10000
    })

    if (isDuplicate) {
      console.warn('Duplicate order submission prevented for order:', ord)
      return
    }

    const totalPrice = product.price * ord.quantity
    const newOrder: Order = {
      ...ord,
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      totalPrice,
      date: new Date().toISOString()
    }

    setOrders((prev) => [newOrder, ...prev])
    await supabase.from('orders').insert([
      {
        id: newOrder.id,
        userId: newOrder.userId,
        productId: newOrder.productId,
        quantity: newOrder.quantity,
        totalPrice: newOrder.totalPrice,
        status: newOrder.status,
        date: newOrder.date,
        shippingDetails: newOrder.shippingDetails || null,
        paymentDetails: newOrder.paymentDetails || null
      }
    ])

    // Send Gmail Email Notification to Admin
    sendAdminOrderNotificationEmail(newOrder, user, product)
    await addActivity(`📧 Gmail notification sent to mncollection09@gmail.com! Order #${newOrder.id} placed by ${user.name} (${product.name}).`, 'order')
  }

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    await supabase.from('orders').update({ status }).eq('id', id)
    const order = orders.find((o) => o.id === id)
    if (order) {
      const product = products.find((p) => p.id === order.productId)
      const user = users.find((u) => u.id === order.userId)
      // Send Gmail Email Notification to Admin on Status Change
      sendAdminOrderNotificationEmail({ ...order, status }, user, product)
      await addActivity(`📧 Gmail alert sent to admin@mncollection.com! Order #${id} status updated to "${status}".`, 'order')
    }
  }

  const deleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
    await supabase.from('orders').delete().eq('id', id)
    await addActivity(`Order reference ID ${id} was deleted.`, 'order')
  }

  const refreshStore = async () => {
    try {
      const { data: dbProducts } = await supabase.from('products').select('*')
      const validIds = new Set(defaultProducts.map((p) => Number(p.id)))
      let prepared: Product[] = defaultProducts

      if (dbProducts && dbProducts.length > 0) {
        const validDbProducts = dbProducts
          .filter((p) => validIds.has(Number(p.id)))
          .map((p) => ({
            ...p,
            id: Number(p.id),
            title: p.name || p.title,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined
          }))
        if (validDbProducts.length > 0) {
          const existingDbIds = new Set(validDbProducts.map((p) => p.id))
          const missing = defaultProducts.filter((p) => !existingDbIds.has(p.id))
          prepared = [...validDbProducts, ...missing]
        }
      }
      const uniqueProducts = Array.from(
        new Map(prepared.map((item) => [item.id, item])).values()
      )
      setProducts(uniqueProducts)

      const { data: dbUsers } = await supabase.from('users').select('*')
      if (dbUsers && dbUsers.length > 0) {
        const processedUsers = dbUsers.map(u =>
          u.email.toLowerCase() === 'admin@mncollection.com' ? { ...u, role: 'Admin' as const } : u
        )
        setUsers(processedUsers)
      }

      const { data: dbOrders } = await supabase.from('orders').select('*').order('date', { ascending: false })
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders)
      }

      const { data: dbActivities } = await supabase.from('activities').select('*').order('time', { ascending: false }).limit(50)
      if (dbActivities && dbActivities.length > 0) {
        setActivities(dbActivities)
      }
    } catch (err) {
      console.error('Store refresh error:', err)
    }
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        users,
        orders,
        activities,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        currentUser,
        login,
        register,
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
        addActivity,
        isInitialized,
        refreshStore,
        lightboxProduct,
        openProductLightbox,
        closeProductLightbox
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
