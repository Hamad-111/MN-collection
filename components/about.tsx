export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-accent/5 via-background to-secondary/5 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image Placeholder Frame */}
          <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-secondary/10 via-card to-secondary/5 border border-border flex items-center justify-center p-8 shadow-lg relative">
            <div className="absolute inset-4 border border-secondary/20 pointer-events-none rounded-xl" />
            <div className="text-center text-primary/60 z-10">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-3xl">🏛️</div>
              </div>
              <p className="text-sm font-semibold tracking-wider uppercase font-sans">Our Heritage</p>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <p className="text-secondary font-bold text-xs tracking-widest uppercase mb-4 font-sans">
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold font-serif text-primary mb-6">
              Elegance in Every Piece
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed font-sans font-light">
              MN Collection was founded with a passion for creating premium, authentic clothing that celebrates tradition while embracing modernity. Each piece in our collection is meticulously crafted with the finest materials.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed font-sans font-light">
              We believe that fashion is a form of expression and empowerment. Our designs honor cultural heritage while appealing to the contemporary woman who values quality, sophistication, and comfort.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold font-serif text-primary">10K+</div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1 font-sans">Happy Customers</p>
              </div>
              <div>
                <div className="text-3xl font-bold font-serif text-secondary">500+</div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1 font-sans">Unique Designs</p>
              </div>
              <div>
                <div className="text-3xl font-bold font-serif text-primary">5+</div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1 font-sans">Years Crafting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
