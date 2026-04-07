/** Linearly interpolate a → b by t */
export const lerp = (a, b, t) => a + (b - a) * t

/** Map value from [inMin,inMax] to [outMin,outMax] */
export const mapRange = (v, inMin, inMax, outMin, outMax) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin)

/** Clamp value between min and max */
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

/** Detect low-performance device */
export function isLowEnd() {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 4
  const mem   = navigator.deviceMemory    ?? 4
  return cores <= 2 || mem <= 2
}

/** Detect mobile */
export function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}
