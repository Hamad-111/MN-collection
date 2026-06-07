'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function LuxuryDressModel() {
  const mannequinRef = useRef<THREE.Group>(null)

  useEffect(() => {
    let animationFrameId: number
    const startTime = Date.now()
    
    const animate = () => {
      if (mannequinRef.current) {
        const elapsed = (Date.now() - startTime) / 1000
        // Soft floating (bobbing) effect
        mannequinRef.current.position.y = Math.sin(elapsed * 1.2) * 0.08
        // Slow continuous rotation
        mannequinRef.current.rotation.y = elapsed * 0.25
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <group ref={mannequinRef}>
      {/* 1. Mannequin Stand */}
      {/* Heavy circular base */}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 32]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      
      {/* Vertical brass rod */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 3.0, 16]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      
      {/* Neck Cap / Sphere stopper */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Horizontal shoulder hanger bar */}
      <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.55, 16]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* 2. Dress Bodice / Corset (Champagne Silk / Satin) */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.22, 0.14, 0.45, 16]} />
        <meshStandardMaterial
          color="#f5ede0" // Warm champagne/ivory silk
          metalness={0.3}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Bodice Wireframe Overlay (Luxury Gold Details) */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.222, 0.142, 0.452, 12, 2]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* 3. Waist Belt / Ribbon */}
      <mesh position={[0, 0.525, 0]}>
        <torusGeometry args={[0.145, 0.015, 8, 32]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* 4. Layered Gown Skirt */}
      {/* Outer Pleated Skirt (Wireframe lines to simulate gold folds) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.14, 0.85, 1.44, 16, 1, true]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* Inner Gown Shell (Semi-transparent champagne gold silk) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.138, 0.83, 1.43, 32, 4, true]} />
        <meshStandardMaterial
          color="#ebd6b6"
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Sheer / Tulle Taper (Creates depth / glassmorphism) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.135, 0.92, 1.42, 32, 4, true]} />
        <meshStandardMaterial
          color="#aa8c5c"
          metalness={0.2}
          roughness={0.8}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Decorative Ruffle Hoop Rings */}
      {/* Mid Skirt Ring */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.35, 0.012, 8, 32]} />
        <meshStandardMaterial color="#c29f62" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Lower Skirt Ring */}
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[0.60, 0.012, 8, 32]} />
        <meshStandardMaterial color="#c29f62" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Hemline Ring */}
      <mesh position={[0, -0.92, 0]}>
        <torusGeometry args={[0.85, 0.015, 8, 32]} />
        <meshStandardMaterial color="#c29f62" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export default function ProductCube() {
  return (
    <div className="w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden bg-gradient-to-br from-card via-muted/30 to-card border border-border/50 shadow-2xl shadow-secondary/5 relative">
      {/* Glassmorphic border lines */}
      <div className="absolute inset-px rounded-[23px] border border-white/40 pointer-events-none z-10" />
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3.8]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 5, 5]} intensity={1.6} color="#fffdfa" />
        <pointLight position={[-5, -5, 5]} intensity={0.9} color="#c29f62" />
        <pointLight position={[0, 5, -5]} intensity={0.6} color="#4a3c2a" />
        
        <LuxuryDressModel />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}
