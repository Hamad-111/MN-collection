import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit mb-4">
              <p className="text-secondary font-semibold text-sm tracking-widest uppercase">
                Welcome to Excellence
              </p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Royal Elegance,
              <br />
              <span className="text-secondary">Timeless Style</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Discover our exclusive collection of premium clothing and traditional wear designed for the modern, sophisticated you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg">
                Shop Now
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 px-8 py-6 text-lg rounded-lg">
                Explore Collections
              </Button>
            </div>
          </div>

          {/* Right - Placeholder for model image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-secondary/30"></div>
              </div>
              <p className="text-primary/60 font-semibold">Premium Fashion Model</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
