'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURES = [
  {
    icon: '🧠',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.07)',
    border: 'rgba(79,70,229,0.12)',
    title: 'Spending Intelligence',
    body: 'ZEEYA learns your patterns in 48 hours. It knows your salary day, subscriptions, and usual spend — and flags anything unusual.',
    tag: 'AI Learning',
  },
  {
    icon: '🛡️',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.07)',
    border: 'rgba(6,182,212,0.12)',
    title: 'Real-Time Fraud Shield',
    body: 'Sub-50ms fraud detection. Fake OTPs, KYC scams, phishing links, UPI collect fraud — blocked before you tap anything.',
    tag: '99.2% accuracy',
  },
  {
    icon: '📊',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.07)',
    border: 'rgba(124,58,237,0.12)',
    title: 'Daily Budget Limit',
    body: 'Get a personalized daily spending limit every morning. ZEEYA calculates it based on your income, bills, and goals.',
    tag: 'Personalized',
  },
  {
    icon: '⚡',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.07)',
    border: 'rgba(14,165,233,0.12)',
    title: 'Bill Autopilot',
    body: 'Every bill, every due date — detected from SMS the moment it arrives. ZEEYA reminds you before you miss a payment.',
    tag: '15+ providers',
  },
  {
    icon: '📈',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.07)',
    border: 'rgba(79,70,229,0.12)',
    title: 'Overspend Prediction',
    body: 'ZEEYA projects your month-end balance in real time. See if you\'re heading for trouble — and exactly where to cut back.',
    tag: 'Predictive AI',
  },
  {
    icon: '💬',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.07)',
    border: 'rgba(139,92,246,0.12)',
    title: 'Smart Financial Advice',
    body: 'Not generic tips — specific, actionable advice based on YOUR data. Like a financial advisor who actually knows your situation.',
    tag: 'Personalized advice',
  },
]

function TiltCard({ feature, index }) {
  const cardRef = useRef(null)
  const inView  = useInView(cardRef, { once: true, margin: '-50px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 })

  const onMove = (e) => {
    const r  = cardRef.current.getBoundingClientRect()
    const cx = e.clientX - r.left
    const cy = e.clientY - r.top
    setTilt({
      x: ((cy / r.height) - 0.5) * -10,
      y: ((cx / r.width)  - 0.5) *  10,
      gx: (cx / r.width)  * 100,
      gy: (cy / r.height) * 100,
    })
  }

  const onLeave = () => setTilt({ x: 0, y: 0, gx: 50, gy: 50 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        willChange: 'transform',
      }}
      className="group relative cursor-default"
    >
      {/* Radial hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, ${feature.bg} 0%, transparent 70%)` }}
      />

      <div
        className="relative bg-white rounded-2xl p-6 h-full shadow-card group-hover:shadow-hover transition-shadow duration-300"
        style={{ border: `1px solid ${feature.border}` }}
      >
        {/* Top border on hover */}
        <div
          className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
        />

        <div className="flex items-start justify-between mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[20px]"
            style={{ background: feature.bg, border: `1px solid ${feature.border}` }}
          >
            {feature.icon}
          </div>
          <span
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-full"
            style={{ color: feature.color, background: feature.bg }}
          >
            {feature.tag}
          </span>
        </div>

        <h3 className="text-[17px] font-bold text-text mb-2">{feature.title}</h3>
        <p className="text-[13px] text-muted leading-relaxed">{feature.body}</p>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-28 px-6 bg-white relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="badge inline-flex mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Built for your financial life
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-[38px] md:text-[52px] font-black text-text leading-tight tracking-[-0.03em] mb-4"
          >
            Six ways ZEEYA keeps
            <br />
            <span className="text-gradient">your money safe & growing</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-muted max-w-xl mx-auto"
          >
            ZEEYA works quietly in the background — learning, protecting, and optimizing
            your finances every single day.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => <TiltCard key={f.title} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  )
}
