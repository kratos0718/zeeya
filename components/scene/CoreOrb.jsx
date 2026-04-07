'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { lerp } from '../../lib/utils'

export default function CoreOrb({ mouse }) {
  const outerRef = useRef()
  const coreRef  = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime
    const mx = mouse.current.x
    const my = -mouse.current.y

    outerRef.current.rotation.y = t * 0.07
    outerRef.current.rotation.x = Math.sin(t * 0.12) * 0.1
    coreRef.current.rotation.y  = -t * 0.11
    coreRef.current.rotation.z  =  t * 0.05

    ring1Ref.current.rotation.z = t * 0.08
    ring1Ref.current.rotation.x = t * 0.03
    ring2Ref.current.rotation.z = -t * 0.05
    ring2Ref.current.rotation.y =  t * 0.06

    // Smooth mouse parallax
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, my * 0.14, 0.04)
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, mx * 0.14, 0.04)
  })

  return (
    <Float speed={0.7} floatIntensity={0.3} rotationIntensity={0}>
      <group ref={groupRef}>
        {/* Outer soft glow */}
        <mesh>
          <sphereGeometry args={[1.6, 16, 16]} />
          <meshBasicMaterial
            color="#818CF8"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer wireframe — light indigo */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color="#C4B5FD" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Main sphere — frosted glass look */}
        <mesh ref={coreRef}>
          <Sphere args={[0.78, 64, 64]}>
            <MeshDistortMaterial
              color="#EEF2FF"
              distort={0.22}
              speed={1.8}
              roughness={0.1}
              metalness={0.05}
              emissive="#818CF8"
              emissiveIntensity={0.12}
              transparent
              opacity={0.92}
            />
          </Sphere>
        </mesh>

        {/* Inner glowing core — indigo */}
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial
            color="#6366F1"
            emissive="#6366F1"
            emissiveIntensity={0.8}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Cyan accent core */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#06B6D4"
            emissiveIntensity={1.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Ring 1 — indigo */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.38, 0.007, 4, 80]} />
          <meshBasicMaterial color="#818CF8" transparent opacity={0.5} />
        </mesh>

        {/* Ring 2 — cyan */}
        <mesh ref={ring2Ref} rotation={[0.5, 0, Math.PI / 4]}>
          <torusGeometry args={[1.6, 0.005, 4, 80]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.35} />
        </mesh>

        <pointLight color="#6366F1" intensity={1.5} distance={4} />
        <pointLight color="#06B6D4" intensity={0.8} distance={2.5} position={[0.5, 0.5, 0.5]} />
      </group>
    </Float>
  )
}
