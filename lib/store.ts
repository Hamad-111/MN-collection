export interface Product {
  id: number
  name: string
  title: string // mapped to name for card compatibility
  price: number
  originalPrice?: number
  category: string
  description: string
  badge?: string
  image?: string // e.g. emoji or Unsplash URL
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'User' | 'Staff'
  status: 'Active' | 'Suspended'
  avatar: string
  phone?: string
  address?: string
  city?: string
}

export interface ShippingDetails {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export interface PaymentDetails {
  cardholderName: string
  last4: string
  brand: string
}

export interface Order {
  id: string
  userId: string
  productId: number
  quantity: number
  totalPrice: number
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
  date: string
  shippingDetails?: ShippingDetails
  paymentDetails?: PaymentDetails
}

export interface Activity {
  id: string
  time: string
  message: string
  type: 'product' | 'user' | 'order' | 'system'
}

// Initial mock products consolidated from animated-product-grid.tsx and shop.tsx
export const defaultProducts: Product[] = [
  {
    id: 301,
    name: 'Bamboo Print Mandarin Silk Set (2-Piece)',
    title: 'Bamboo Print Mandarin Silk Set (2-Piece)',
    price: 4200,
    originalPrice: 5000,
    category: 'Men Collection',
    description: 'Exclusive oriental bamboo print silk-linen tunic shirt in soft lavender grey with mandarin band collar, paired with tailored dark slate trousers.',
    badge: 'Men Collection',
    image: '/images/bamboo-silk-set-men.jpg'
  },
  {
    id: 302,
    name: 'Bamboo Print Mandarin Silk Shirt (Single Shirt)',
    title: 'Bamboo Print Mandarin Silk Shirt (Single Shirt)',
    price: 3600,
    originalPrice: 4300,
    category: 'Men Collection',
    description: 'Sophisticated short-sleeve mandarin collar tunic shirt featuring traditional bamboo ink art motif in subtle lavender grey (Shirt Only).',
    badge: 'Men Collection',
    image: '/images/bamboo-silk-shirt-men.jpg'
  },
  {
    id: 104,
    name: 'Olive Green Mandarin Silk Set (2-Piece)',
    title: 'Olive Green Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Casual',
    description: 'Natural olive green linen-silk blend tunic set featuring classic mandarin frog-knot closures, wide 3/4 sleeves, and matching relaxed wide-leg trousers.',
    badge: 'New Arrival',
    image: '/images/olive-suit-frame.jpg'
  },
  {
    id: 204,
    name: 'Olive Green Mandarin Silk Shirt (Single Shirt)',
    title: 'Olive Green Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Casual',
    description: 'Natural olive green linen-silk blend single tunic shirt with mandarin frog-knot collar and wide 3/4 sleeves (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/olive-suit-frame.jpg'
  },
  {
    id: 105,
    name: 'Terracotta Orange Mandarin Silk Set (2-Piece)',
    title: 'Terracotta Orange Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Premium',
    description: 'Warm terracotta orange silk tunic set featuring traditional mandarin frog-knot buttons, side split hem, and relaxed fit wide-leg trousers.',
    badge: 'Trending',
    image: '/images/terracotta-suit-frame.jpg'
  },
  {
    id: 205,
    name: 'Terracotta Orange Mandarin Silk Shirt (Single Shirt)',
    title: 'Terracotta Orange Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Premium',
    description: 'Warm terracotta orange silk single tunic shirt featuring traditional mandarin frog-knot buttons and side split hem (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/terracotta-suit-frame.jpg'
  },
  {
    id: 106,
    name: 'Blush Pink Mandarin Silk Set (2-Piece)',
    title: 'Blush Pink Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Premium',
    description: 'Soft dusty blush pink silk tunic set with asymmetrical mandarin frog-knot closures, loose 3/4 sleeves, and wide-leg trousers.',
    badge: 'Exclusive',
    image: '/images/pink-suit-frame.jpg'
  },
  {
    id: 206,
    name: 'Blush Pink Mandarin Silk Shirt (Single Shirt)',
    title: 'Blush Pink Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Premium',
    description: 'Soft dusty blush pink silk single tunic shirt with asymmetrical mandarin frog-knot closures and loose 3/4 sleeves (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/pink-suit-frame.jpg'
  },
  {
    id: 101,
    name: 'Midnight Black Mandarin Silk Set (2-Piece)',
    title: 'Midnight Black Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Premium',
    description: 'Onyx midnight black silk-jacquard tunic set featuring silver-white mandarin frog-knot closures, 3/4 sleeves, and relaxed wide-leg trousers.',
    badge: 'Best Seller',
    image: '/images/black-suit-frame.png'
  },
  {
    id: 201,
    name: 'Midnight Black Mandarin Silk Shirt (Single Shirt)',
    title: 'Midnight Black Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Premium',
    description: 'Onyx midnight black silk-jacquard tunic single shirt featuring silver-white mandarin frog-knot closures (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/black-suit-frame.png'
  },
  {
    id: 102,
    name: 'Ivory Cream Mandarin Silk Set (2-Piece)',
    title: 'Ivory Cream Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Premium',
    description: 'Pearl ivory cream silk tunic set with champagne gold piping, mandarin frog-knot closures, and relaxed wide-leg trousers.',
    badge: 'Exclusive',
    image: '/images/cream-suit-frame.png'
  },
  {
    id: 202,
    name: 'Ivory Cream Mandarin Silk Shirt (Single Shirt)',
    title: 'Ivory Cream Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Premium',
    description: 'Pearl ivory cream silk tunic single shirt with champagne gold piping and mandarin frog-knot closures (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/cream-suit-frame.png'
  },
  {
    id: 103,
    name: 'Sage Mint Green Mandarin Silk Set (2-Piece)',
    title: 'Sage Mint Green Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Casual',
    description: 'Pastel sage mint green silk tunic set with white piping, mandarin frog-knot closures, and relaxed wide-leg trousers.',
    badge: 'Popular',
    image: '/images/mint-suit-frame.png'
  },
  {
    id: 203,
    name: 'Sage Mint Green Mandarin Silk Shirt (Single Shirt)',
    title: 'Sage Mint Green Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Casual',
    description: 'Pastel sage mint green silk tunic single shirt with white piping and mandarin frog-knot closures (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/mint-suit-frame.png'
  },
  {
    id: 100,
    name: 'Rose Lavender Mandarin Silk Set (2-Piece)',
    title: 'Rose Lavender Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Premium',
    description: 'Dusty rose pinkish-lavender silk tunic set featuring mandarin frog-knot closures, 3/4 wide sleeves, and relaxed wide-leg trousers.',
    badge: 'Featured',
    image: '/images/lavender-suit-frame.png'
  },
  {
    id: 200,
    name: 'Rose Lavender Mandarin Silk Shirt (Single Shirt)',
    title: 'Rose Lavender Mandarin Silk Shirt (Single Shirt)',
    price: 3500,
    originalPrice: 4200,
    category: 'Premium',
    description: 'Dusty rose pinkish-lavender silk single tunic shirt with mandarin frog-knot closures and wide sleeves (Shirt Only).',
    badge: 'Single Shirt',
    image: '/images/lavender-suit-frame.png'
  }
]

export const defaultUsers: User[] = [
  {
    id: 'user_1',
    name: 'Hamad Khan (CEO)',
    email: 'admin@mncollection.com',
    role: 'Admin',
    status: 'Active',
    avatar: '/hamad-khan-ceo.png',
    phone: '0300-1234567',
    address: 'Clifton Block 4',
    city: 'Karachi'
  },
  {
    id: 'user_2',
    name: 'Mahi Khan (Co-CEO)',
    email: 'mahi@mncollection.com',
    role: 'Admin',
    status: 'Active',
    avatar: '/mahi-khan-co-ceo.jpg',
    phone: '0321-9876543',
    address: 'Gulberg III',
    city: 'Lahore'
  },
  {
    id: 'user_3',
    name: 'Fatima Ahmed',
    email: 'fatima@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phone: '0321-9876543',
    address: 'House #45, Gulberg III',
    city: 'Lahore'
  },
  {
    id: 'user_4',
    name: 'Zayed Khan',
    email: 'zayed@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '0333-5551234',
    address: 'Street #12, F-7/2',
    city: 'Islamabad'
  }
]

export const defaultOrders: Order[] = [
  {
    id: 'ord_1',
    userId: 'user_2',
    productId: 104,
    quantity: 1,
    totalPrice: 4200,
    status: 'Delivered',
    date: '2026-06-01T12:00:00.000Z',
    shippingDetails: {
      name: 'Fatima Ahmed',
      address: 'House #45, Gulberg III',
      city: 'Lahore',
      postalCode: '54000',
      country: 'Pakistan',
      phone: '0321-9876543'
    },
    paymentDetails: {
      cardholderName: 'Fatima Ahmed',
      last4: 'COD',
      brand: 'Cash on Delivery (COD)'
    }
  },
  {
    id: 'ord_2',
    userId: 'user_2',
    productId: 105,
    quantity: 1,
    totalPrice: 3500,
    status: 'Delivered',
    date: '2026-06-03T14:30:00.000Z',
    shippingDetails: {
      name: 'Fatima Ahmed',
      address: 'House #45, Gulberg III',
      city: 'Lahore',
      postalCode: '54000',
      country: 'Pakistan',
      phone: '0321-9876543'
    },
    paymentDetails: {
      cardholderName: 'Fatima Ahmed',
      last4: 'COD',
      brand: 'Cash on Delivery (COD)'
    }
  },
  {
    id: 'ord_3',
    userId: 'user_3',
    productId: 301,
    quantity: 1,
    totalPrice: 4200,
    status: 'Shipped',
    date: '2026-06-08T09:15:00.000Z',
    shippingDetails: {
      name: 'Zayed Khan',
      address: 'Street #12, F-7/2',
      city: 'Islamabad',
      postalCode: '44000',
      country: 'Pakistan',
      phone: '0333-5551234'
    },
    paymentDetails: {
      cardholderName: 'Zayed Khan',
      last4: 'COD',
      brand: 'Cash on Delivery (COD)'
    }
  },
  {
    id: 'ord_4',
    userId: 'user_3',
    productId: 100,
    quantity: 1,
    totalPrice: 4000,
    status: 'Pending',
    date: '2026-06-10T10:00:00.000Z',
    shippingDetails: {
      name: 'Zayed Khan',
      address: 'Street #12, F-7/2',
      city: 'Islamabad',
      postalCode: '44000',
      country: 'Pakistan',
      phone: '0333-5551234'
    },
    paymentDetails: {
      cardholderName: 'Zayed Khan',
      last4: 'COD',
      brand: 'Cash on Delivery (COD)'
    }
  }
]

export const defaultActivities: Activity[] = [
  {
    id: 'act_1',
    time: '2026-06-11T14:30:00.000Z',
    message: 'Admin mncollection09@gmail.com updated Bamboo Silk Mandarin Suit',
    type: 'product'
  },
  {
    id: 'act_2',
    time: '2026-06-11T13:15:00.000Z',
    message: 'Customer Fatima Ahmed placed a Cash on Delivery order for Olive Green Silk Suit (Lahore, Pakistan)',
    type: 'order'
  },
  {
    id: 'act_3',
    time: '2026-06-11T12:00:00.000Z',
    message: 'TCS / Leopards Pakistan courier dispatch tracking updated',
    type: 'system'
  },
  {
    id: 'act_4',
    time: '2026-06-10T16:45:00.000Z',
    message: 'Admin mncollection09@gmail.com added Rose Lavender Mandarin Silk Set',
    type: 'product'
  },
  {
    id: 'act_5',
    time: '2026-06-10T15:20:00.000Z',
    message: 'New customer Zayed Khan (Islamabad) registered account',
    type: 'user'
  }
]
