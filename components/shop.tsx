import ProductCard from './product-card'

const shopProducts = [
  {
    name: 'Elegant Black Abaya',
    price: 199.99,
    originalPrice: 249.99,
  },
  {
    name: 'Cream Silk Abaya',
    price: 219.99,
    originalPrice: 279.99,
  },
  {
    name: 'Embroidered Dynasty Wear',
    price: 279.99,
    originalPrice: 349.99,
  },
  {
    name: 'Contemporary Formal Suit',
    price: 239.99,
    originalPrice: 299.99,
  },
  {
    name: 'Premium Wool Abaya',
    price: 259.99,
  },
  {
    name: 'Summer Light Collection',
    price: 149.99,
    originalPrice: 179.99,
  },
  {
    name: 'Golden Embroidery Dress',
    price: 289.99,
  },
  {
    name: 'Timeless Classic Abaya',
    price: 189.99,
    originalPrice: 229.99,
  },
]

export default function Shop() {
  return (
    <section id="shop" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Shop
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            New Luxury Collection
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopProducts.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  )
}
