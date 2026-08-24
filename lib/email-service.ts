import { Order, User, Product } from './store'

export interface EmailNotificationPayload {
  to: string
  subject: string
  body: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress?: string
  totalAmount: number
  paymentMethod: string
  timestamp: string
}

export const ADMIN_GMAIL = 'mncollection09@gmail.com'

/**
 * Constructs email details and triggers notification for new order update
 */
export function sendAdminOrderNotificationEmail(order: {
  id?: string
  userId: string
  productId: number
  quantity: number
  status: string
  shippingDetails?: any
  paymentDetails?: any
}, user?: User | null, product?: Product | null): EmailNotificationPayload {
  const orderId = order.id || 'ord_' + Math.random().toString(36).substring(2, 9)
  const timestamp = new Date().toLocaleString()
  const customerName = order.shippingDetails?.name || user?.name || 'Customer'
  const customerEmail = user?.email || 'customer@example.com'
  const customerPhone = order.shippingDetails?.phone || user?.phone || 'Not provided'
  const address = order.shippingDetails ? `${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.country}` : 'Standard Shipping'
  const paymentMethod = order.paymentDetails?.brand || 'Cash on Delivery (COD)'
  const productName = product?.name || 'MN Collection Item'
  const unitPrice = product?.price || 0
  const totalPrice = unitPrice * order.quantity * 1.05 // with 5% VAT

  const subject = `🚨 NEW ORDER ALERT: Order #${orderId} - ${customerName}`
  
  const body = `
=== MN COLLECTION BOUTIQUE ORDER UPDATE ===
Notification sent to Admin: ${ADMIN_GMAIL}
Timestamp: ${timestamp}

ORDER DETAILS:
- Order ID: #${orderId}
- Status: ${order.status}
- Product: ${productName} (Qty: ${order.quantity})
- Estimated Invoice Total: Rs. ${totalPrice.toLocaleString()}

CUSTOMER SHIPPING INFO:
- Name: ${customerName}
- Email: ${customerEmail}
- Phone Number: ${customerPhone}
- Delivery Address: ${address}

PAYMENT DETAILS:
- Method: ${paymentMethod}
- Details: ${order.paymentDetails?.last4 ? 'Ending in ' + order.paymentDetails.last4 : 'COD Payment on Doorstep'}

Please dispatch courier and update order status in the Admin Portal!
============================================
  `.trim()

  const payload: EmailNotificationPayload = {
    to: ADMIN_GMAIL,
    subject,
    body,
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress: address,
    totalAmount: totalPrice,
    paymentMethod,
    timestamp
  }

  // Log notification to console & store
  console.log('📧 [GMAIL NOTIFICATION DISPATCHED TO ADMIN]:', payload)

  return payload
}

/**
 * Creates mailto link to open real Gmail draft to admin@mncollection.com
 */
export function openGmailDraft(payload: EmailNotificationPayload) {
  if (typeof window === 'undefined') return
  const mailtoUrl = `mailto:${payload.to}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`
  window.open(mailtoUrl, '_blank')
}
