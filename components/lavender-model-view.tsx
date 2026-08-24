'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Eye, RotateCw, ShoppingCart, Check, ShieldCheck, Heart } from 'lucide-react'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

// High-Precision 3D Garment Mesh of the Lilac Tunic & Trousers
function Detailed3DGarment({ isBack = false }: { isBack?: boolean }) {
  const meshGroupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    let animationFrameId: number
    const startTime = Date.now()
    
    const animate = () => {
      if (meshGroupRef.current) {
        const elapsed = (Date.now() - startTime) / 1000
        meshGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.03
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Exact Lavender Color Palette
  const lilacFabric = '#e3cbf0' // Soft pastel lilac
  const pipingWhite = '#ffffff' // White piping accent
  const knotPurple = '#b07fcc' // Frog knot buttons
  const darkMannequin = '#291d33' // Mannequin stand

  return (
    <group ref={meshGroupRef} rotation={[0, isBack ? Math.PI : 0, 0]} position={[0, -0.15, 0]}>
      {/* 1. Mannequin Support Base */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
        <meshStandardMaterial color={darkMannequin} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.8, 16]} />
        <meshStandardMaterial color="#c29f62" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 2. TUNIC TOP (ROSE-LILAC LOOSE SILK BLOUSE) */}
      {/* Torso Shell */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.26, 0.33, 0.88, 32]} />
        <meshStandardMaterial
          color={lilacFabric}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle Jacquard Weave Grid Pattern */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.262, 0.332, 0.882, 20, 6]} />
        <meshStandardMaterial color="#d4b4e2" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Left 3/4 Wide Sleeve */}
      <mesh position={[-0.34, 0.55, 0]} rotation={[0, 0, Math.PI / 10]}>
        <cylinderGeometry args={[0.13, 0.17, 0.52, 20]} />
        <meshStandardMaterial color={lilacFabric} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Right 3/4 Wide Sleeve */}
      <mesh position={[0.34, 0.55, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <cylinderGeometry args={[0.13, 0.17, 0.52, 20]} />
        <meshStandardMaterial color={lilacFabric} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Wide Sleeve Hem Cuffs */}
      <mesh position={[-0.41, 0.3, 0]} rotation={[0, 0, Math.PI / 10]}>
        <torusGeometry args={[0.172, 0.01, 8, 32]} />
        <meshStandardMaterial color="#d1a9df" />
      </mesh>
      <mesh position={[0.41, 0.3, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <torusGeometry args={[0.172, 0.01, 8, 32]} />
        <meshStandardMaterial color="#d1a9df" />
      </mesh>

      {/* Round Crew Collar */}
      <mesh position={[0, 0.89, 0]}>
        <torusGeometry args={[0.138, 0.01, 12, 32]} />
        <meshStandardMaterial color={pipingWhite} />
      </mesh>

      {/* White Diagonal Piping Accent (Front Only) */}
      {!isBack && (
        <>
          <mesh position={[0.07, 0.82, 0.15]} rotation={[0, 0, -Math.PI / 5]}>
            <boxGeometry args={[0.22, 0.012, 0.008]} />
            <meshStandardMaterial color={pipingWhite} />
          </mesh>

          {/* Dual Frog Knot Buttons */}
          <mesh position={[0.08, 0.83, 0.16]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.06, 0.022, 0.022]} />
            <meshStandardMaterial color={knotPurple} metalness={0.5} />
          </mesh>
          <mesh position={[0.12, 0.77, 0.16]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.06, 0.022, 0.022]} />
            <meshStandardMaterial color={knotPurple} metalness={0.5} />
          </mesh>
        </>
      )}

      {/* Tunic Bottom Hem & Side Slits */}
      <mesh position={[-0.32, 0.12, 0]}>
        <boxGeometry args={[0.01, 0.22, 0.01]} />
        <meshStandardMaterial color="#c397d5" />
      </mesh>
      <mesh position={[0.32, 0.12, 0]}>
        <boxGeometry args={[0.01, 0.22, 0.01]} />
        <meshStandardMaterial color="#c397d5" />
      </mesh>

      {/* 3. WIDE-LEG TROUSERS */}
      {/* Left Pant Leg */}
      <mesh position={[-0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 1.15, 24]} />
        <meshStandardMaterial color={lilacFabric} roughness={0.45} metalness={0.1} />
      </mesh>

      {/* Right Pant Leg */}
      <mesh position={[0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 1.15, 24]} />
        <meshStandardMaterial color={lilacFabric} roughness={0.45} metalness={0.1} />
      </mesh>

      {/* Wide Cuff Hem Lines */}
      <mesh position={[-0.15, -1.2, 0]}>
        <torusGeometry args={[0.192, 0.008, 8, 32]} />
        <meshStandardMaterial color="#c397d5" />
      </mesh>
      <mesh position={[0.15, -1.2, 0]}>
        <torusGeometry args={[0.192, 0.008, 8, 32]} />
        <meshStandardMaterial color="#c397d5" />
      </mesh>
    </group>
  )
}

export default function LavenderModelView() {
  const { addToCart, products } = useStore()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeFrameTab, setActiveFrameTab] = useState<'3d' | 'model'>('3d')

  const outfitProduct = products.find((p) => p.id === 100) || {
    id: 100,
    name: 'Rose Lavender Mandarin Silk Set (2-Piece)',
    title: 'Rose Lavender Mandarin Silk Set (2-Piece)',
    price: 4000,
    originalPrice: 4800,
    category: 'Premium',
    description: 'Double Side Frame luxury set featuring mandarin knot closures, 3/4 wide sleeves, and wide-leg trousers.',
    badge: '3D Featured',
    image: '🌸'
  }

  const handleAddToCart = () => {
    addToCart(outfitProduct)
    toast({
      title: 'Added to Cart! 🛒',
      description: `${outfitProduct.name} has been added to your shopping cart.`,
    })
  }

  // 6 Circular Feature Icons matching the picture
  const iconBadges = [
    { title: 'Premium Fabric', label: 'Jacquard Silk', emoji: '🧶' },
    { title: 'Breathable & Comfortable', label: 'Airflow Blend', emoji: '🌬️' },
    { title: 'Relaxed Fit', label: 'Tunic Style', emoji: '👕' },
    { title: 'Relaxed Fit', label: 'Wide Legs', emoji: '✂️' },
    { title: 'Elegant Design', label: 'Frog Knots', emoji: '🪢' },
    { title: 'All Day Comfort', label: 'Pure Comfort', emoji: '🍃' },
  ]

  return (
    <section className="py-16 bg-[#fcf8f4] text-stone-900 border-y border-stone-200/80 font-serif overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-purple-900/70 block">
            Boutique Luxury Collection
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-wider text-stone-900 uppercase">
            Double Side Frame
          </h2>
          <p className="text-xs font-sans text-stone-500 uppercase tracking-widest">
            3D Garment Model & Live Model View
          </p>

          {/* Toggle Switch */}
          <div className="flex justify-center gap-2 mt-4 font-sans text-xs">
            <button
              onClick={() => setActiveFrameTab('3d')}
              className={`px-5 py-2 rounded-full uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeFrameTab === '3d'
                  ? 'bg-purple-900 text-purple-50 shadow-md'
                  : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              3D Render Frame
            </button>
            <button
              onClick={() => setActiveFrameTab('model')}
              className={`px-5 py-2 rounded-full uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeFrameTab === 'model'
                  ? 'bg-purple-900 text-purple-50 shadow-md'
                  : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              Model Lookbook Frame
            </button>
          </div>
        </div>

        {/* DUAL FRAME CONTAINER matching picture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ================= LEFT FRAME: 3D MODEL ================= */}
          <div className="bg-[#f7efe7] border-2 border-[#e6d5c5] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            {/* Inner Double Border Frame Accent */}
            <div className="absolute inset-2 border border-[#d9c0a9]/60 rounded-xl pointer-events-none" />

            <div>
              {/* Header inside Frame */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-widest uppercase text-stone-800">
                  Double Side Frame
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-purple-900/80 bg-purple-100 px-3 py-1 rounded-full mt-1 inline-block">
                  3D Model
                </span>
              </div>

              {/* 3D Model Display (Front View & Back View side-by-side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-96 relative">
                {/* FRONT VIEW 3D CANVAS */}
                <div className="bg-[#f0e4d7]/70 rounded-xl border border-[#e2ceb8] relative overflow-hidden flex flex-col items-center justify-between p-2">
                  <div className="w-full h-80">
                    <Canvas>
                      <PerspectiveCamera makeDefault position={[0, 0, 3.8]} />
                      <ambientLight intensity={1.1} />
                      <directionalLight position={[4, 5, 5]} intensity={1.5} color="#ffffff" />
                      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#d8b4e2" />
                      <Detailed3DGarment isBack={false} />
                      <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>
                  </div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-700 pb-1">
                    Front View
                  </span>
                </div>

                {/* BACK VIEW 3D CANVAS */}
                <div className="bg-[#f0e4d7]/70 rounded-xl border border-[#e2ceb8] relative overflow-hidden flex flex-col items-center justify-between p-2">
                  <div className="w-full h-80">
                    <Canvas>
                      <PerspectiveCamera makeDefault position={[0, 0, 3.8]} />
                      <ambientLight intensity={1.1} />
                      <directionalLight position={[4, 5, 5]} intensity={1.5} color="#ffffff" />
                      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#d8b4e2" />
                      <Detailed3DGarment isBack={true} />
                      <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>
                  </div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-700 pb-1">
                    Back View
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom 6 Circular Icons Bar matching the picture */}
            <div className="mt-8 pt-6 border-t border-[#e2ceb8] grid grid-cols-3 sm:grid-cols-6 gap-3 text-center font-sans">
              {iconBadges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div className="w-10 h-10 rounded-full border border-stone-400 bg-white/80 flex items-center justify-center text-lg shadow-sm">
                    {badge.emoji}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-tight text-stone-800 leading-tight">
                    {badge.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT FRAME: MODEL VIEW ================= */}
          <div className="bg-[#f7efe7] border-2 border-[#e6d5c5] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            {/* Inner Double Border Frame Accent */}
            <div className="absolute inset-2 border border-[#d9c0a9]/60 rounded-xl pointer-events-none" />

            <div>
              {/* Header inside Frame */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-widest uppercase text-stone-800">
                  Double Side Frame
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-purple-900/80 bg-purple-100 px-3 py-1 rounded-full mt-1 inline-block">
                  Model View
                </span>
              </div>

              {/* Model View Photo Display (Front View & Back View side-by-side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                
                {/* Front Model View Card */}
                <div className="bg-gradient-to-b from-[#efe1d4] to-[#f4e8dc] border border-[#e2ceb8] rounded-xl p-4 flex flex-col items-center justify-between text-center space-y-3 min-h-[380px]">
                  <div className="w-full flex-1 rounded-lg bg-[#e7d4c2]/50 border border-[#dac1ab] p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                    <span className="text-6xl">🌸</span>
                    <div className="space-y-1">
                      <span className="text-sm font-bold tracking-wider text-purple-950 block uppercase">
                        Lilac Silk Tunic
                      </span>
                      <p className="text-[10px] font-sans text-stone-600">
                        Mandarin Frog-Knot Collar & 3/4 Wide Sleeves
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-700">
                    Front View
                  </span>
                </div>

                {/* Back Model View Card */}
                <div className="bg-gradient-to-b from-[#efe1d4] to-[#f4e8dc] border border-[#e2ceb8] rounded-xl p-4 flex flex-col items-center justify-between text-center space-y-3 min-h-[380px]">
                  <div className="w-full flex-1 rounded-lg bg-[#e7d4c2]/50 border border-[#dac1ab] p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                    <span className="text-6xl">✨</span>
                    <div className="space-y-1">
                      <span className="text-sm font-bold tracking-wider text-purple-950 block uppercase">
                        Tailored Back Fit
                      </span>
                      <p className="text-[10px] font-sans text-stone-600">
                        Wide-Leg Trousers & Graceful Silhouette
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-700">
                    Back View
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Purchase CTA Bar */}
            <div className="mt-8 pt-6 border-t border-[#e2ceb8] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <div className="text-center sm:text-left">
                <span className="text-xs text-stone-500 font-medium block">Boutique Retail Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-950">{formatPrice(outfitProduct.price)}</span>
                  {outfitProduct.originalPrice && (
                    <span className="text-xs text-stone-400 line-through font-mono">
                      {formatPrice(outfitProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer text-stone-700"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-purple-950 hover:bg-purple-900 text-purple-50 font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add Outfit to Cart
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
