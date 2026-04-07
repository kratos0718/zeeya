'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    color: '#4F46E5',
    icon: '📲',
    title: 'Connect in 30 seconds',
    body: 'Allow ZEEYA to read your SMS. No credentials, no screen scraping — just pattern recognition on your device.',
    detail: 'Bank-grade encryption. Your data never leaves your phone.',
  },
  {
    n: '02',
    color: '#7C3AED',
    icon: '🧠',
    title: 'AI analyzes your patterns',
    body: 'In 48 hours, ZEEYA builds your financial fingerprint — income, fixed costs, variable spend, habits.',
    detail: 'The more you use it, the smarter it gets.',
  },
  {
    n: '03',
    color: '#06B6D4',
    icon: '📊',
    title: 'Get your daily brief',
    body: 'Every morning: your safe daily budget, pending bills, fraud summary, and one smart money tip — in under 10 seconds.',
    detail: 'Telugu, Hindi, English — your language.',
  },
  {
    n: '04',
    color: '#0EA5E9',
    icon: '🚀',
    title: 'Watch your wealth grow',
    body: 'ZEEYA tracks savings goals, sends bill reminders, flags overspending before it happens — and celebrates wins.',
    detail: 'Average user saves ₹840/month in first 30 days.',
  },
]

export default function HowItWorks() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how" className="py-28 px-6 bg-bg relative">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="badge inline-flex mb-5"
          >
            ⚡ Simple setup
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-[38px] md:text-[52px] font-black text-text leading-tight tracking-[-0.03em]"
          >
            From zero to{' '}
            <span className="text-gradient">financial clarity</span>
            <br />in 4 steps.
          </motion.h2>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-7 shadow-card border border-border hover:shadow-hover transition-shadow duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Step number */}
                <div className="step-number flex-shrink-0">
                  {i + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[20px]">{step.icon}</span>
                    <span className="text-[11px] font-bold text-subtle uppercase tracking-wide">{step.n}</span>
                  </div>
                  <h3 className="text-[19px] font-bold text-text mb-2 leading-snug">{step.title}</h3>
                  <p className="text-[14px] text-muted leading-relaxed mb-3">{step.body}</p>
                  <div
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full"
                    style={{ color: step.color, background: `${step.color}10` }}
                  >
                    <span className="w-1 h-1 rounded-full" style={{ background: step.color }} />
                    {step.detail}
                  </div>
                </div>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className="mt-5 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute left-1/2 top-1/2 w-px h-40 bg-gradient-to-b from-primary/20 to-transparent -translate-x-1/2 pointer-events-none" />
      </div>
    </section>
  )
}
