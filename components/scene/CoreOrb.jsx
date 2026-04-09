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
  const ring3Ref = useRef()
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime
    const mx = mouse.current.x
    const my = -mouse.current.y

    outerRef.current.rotation.y = t * 0.07
    outerRef.current.rotation.x = Math.sin(t * 0.11) * 0.1
    coreRef.current.rotation.y  = -t * 0.10
    coreRef.current.rotation.z  =  t * 0.05

    ring1Ref.current.rotation.z = t * 0.09
    ring1Ref.current.rotation.x = t * 0.03
    ring2Ref.current.rotation.z = -t * 0.05
    ring2Ref.current.rotation.y =  t * 0.07
    ring3Ref.current.rotation.x =  t * 0.04
    ring3Ref.current.rotation.z = -t * 0.03

    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, my * 0.13, 0.04)
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, mx * 0.13, 0.04)
  })

  return (
    <Float speed={0.65} floatIntensity={0.28} rotationIntensity={0}>
      <group ref={groupRef}>
        {/* Outer warm ambient glow */}
        <mesh>
          <sphereGeometry args={[1.7, 16, 16]} />
          <meshBasicMaterial
            color="#C9963A"
            transparent
            opacity={0.025}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer wireframe — forest green */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshBasicMaterial color="#2D6A4F" wireframe transparent opacity={0.18} />
        </mesh>

        {/* Main sphere — warm cream frosted glass */}
        <mesh ref={coreRef}>
          <Sphere args={[0.80, 64, 64]}>
            <MeshDistortMaterial
              color="#F5EFE3"
              distort={0.20}
              speed={1.6}
              roughness={0.08}
              metalness={0.04}
              emissive="#2D6A4F"
              emissiveIntensity={0.08}
              transparent
              opacity={0.88}
            />
          </Sphere>
        </mesh>

        {/* Inner forest green core */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color="#1B4332"
            emissive="#2D6A4F"
            emissiveIntensity={0.75}
            roughness={0.12}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Gold hot center */}
        <mesh>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial
            color="#C9963A"
            emissive="#E8B65A"
            emissiveIntensity={1.4}
            roughness={0.05}
            transparent
            opacity={0.92}
          />
        </mesh>

        {/* Ring 1 — forest green */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.38, 0.007, 4, 80]} />
          <meshBasicMaterial color="#2D6A4F" transparent opacity={0.45} />
        </mesh>

        {/* Ring 2 — gold */}
        <mesh ref={ring2Ref} rotation={[0.5, 0, Math.PI / 4]}>
          <torusGeometry args={[1.62, 0.006, 4, 80]} />
          <meshBasicMaterial color="#C9963A" transparent opacity={0.38} />
        </mesh>

        {/* Ring 3 — thin sage */}
        <mesh ref={ring3Ref} rotation={[-0.3, Math.PI / 3, 0]}>
          <torusGeometry args={[1.48, 0.004, 4, 60]} />
          <meshBasicMaterial color="#4A7C59" transparent opacity={0.25} />
        </mesh>

        {/* Forest green point light */}
        <pointLight color="#2D6A4F" intensity={1.6} distance={4} />
        {/* Gold accent light */}
        <pointLight color="#C9963A" intensity={0.9} distance={2.5} position={[0.6, 0.5, 0.5]} />
      </group>
    </Float>
  )
}
