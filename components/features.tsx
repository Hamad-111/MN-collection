import { Truck, Shield, Undo2, Star } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100 worldwide',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Safe and encrypted transactions',
  },
  {
    icon: Undo2,
    title: 'Easy Returns',
    description: '30-day return policy guaranteed',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Luxury materials and craftsmanship',
  },
]

export default function Features() {
  return (
    <section className="py-16 md:py-20 bg-background border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 border border-secondary/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-serif text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm font-sans">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
