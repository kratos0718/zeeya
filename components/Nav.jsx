'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { label: 'Features',   href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'AI Finance', href: '#finance' },
  { label: 'Pricing',    href: '#cta' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${scrolled ? 'py-2' : 'py-5'}`}
      >
        <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'glass rounded-2xl py-3 mx-6 shadow-soft' : ''
        }`}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <span className="text-white text-[15px] font-black">Z</span>
            </div>
            <span className="font-bold text-[17px] text-text tracking-tight">ZEEYA</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map(l => (
              <a key={l.label} href={l.href}
                className="text-[13px] text-muted hover:text-text transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#cta" className="text-[13px] text-muted hover:text-primary transition-colors font-medium">
              Sign in
            </a>
            <a href="#cta" className="btn-primary px-5 py-2.5 text-[13px]">
              Get started free
            </a>
          </div>

          {/* Mobile */}
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-[5px] p-1">
            <span className={`block w-5 h-[1.5px] bg-text transition-all ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-text transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-text transition-all ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-4 z-40 glass rounded-2xl p-6 flex flex-col gap-4 md:hidden shadow-card"
          >
            {LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className="text-muted hover:text-primary text-[15px] font-medium transition-colors py-1">
                {l.label}
              </a>
            ))}
            <div className="divider" />
            <a href="#cta" onClick={() => setOpen(false)}
              className="btn-primary py-3.5 text-center text-[14px]">
              Get started free
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
