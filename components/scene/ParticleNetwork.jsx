'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { lerp } from '../../lib/utils'

const POINT_COLOR = new THREE.Color('#4A7C59')  // sage green
const LINE_COLOR  = new THREE.Color('#C9963A')  // warm gold

export default function ParticleNetwork({ count = 100, mouse }) {
  const pointsRef = useRef()
  const linesRef  = useRef()

  const { positions, velocities, phases } = useMemo(() => {
    const positions  = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const phases     = new Float32Array(count)
    const S = 5.5
    for (let i = 0; i < count; i++) {
      positions[i*3]     = (Math.random() - 0.5) * S
      positions[i*3 + 1] = (Math.random() - 0.5) * S
      positions[i*3 + 2] = (Math.random() - 0.5) * 2.5
      velocities[i*3]     = (Math.random() - 0.5) * 0.0018
      velocities[i*3 + 1] = (Math.random() - 0.5) * 0.0018
      velocities[i*3 + 2] = (Math.random() - 0.5) * 0.0008
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, velocities, phases }
  }, [count])

  const maxLines    = count * 4
  const linePos     = useMemo(() => new Float32Array(maxLines * 6), [maxLines])
  const lineGeo     = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    return g
  }, [linePos])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const mx =  mouse.current.x * 0.25
    const my = -mouse.current.y * 0.25

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3]     += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1] + Math.sin(t * 0.35 + phases[i]) * 0.0007
      positions[i3 + 2] += velocities[i3 + 2]

      const H = 3.2
      if (Math.abs(positions[i3])     > H) velocities[i3]     *= -1
      if (Math.abs(positions[i3 + 1]) > H) velocities[i3 + 1] *= -1
      if (Math.abs(positions[i3 + 2]) > 1.8) velocities[i3 + 2] *= -1
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Mouse parallax
    pointsRef.current.parent.rotation.x = lerp(pointsRef.current.parent.rotation.x, my * 0.1, 0.035)
    pointsRef.current.parent.rotation.y = lerp(pointsRef.current.parent.rotation.y, mx * 0.1, 0.035)

    // Lines
    const THRESH = 1.7
    let li = 0
    for (let i = 0; i < count && li < maxLines - 1; i++) {
      for (let j = i + 1; j < count && li < maxLines - 1; j++) {
        const dx = positions[i*3]   - positions[j*3]
        const dy = positions[i*3+1] - positions[j*3+1]
        const dz = positions[i*3+2] - positions[j*3+2]
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < THRESH) {
          linePos[li*6]   = positions[i*3];   linePos[li*6+1] = positions[i*3+1]; linePos[li*6+2] = positions[i*3+2]
          linePos[li*6+3] = positions[j*3];   linePos[li*6+4] = positions[j*3+1]; linePos[li*6+5] = positions[j*3+2]
          li++
        }
      }
    }
    lineGeo.attributes.position.needsUpdate = true
    lineGeo.setDrawRange(0, li * 2)
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={POINT_COLOR} size={0.030} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color={LINE_COLOR} transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  )
}
