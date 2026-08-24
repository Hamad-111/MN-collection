'use client'

import { useState } from 'react'
import ProductCard from './product-card'
import { useStore } from '@/components/store-provider'

export default function Shop() {
  const { products } = useStore()
  const [limit, setLimit] = useState(8)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Men Collection', 'Premium', 'Casual']

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => {
        if (selectedCategory === 'Men Collection') {
          return p.category === 'Men Collection' || p.badge === 'Men Collection' || p.id === 301 || p.id === 302
        }
        return p.category?.toLowerCase() === selectedCategory.toLowerCase()
      })

  const displayProducts = filteredProducts.slice(0, limit)

  return (
    <section id="shop" className="py-20 bg-background border-t border-border/30 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-3">
            Shop Collection
          </h2>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto mb-8">
            Explore Luxury Fashion & Men's Oriental Mandarin Collection
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setLimit(8)
                }}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
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

        {/* Load More Button */}
        {limit < filteredProducts.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setLimit((prev) => prev + 4)}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold font-sans rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:bg-primary/95 cursor-pointer"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

