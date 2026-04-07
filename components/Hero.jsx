'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./scene/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-primary/40 animate-ping" />
    </div>
  ),
})

const fade = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show:   (d = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }),
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const y       = useTransform(scrollYProgress, [0, 0.45], [0, -50])

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden bg-hero-gradient">
      {/* Background blobs */}
      <div className="blob w-[500px] h-[500px] bg-indigo-100/60 top-[-10%] right-[-5%] opacity-70" />
      <div className="blob w-[400px] h-[400px] bg-cyan-100/50 bottom-[-5%] left-[-5%] opacity-60" />
      <div className="blob w-[300px] h-[300px] bg-violet-100/40 top-[30%] left-[10%] opacity-50" />

      {/* 3D Scene */}
      <div className="absolute inset-0 flex items-center justify-end pr-[8%] pointer-events-none">
        <div className="w-[340px] h-[340px] md:w-[500px] md:h-[500px] lg:w-[580px] lg:h-[580px]">
          <HeroScene />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={fade} initial="hidden" animate="show" custom={0.15} className="mb-7">
          <span className="badge">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
            AI-Powered Financial Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fade} initial="hidden" animate="show" custom={0.3}>
          <h1 className="text-[62px] sm:text-[80px] md:text-[96px] font-black leading-[0.92] tracking-[-0.04em] mb-2">
            <span className="text-gradient">ZEEYA</span>
          </h1>
          <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold text-text leading-tight tracking-[-0.02em] mt-3">
            Your AI Financial Brain
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          variants={fade} initial="hidden" animate="show" custom={0.45}
          className="mt-5 text-[17px] text-muted max-w-md leading-relaxed"
        >
          Track every rupee, predict overspending, get a daily budget,
          and receive smart advice — automatically.
        </motion.p>

        {/* Founder line */}
        <motion.p
          variants={fade} initial="hidden" animate="show" custom={0.55}
          className="mt-3 text-[13px] text-subtle font-medium"
        >
          Built by{' '}
          <span className="text-primary font-semibold">Teja</span>
          {' '}&{' '}
          <span className="text-primary font-semibold">Abhinav</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fade} initial="hidden" animate="show" custom={0.65}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a href="#cta" className="btn-primary px-8 py-4 text-[15px]">
            Get started free →
          </a>
          <a href="#features" className="btn-secondary px-8 py-4 text-[15px]">
            See how it works
          </a>
        </motion.div>

        {/* Metrics */}
        <motion.div
          variants={fade} initial="hidden" animate="show" custom={0.8}
          className="mt-12 flex flex-wrap gap-8"
        >
          {[
            { n: '2.4M+', l: 'Transactions analyzed' },
            { n: '99.2%', l: 'Fraud detection' },
            { n: '₹840',  l: 'Avg. monthly savings' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-[22px] font-black text-gradient-warm">{s.n}</div>
              <div className="text-[12px] text-muted mt-0.5">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-subtle tracking-[0.18em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}
