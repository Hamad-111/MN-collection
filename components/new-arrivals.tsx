import ProductCard from './product-card'

const newArrivals = [
  {
    name: 'Luxe Evening Abaya',
    price: 249.99,
    originalPrice: 299.99,
    badge: 'New',
  },
  {
    name: 'Premium Silk Ensemble',
    price: 189.99,
    originalPrice: 229.99,
    badge: 'New',
  },
  {
    name: 'Royal Heritage Collection',
    price: 319.99,
    originalPrice: 399.99,
    badge: 'Hot Deal',
  },
  {
    name: 'Modern Modest Wear',
    price: 159.99,
    badge: 'New',
  },
]

export default function NewArrivals() {
  return (
    <section id="new-arrivals" className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            New Arrivals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Luxury Modest Fashion Articles
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
