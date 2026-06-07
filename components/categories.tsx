'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Abayas',
    description: 'Traditional elegance',
    icon: '👗',
  },
  {
    name: 'Formal Wear',
    description: 'Sophisticated styles',
    icon: '✨',
  },
  {
    name: 'Casual Collection',
    description: 'Comfortable luxury',
    icon: '🌸',
  },
  {
    name: 'Accessories',
    description: 'Complete your look',
    icon: '💎',
  },
]

export default function Categories() {
  return (
    <section id="collections" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Discover
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our Premium Collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="#shop"
              className="group relative overflow-hidden rounded-xl bg-white border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-8 flex flex-col h-full justify-between">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center text-secondary font-semibold group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
