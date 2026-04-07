'use client'
import { useEffect, useRef } from 'react'

/**
 * Returns a ref that holds { x, y } in range [-1, 1]
 * representing normalized mouse position.
 * No re-renders — read in useFrame for performance.
 */
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return mouse
}
