'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate } from 'framer-motion'

// Animated counter
function Counter({ to, prefix = '', suffix = '', duration = 1.5 }) {
  const [val, setVal]  = useState(0)
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: v => setVal(Math.round(v)) })
    return c.stop
  }, [inView, to, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}

// Mini bar chart
function SpendBar({ label, amount, max, color, pct }) {
  const inView = useInView(useRef(null), { once: true })
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-[12px] text-muted flex-shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        />
      </div>
      <div className="w-14 text-right text-[12px] font-semibold text-text">₹{amount.toLocaleString('en-IN')}</div>
    </div>
  )
}

const SPEND_DATA = [
  { label: 'Food',      amount: 4200,  pct: 84, color: '#4F46E5' },
  { label: 'Transport', amount: 1800,  pct: 36, color: '#06B6D4' },
  { label: 'Shopping',  amount: 3100,  pct: 62, color: '#7C3AED' },
  { label: 'Bills',     amount: 2400,  pct: 48, color: '#0EA5E9' },
  { label: 'Others',    amount: 950,   pct: 19, color: '#8B5CF6' },
]

const ADVICE = [
  { icon: '⚠️', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', text: 'Food spending is 68% above your usual. Consider cooking at home 3 days this week.' },
  { icon: '✅', color: '#059669', bg: '#F0FDF4', border: '#A7F3D0', text: 'Transport costs are on track. Great job using public transit this month!' },
  { icon: '💡', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', text: 'At this rate, you\'ll overspend by ₹2,100 by month end. Cut ₹70/day to stay safe.' },
]

export default function FinancialAI() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="finance" className="py-28 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="badge inline-flex mb-5"
          >
            🧠 AI Financial Analysis
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-[38px] md:text-[52px] font-black text-text leading-tight tracking-[-0.03em] mb-4"
          >
            Your money, fully
            <br />
            <span className="text-gradient">understood by AI.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-muted max-w-lg mx-auto"
          >
            ZEEYA doesn't just track — it analyzes, predicts, and advises.
            Here's what your AI financial brief looks like.
          </motion.p>
        </div>

        {/* Dashboard mock */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left: Budget overview */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-card border border-border p-6"
          >
            {/* Window bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-[12px] text-muted font-medium">ZEEYA — Monthly Budget</span>
            </div>

            {/* Budget status */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Monthly income', value: 25000, prefix: '₹', color: '#059669' },
                { label: 'Spent so far',   value: 12450, prefix: '₹', color: '#4F46E5' },
                { label: 'Days left',       value: 14,    prefix: '',  suffix: ' days', color: '#7C3AED' },
              ].map(s => (
                <div key={s.label} className="bg-bg rounded-xl p-3 text-center">
                  <div className="text-[20px] font-black" style={{ color: s.color }}>
                    <Counter to={s.value} prefix={s.prefix} suffix={s.suffix ?? ''} />
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Budget status card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-5">
              <span className="text-[20px]">⚠️</span>
              <div>
                <div className="text-[13px] font-bold text-amber-800">Warning — Moderate Risk</div>
                <div className="text-[12px] text-amber-600">Safe daily limit: ₹892/day for next 14 days</div>
              </div>
            </div>

            {/* Spend breakdown */}
            <div className="space-y-3">
              <div className="text-[12px] font-bold text-subtle uppercase tracking-wide mb-3">Spending breakdown</div>
              {SPEND_DATA.map(s => <SpendBar key={s.label} {...s} />)}
            </div>
          </motion.div>

          {/* Right: AI advice + predictions */}
          <div className="space-y-5">
            {/* Daily brief */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-primary-gradient rounded-2xl p-6 text-white shadow-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest opacity-70">Today's brief</div>
                  <div className="text-[22px] font-black mt-1">Safe to spend today</div>
                </div>
                <div className="text-right">
                  <div className="text-[42px] font-black leading-none">₹892</div>
                  <div className="text-[12px] opacity-70 mt-1">Daily limit</div>
                </div>
              </div>
              <div className="h-px bg-white/20 mb-4" />
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { n: '3',    l: 'Bills due' },
                  { n: '₹840', l: 'Bills total' },
                  { n: '87',   l: 'Safety score' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-[18px] font-black">{s.n}</div>
                    <div className="text-[11px] opacity-60 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Advice cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card border border-border p-5"
            >
              <div className="text-[13px] font-bold text-text mb-4 flex items-center gap-2">
                <span>💡</span> AI Advice — based on your data
              </div>
              <div className="space-y-3">
                {ADVICE.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: a.bg, border: `1px solid ${a.border}` }}
                  >
                    <span className="text-[16px] mt-0.5 flex-shrink-0">{a.icon}</span>
                    <p className="text-[12px] leading-relaxed" style={{ color: a.color }}>{a.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Prediction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-card border border-border p-5"
            >
              <div className="text-[13px] font-bold text-text mb-4 flex items-center gap-2">
                <span>📈</span> Month-end prediction
              </div>
              <div className="flex items-end gap-1 h-20">
                {[
                  { h: 40, label: 'Week 1', color: '#4F46E5' },
                  { h: 60, label: 'Week 2', color: '#4F46E5' },
                  { h: 75, label: 'Week 3', color: '#7C3AED' },
                  { h: 95, label: 'Week 4 (est)', color: '#EF4444', dashed: true },
                ].map((b, i) => (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full rounded-t-lg"
                      style={{
                        background: b.color,
                        opacity: b.dashed ? 0.4 : 1,
                        border: b.dashed ? `2px dashed ${b.color}` : 'none',
                      }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${b.h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    />
                    <span className="text-[9px] text-muted text-center leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[12px] text-danger font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Projected overspend: ₹2,100 at current rate
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
