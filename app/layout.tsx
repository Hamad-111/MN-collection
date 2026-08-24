import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StoreProvider } from '@/components/store-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'MN Collection | Royal Oriental & Luxury Festive Fashion Pakistan',
  description: "Pakistan's premier boutique for oriental silk abayas, mandarin suits, and luxury festive couture. Cash on Delivery (COD) available across Karachi, Lahore, Islamabad & nationwide.",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} bg-background`}>
      <body className="font-sans antialiased text-foreground bg-background">
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
