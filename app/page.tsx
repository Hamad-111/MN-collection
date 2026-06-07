import Header from '@/components/header'
import AnimatedHero from '@/components/animated-hero'
import PromoBanner from '@/components/promo-banner'
import CategoryShowcase from '@/components/category-showcase'
import NewArrivals from '@/components/new-arrivals'
import AnimatedProductGrid from '@/components/animated-product-grid'
import Shop from '@/components/shop'
import StatsSection from '@/components/stats-section'
import Features from '@/components/features'
import About from '@/components/about'
import Footer from '@/components/footer'

export default function Page() {
  return (
    <main className="w-full overflow-hidden">
      <PromoBanner />
      <Header />
      <AnimatedHero />
      <CategoryShowcase />
      <NewArrivals />
      <AnimatedProductGrid />
      <Shop />
      <StatsSection />
      <Features />
      <About />
      <Footer />
    </main>
  )
}
