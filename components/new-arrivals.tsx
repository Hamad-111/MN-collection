'use client'

import ProductCard from './product-card'
import { useStore } from './store-provider'

export default function NewArrivals() {
  const { products } = useStore()
  // Render top products featuring the 4 Oriental Mandarin Silk Suits
  const arrivalProducts = products.slice(0, 4)

  return (
    <section id="new-arrivals" className="py-20 bg-gradient-to-b from-background via-accent/5 to-background border-t border-border/30 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
            Oriental Mandarin Collection — Signature Silk Suits
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {arrivalProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              badge={product.badge}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
