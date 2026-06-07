'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function LuxuryModel() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    let animationFrameId: number
    const animate = () => {
      if (outerRef.current) {
        outerRef.current.rotation.x += 0.003
        outerRef.current.rotation.y += 0.005
        outerRef.current.rotation.z += 0.002
      }
      if (innerRef.current) {
        innerRef.current.rotation.x -= 0.005
        innerRef.current.rotation.y -= 0.003
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <group>
      {/* Outer Dodecahedron Cage (Polished Brass Gold) */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#c29f62"
          metalness={0.95}
          roughness={0.1}
          wireframe
          wireframeLinewidth={2}
        />
      </mesh>

      {/* Inner Transparent Shell (Amber Gold Tint) */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.48, 0]} />
        <meshStandardMaterial
          color="#aa8c5c"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Center Jewel / Core (Deep Bronze Gold) */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#4a3c2a"
          metalness={0.9}
          roughness={0.1}
          emissive="#c29f62"
          emissiveIntensity={0.5}
        />
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
        <PerspectiveCamera makeDefault position={[0, 0, 4.2]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fffdfa" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#c29f62" />
        <pointLight position={[0, 5, -5]} intensity={0.5} color="#4a3c2a" />
        <LuxuryModel />
        <OrbitControls
          autoRotate
          autoRotateSpeed={1.5}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}
