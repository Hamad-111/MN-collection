'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCw, Camera, ShoppingCart, Heart, Check, Sparkles } from 'lucide-react'
import { useStore } from './store-provider'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

// Color variant specifications matching the 4 uploaded pictures
export interface ColorVariant {
  id: string
  name: string
  colorHex: string
  baseColor: string
  weaveColor: string
  pipingWhite: string
  knotColor: string
  bgGradient: string
  price: number
  originalPrice: number
  description: string
}

export const fontVariants: ColorVariant[] = [
  {
    id: 'rose-lavender',
    name: 'Rose Lavender Set',
    colorHex: '#d6a3be',
    baseColor: '#d6a3be',
    weaveColor: '#be87a5',
    pipingWhite: '#ffffff',
    knotColor: '#b07f9c',
    bgGradient: 'from-[#f7ebe6] to-[#f4ded6]',
    price: 4000,
    originalPrice: 4800,
    description: 'Dusty rose pinkish-lavender tunic & trouser set with mandarin frog knots and side slits.',
  },
  {
    id: 'midnight-black',
    name: 'Midnight Black Set',
    colorHex: '#222225',
    baseColor: '#222225',
    weaveColor: '#3a3a40',
    pipingWhite: '#ffffff',
    knotColor: '#e2e8f0',
    bgGradient: 'from-[#ececec] to-[#dfdfdf]',
    price: 4000,
    originalPrice: 4800,
    description: 'Onyx midnight black silk tunic set with silver-white frog button closures.',
  },
  {
    id: 'ivory-cream',
    name: 'Ivory Cream Set',
    colorHex: '#f5f0e6',
    baseColor: '#f5f0e6',
    weaveColor: '#e2d7c5',
    pipingWhite: '#d4af37',
    knotColor: '#d9c7af',
    bgGradient: 'from-[#fbf8f2] to-[#f3ecdf]',
    price: 4000,
    originalPrice: 4800,
    description: 'Pearl ivory cream silk tunic set with champagne gold piping and relaxed wide legs.',
  },
  {
    id: 'sage-mint',
    name: 'Sage Mint Green Set',
    colorHex: '#b8cbb8',
    baseColor: '#b8cbb8',
    weaveColor: '#9bb39b',
    pipingWhite: '#ffffff',
    knotColor: '#8ca48c',
    bgGradient: 'from-[#edf3ed] to-[#dce7dc]',
    price: 4000,
    originalPrice: 4800,
    description: 'Pastel sage mint green silk tunic set featuring white piping trim and wide cuffs.',
  },
]

// Create a realistic silk damask cloth texture
function generateSilkClothTexture(baseHex: string, patternHex: string) {
  if (typeof window === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = baseHex
  ctx.fillRect(0, 0, 512, 512)

  ctx.fillStyle = patternHex
  ctx.globalAlpha = 0.22
  for (let y = 0; y < 512; y += 16) {
    for (let x = 0; x < 512; x += 16) {
      if ((x + y) % 32 === 0) {
        ctx.beginPath()
        ctx.arc(x + 8, y + 8, 6, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(x + 4, y + 4, 3, 3)
      }
    }
  }

  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 512
    const ry = Math.random() * 512
    ctx.fillRect(rx, ry, 1, 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 6)
  return texture
}

// 3D Model Render for the Selected Color Variant
function ColorVariant3DOutfit({
  variant,
  targetRotation,
  isBack = false,
}: {
  variant: ColorVariant
  targetRotation: number
  isBack?: boolean
}) {
  const modelGroupRef = useRef<THREE.Group>(null)
  const [textureMap, setTextureMap] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    const tex = generateSilkClothTexture(variant.baseColor, variant.weaveColor)
    if (tex) setTextureMap(tex)
  }, [variant])

  useEffect(() => {
    let animationFrameId: number
    const animate = () => {
      if (modelGroupRef.current) {
        const currentRot = modelGroupRef.current.rotation.y
        const targetRot = isBack ? Math.PI + targetRotation : targetRotation
        modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(currentRot, targetRot, 0.08)
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [targetRotation, isBack])

  return (
    <group ref={modelGroupRef} position={[0, -0.15, 0]}>
      {/* Shadow */}
      <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, 0.75, 32]} />
        <meshBasicMaterial color="#4a3b42" transparent opacity={0.18} />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 32]} />
        <meshStandardMaterial color="#2d2228" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.8, 16]} />
        <meshStandardMaterial color="#c29f62" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* TUNIC TOP */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.26, 0.33, 0.88, 32]} />
        <meshStandardMaterial
          color={variant.baseColor}
          map={textureMap || undefined}
          roughness={0.32}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Folds */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.262, 0.332, 0.882, 16, 8]} />
        <meshStandardMaterial color={variant.weaveColor} wireframe transparent opacity={0.15} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-0.34, 0.55, 0]} rotation={[0, 0, Math.PI / 10]}>
        <cylinderGeometry args={[0.13, 0.17, 0.52, 24]} />
        <meshStandardMaterial
          color={variant.baseColor}
          map={textureMap || undefined}
          roughness={0.3}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0.34, 0.55, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <cylinderGeometry args={[0.13, 0.17, 0.52, 24]} />
        <meshStandardMaterial
          color={variant.baseColor}
          map={textureMap || undefined}
          roughness={0.3}
          metalness={0.08}
        />
      </mesh>

      {/* Sleeve Cuffs */}
      <mesh position={[-0.41, 0.3, 0]} rotation={[0, 0, Math.PI / 10]}>
        <torusGeometry args={[0.172, 0.008, 8, 32]} />
        <meshStandardMaterial color={variant.weaveColor} />
      </mesh>
      <mesh position={[0.41, 0.3, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <torusGeometry args={[0.172, 0.008, 8, 32]} />
        <meshStandardMaterial color={variant.weaveColor} />
      </mesh>

      {/* Collar & Piping */}
      <mesh position={[0, 0.89, 0]}>
        <torusGeometry args={[0.138, 0.01, 12, 32]} />
        <meshStandardMaterial color={variant.pipingWhite} roughness={0.2} />
      </mesh>
      <mesh position={[0.07, 0.82, 0.15]} rotation={[0, 0, -Math.PI / 5]}>
        <boxGeometry args={[0.22, 0.012, 0.008]} />
        <meshStandardMaterial color={variant.pipingWhite} roughness={0.2} />
      </mesh>

      {/* Frog Knots */}
      <mesh position={[0.08, 0.83, 0.16]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.065, 0.024, 0.024]} />
        <meshStandardMaterial color={variant.knotColor} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.77, 0.16]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.065, 0.024, 0.024]} />
        <meshStandardMaterial color={variant.knotColor} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Side Slits */}
      <mesh position={[-0.32, 0.12, 0]}>
        <boxGeometry args={[0.01, 0.22, 0.01]} />
        <meshStandardMaterial color={variant.weaveColor} />
      </mesh>
      <mesh position={[0.32, 0.12, 0]}>
        <boxGeometry args={[0.01, 0.22, 0.01]} />
        <meshStandardMaterial color={variant.weaveColor} />
      </mesh>

      {/* TROUSERS */}
      <mesh position={[-0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 1.15, 24]} />
        <meshStandardMaterial
          color={variant.baseColor}
          map={textureMap || undefined}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 1.15, 24]} />
        <meshStandardMaterial
          color={variant.baseColor}
          map={textureMap || undefined}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[-0.15, -1.2, 0]}>
        <torusGeometry args={[0.192, 0.008, 8, 32]} />
        <meshStandardMaterial color={variant.weaveColor} />
      </mesh>
      <mesh position={[0.15, -1.2, 0]}>
        <torusGeometry args={[0.192, 0.008, 8, 32]} />
        <meshStandardMaterial color={variant.weaveColor} />
      </mesh>
    </group>
  )
}

export default function SilkRouteViewer() {
  const { addToCart } = useStore()
  const { toast } = useToast()

  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(fontVariants[0])
  const [activeTab, setActiveTab] = useState<'3d' | 'model'>('3d')
  const [rotAngle, setRotAngle] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: 100,
      name: `Mandarin Suit — ${selectedVariant.name}`,
      title: `Mandarin Suit — ${selectedVariant.name}`,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      category: 'Premium',
      description: selectedVariant.description,
      badge: 'Double Side Frame',
      image: selectedVariant.id === 'midnight-black' ? '🖤' : selectedVariant.id === 'ivory-cream' ? '🤍' : selectedVariant.id === 'sage-mint' ? '🌿' : '🌸'
    })
    toast({
      title: 'Added to Cart! 🛒',
      description: `${selectedVariant.name} has been added to your shopping cart.`,
    })
  }

  // 6 Circular Badges from picture bottom bar
  const featureBadges = [
    { title: 'Premium Fabric', emoji: '🧶' },
    { title: 'Breathable & Comfortable', emoji: '🌬️' },
    { title: 'Relaxed Fit', emoji: '👕' },
    { title: 'Relaxed Fit', emoji: '✂️' },
    { title: 'Elegant Design', emoji: '🪢' },
    { title: 'All Day Comfort', emoji: '🍃' },
  ]

  return (
    <section className="py-16 bg-[#fbf7f4] text-stone-900 font-serif border-y border-[#e6d8ce] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10 space-y-3">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#7a425b]">
            Signature Collection
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[0.2em] text-stone-900 uppercase">
            DOUBLE SIDE FRAME
          </h2>
          <p className="text-xs font-sans text-stone-500 uppercase tracking-widest">
            3D Garment Model & Live Model Lookbook View
          </p>

          {/* 4 COLOR VARIANT SELECTOR SWATCHES */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-3 font-sans">
            <span className="text-xs font-bold text-stone-600 mr-2">Color Palette:</span>
            {fontVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedVariant.id === variant.id
                    ? 'border-purple-900 bg-purple-950 text-white shadow-md scale-105'
                    : 'border-stone-300 bg-white text-stone-700 hover:border-purple-300'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: variant.colorHex }}
                />
                {variant.name}
              </button>
            ))}
          </div>

          {/* MODE TOGGLE */}
          <div className="flex justify-center gap-2 pt-2 font-sans text-xs">
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-5 py-2 rounded-full uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === '3d'
                  ? 'bg-[#7a425b] text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> 3D Model Render
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-5 py-2 rounded-full uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'model'
                  ? 'bg-[#7a425b] text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Real Model Shoot View
            </button>
          </div>
        </div>

        {/* DOUBLE SIDE FRAME SHOWCASE CONTAINER matching pictures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ================= LEFT FRAME: 3D MODEL ================= */}
          <div className="bg-[#f7efe7] border-2 border-[#e6d5c5] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-2 border border-[#d9c0a9]/60 rounded-xl pointer-events-none" />

            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-widest uppercase text-stone-800">
                  DOUBLE SIDE FRAME
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-purple-900 bg-purple-100 px-3 py-1 rounded-full mt-1 inline-block">
                  3D MODEL — {selectedVariant.name}
                </span>
              </div>

              {/* 3D Side-by-Side Display */}
              <div className="grid grid-cols-2 gap-3 h-96 relative bg-[#f0e4d7]/70 rounded-xl border border-[#e2ceb8] p-2">
                {/* Front Canvas */}
                <div className="relative w-full h-full">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 3.8]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[4, 5, 5]} intensity={1.6} color="#ffffff" />
                    <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#d8b4e2" />
                    <ColorVariant3DOutfit
                      variant={selectedVariant}
                      targetRotation={rotAngle}
                      isBack={false}
                    />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-sans font-bold uppercase tracking-widest text-stone-700">
                    Front View
                  </span>
                </div>

                {/* Back Canvas */}
                <div className="relative w-full h-full">
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 3.8]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[4, 5, 5]} intensity={1.6} color="#ffffff" />
                    <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#d8b4e2" />
                    <ColorVariant3DOutfit
                      variant={selectedVariant}
                      targetRotation={rotAngle}
                      isBack={true}
                    />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-sans font-bold uppercase tracking-widest text-stone-700">
                    Back View
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom 6 Circular Icons Bar matching the picture */}
            <div className="mt-8 pt-6 border-t border-[#e2ceb8] grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-sans">
              {featureBadges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div className="w-10 h-10 rounded-full border border-stone-400 bg-white flex items-center justify-center text-base shadow-sm">
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
          <div className="bg-[#f7efe7] border-2 border-[#e6d5c5] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-2 border border-[#d9c0a9]/60 rounded-xl pointer-events-none" />

            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold tracking-widest uppercase text-stone-800">
                  MODEL VIEW
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-purple-900 bg-purple-100 px-3 py-1 rounded-full mt-1 inline-block">
                  {selectedVariant.name}
                </span>
              </div>

              {/* Model View Display Cards matching the uploaded pictures */}
              <div className="grid grid-cols-2 gap-4 relative">
                
                {/* Front Model View Card */}
                <div className="bg-gradient-to-b from-[#efe1d4] to-[#f4e8dc] border border-[#e2ceb8] rounded-xl p-4 flex flex-col items-center justify-between text-center space-y-3 min-h-[380px]">
                  <div className="w-full flex-1 rounded-lg bg-[#e7d4c2]/60 border border-[#dac1ab] p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                    <span className="text-6xl">
                      {selectedVariant.id === 'midnight-black' ? '🖤' : selectedVariant.id === 'ivory-cream' ? '🤍' : selectedVariant.id === 'sage-mint' ? '🌿' : '🌸'}
                    </span>
                    <div className="space-y-1">
                      <span className="text-sm font-bold tracking-wider text-purple-950 block uppercase">
                        {selectedVariant.name}
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
                  <div className="w-full flex-1 rounded-lg bg-[#e7d4c2]/60 border border-[#dac1ab] p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                    <span className="text-6xl">✨</span>
                    <div className="space-y-1">
                      <span className="text-sm font-bold tracking-wider text-purple-950 block uppercase">
                        Tailored Silhouette
                      </span>
                      <p className="text-[10px] font-sans text-stone-600">
                        Relaxed Fit & Wide-Leg Trousers
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-700">
                    Back View
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Purchase Bar */}
            <div className="mt-8 pt-6 border-t border-[#e2ceb8] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <div className="text-center sm:text-left">
                <span className="text-xs text-stone-500 font-medium block">Selected Color: {selectedVariant.name}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-950">{formatPrice(selectedVariant.price)}</span>
                  <span className="text-xs text-stone-400 line-through font-mono">{formatPrice(selectedVariant.originalPrice)}</span>
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
                  className="flex-1 sm:flex-initial px-6 py-3 bg-purple-950 hover:bg-purple-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
