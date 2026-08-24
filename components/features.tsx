import { Truck, ShieldCheck, Undo2, Banknote, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Pakistan Courier Express Delivery',
    description: 'Free doorstep shipping across Karachi, Lahore, Islamabad & all Pakistan cities',
  },
  {
    icon: Banknote,
    title: 'Cash on Delivery (COD)',
    description: 'Pay cash to TCS / Leopards / Trax courier driver upon arrival at your doorstep',
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic Quality',
    description: 'Verified pure silk & hand-crafted oriental fabrics with doorstep inspection',
  },
  {
    icon: Sparkles,
    title: 'Royal Festive Couture',
    description: 'Tailored with hand-embroidered velvet, silk-linen & oriental mandarin collars',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-[#faf7f2] border-t border-stone-200 font-sans text-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-amber-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-stone-600 text-xs font-normal leading-relaxed">
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
