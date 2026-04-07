'use client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import { isLowEnd, isMobile } from '../../lib/utils'
import ParticleNetwork from './ParticleNetwork'
import CoreOrb from './CoreOrb'

function Scene({ particleCount }) {
  const mouse = useMouseParallax()
  return (
    <>
      {/* Warm white ambient — critical for light theme feel */}
      <ambientLight intensity={1.8} color="#F8F8FF" />
      <directionalLight position={[5, 5, 5]}  intensity={1.2} color="#EEF2FF" />
      <pointLight position={[4, 3, 4]}   intensity={2}   color="#818CF8" />
      <pointLight position={[-4, -3, 2]} intensity={1.2} color="#06B6D4" />
      <pointLight position={[0, 5, -3]}  intensity={0.6} color="#C4B5FD" />

      <group>
        <ParticleNetwork count={particleCount} mouse={mouse} />
        <CoreOrb mouse={mouse} />
      </group>
    </>
  )
}

export default function HeroScene() {
  const low    = typeof window !== 'undefined' && isLowEnd()
  const mobile = typeof window !== 'undefined' && isMobile()
  const count  = low ? 35 : mobile ? 60 : 110

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: !low, alpha: true, powerPreference: low ? 'low-power' : 'high-performance', stencil: false }}
      dpr={low ? 1 : [1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene particleCount={count} />
      </Suspense>
    </Canvas>
  )
}
