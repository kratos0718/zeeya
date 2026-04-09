'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./scene/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full animate-ping" style={{ background: '#C9963A', opacity: 0.5 }} />
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
      {/* Warm background blobs */}
      <div className="blob w-[560px] h-[560px] top-[-8%] right-[-4%] opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.12) 0%, transparent 70%)' }} />
      <div className="blob w-[420px] h-[420px] bottom-[-6%] left-[-6%] opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,150,58,0.14) 0%, transparent 70%)' }} />
      <div className="blob w-[300px] h-[300px] top-[35%] left-[15%] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(27,67,50,0.08) 0%, transparent 70%)' }} />

      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />

      {/* 3D Scene */}
      <div className="absolute inset-0 flex items-center justify-end pr-[8%] pointer-events-none">
        <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px]">
          <HeroScene />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FAF7F2, transparent)' }} />

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-6xl mx-auto"
      >
        {/* Gold accent line */}
        <motion.div
          variants={fade} initial="hidden" animate="show" custom={0.1}
          className="mb-7 flex items-center gap-4"
        >
          <div className="w-8 h-[2px] rounded-full" style={{ background: '#C9963A' }} />
          <span className="badge">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#C9963A' }} />
            AI-Powered Financial Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fade} initial="hidden" animate="show" custom={0.28}>
          <h1 className="text-[68px] sm:text-[84px] md:text-[100px] font-black leading-[0.88] tracking-[-0.04em]">
            <span className="text-gradient">ZEEYA</span>
          </h1>
          <h2 className="text-[26px] sm:text-[34px] md:text-[42px] font-bold leading-tight tracking-[-0.02em] mt-4"
            style={{ color: '#1A1508' }}>
            Your AI Financial Brain
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          variants={fade} initial="hidden" animate="show" custom={0.44}
          className="mt-5 text-[17px] text-muted max-w-md leading-relaxed"
        >
          Track every rupee, predict overspending, get your daily budget,
          and receive smart advice — automatically.
        </motion.p>

        {/* Founder badge */}
        <motion.div
          variants={fade} initial="hidden" animate="show" custom={0.54}
          className="mt-4 inline-flex items-center gap-2"
        >
          <div className="flex -space-x-1.5">
            {['T', 'A'].map((l, i) => (
              <div key={l} className="w-6 h-6 rounded-full border-2 border-bg flex items-center justify-center text-[10px] font-black text-white"
                style={{ background: i === 0 ? '#1B4332' : '#C9963A' }}>
                {l}
              </div>
            ))}
          </div>
          <p className="text-[13px] text-subtle font-medium">
            Built by{' '}
            <span className="font-semibold" style={{ color: '#1B4332' }}>Teja</span>
            {' '}&{' '}
            <span className="font-semibold" style={{ color: '#C9963A' }}>Abhinav</span>
            {' '}· Visakhapatnam
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fade} initial="hidden" animate="show" custom={0.64}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a href="#cta" className="btn-primary px-8 py-4 text-[15px]">
            Get early access →
          </a>
          <a href="#finance" className="btn-secondary px-8 py-4 text-[15px]">
            See live demo
          </a>
        </motion.div>

        {/* Metrics */}
        <motion.div
          variants={fade} initial="hidden" animate="show" custom={0.8}
          className="mt-12 flex flex-wrap gap-8 items-center"
        >
          {[
            { n: '2.4M+', l: 'Transactions analyzed' },
            { n: '99.2%', l: 'Fraud detection rate' },
            { n: '₹840',  l: 'Avg. monthly savings' },
          ].map((s, i) => (
            <div key={s.l} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-8 bg-border" />}
              <div>
                <div className="text-[24px] font-black text-gradient-gold leading-none">{s.n}</div>
                <div className="text-[12px] text-muted mt-0.5">{s.l}</div>
              </div>
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
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, #C9963A80, transparent)' }}
        />
      </motion.div>
    </section>
  )
}
