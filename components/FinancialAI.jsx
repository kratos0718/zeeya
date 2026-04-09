'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { askZeeya } from '../app/actions'

function Counter({ to, prefix = '', suffix = '', duration = 1.5 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: v => setVal(Math.round(v)) })
    return c.stop
  }, [inView, to, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>
}

function SpendBar({ label, amount, pct, color }) {
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
      <div className="w-14 text-right text-[12px] font-semibold" style={{ color: '#1A1508' }}>
        ₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  )
}

const SPEND_DATA = [
  { label: 'Food',      amount: 4200, pct: 84, color: '#1B4332' },
  { label: 'Transport', amount: 1800, pct: 36, color: '#C9963A' },
  { label: 'Shopping',  amount: 3100, pct: 62, color: '#2D6A4F' },
  { label: 'Bills',     amount: 2400, pct: 48, color: '#4A7C59' },
  { label: 'Others',    amount: 950,  pct: 19, color: '#E8B65A' },
]

const ADVICE = [
  { icon: '⚠️', color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', text: 'Food spending is 68% above your usual. Consider cooking at home 3 days this week.' },
  { icon: '✅', color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', text: 'Transport costs are on track. Great job using public transit this month!' },
  { icon: '💡', color: '#1B4332', bg: '#F0FDF4', border: '#BBF7D0', text: "At this rate, you'll overspend by ₹2,100 by month end. Cut ₹70/day to stay safe." },
]

const QUICK_ASKS = [
  'Am I on track this month?',
  'How can I save ₹5,000 more?',
  'Where am I overspending?',
  'Give me a 30-day money plan',
]

// ── Live AI Chat ──────────────────────────────────────────────────────────────
function ZeeyaChat() {
  const INIT = [{ role: 'assistant', content: "Hi! I'm ZEEYA. Ask me anything about your budget, spending, or how to save more this month." }]
  const [msgs, setMsgs]       = useState(INIT)
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const send = async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const next = [...msgs, { role: 'user', content: msg }]
    setMsgs(next)
    setLoading(true)
    const apiMsgs = next.map(m => ({ role: m.role, content: m.content }))
    const { reply } = await askZeeya(apiMsgs)
    setMsgs(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
    inputRef.current?.focus()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10 bg-white rounded-2xl shadow-card overflow-hidden"
      style={{ border: '1px solid #E8DFCE' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between"
        style={{ background: 'linear-gradient(90deg, #FAF7F2, #FFFEF9)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
            <span className="font-black text-[13px]" style={{ color: '#E8B65A' }}>Z</span>
          </div>
          <div>
            <div className="text-[14px] font-bold" style={{ color: '#1A1508' }}>Ask ZEEYA</div>
            <div className="text-[11px] text-muted">Live AI financial advice</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2D6A4F' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#2D6A4F' }}>Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[280px] overflow-y-auto p-5 space-y-4 bg-bg">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(27,67,50,0.08)', border: '1px solid rgba(27,67,50,0.14)' }}>
                  <span className="text-[11px] font-black" style={{ color: '#1B4332' }}>Z</span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                }`}
                style={m.role === 'user'
                  ? { background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', color: '#FFFEF9', fontWeight: 500 }
                  : { background: '#FFFFFF', border: '1px solid #E8DFCE', color: '#1A1508' }
                }
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(27,67,50,0.08)', border: '1px solid rgba(27,67,50,0.14)' }}>
              <span className="text-[11px] font-black" style={{ color: '#1B4332' }}>Z</span>
            </div>
            <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#C9963A' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick asks */}
      <div className="px-5 py-3 bg-white border-t border-border flex gap-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}>
        {QUICK_ASKS.map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={loading}
            className="flex-shrink-0 text-[11px] border border-border px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 whitespace-nowrap"
            style={{ color: '#6B5C45' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(27,67,50,0.3)'; e.currentTarget.style.color = '#1B4332' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '#6B5C45' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex gap-3 bg-white">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask ZEEYA about your finances..."
          disabled={loading}
          className="flex-1 bg-bg border border-border text-[13px] rounded-xl px-4 py-3 outline-none placeholder:text-subtle transition-colors disabled:opacity-50"
          style={{ color: '#1A1508' }}
          onFocus={e => e.target.style.borderColor = 'rgba(201,150,58,0.4)'}
          onBlur={e => e.target.style.borderColor = ''}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 font-bold text-[13px] rounded-xl text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}
          onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          Ask
        </button>
      </div>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function FinancialAI() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [income, setIncome]   = useState(25000)
  const [spent, setSpent]     = useState(12450)
  const [editing, setEditing] = useState(false)
  const daysLeft  = 14
  const remaining = income - spent
  const dailyLimit = Math.max(0, Math.round(remaining / daysLeft))
  const pctSpent   = Math.min(100, Math.round((spent / income) * 100))
  const status = pctSpent > 70
    ? { label: 'Warning — Moderate Risk', tone: 'amber', icon: '⚠️' }
    : pctSpent > 90
    ? { label: 'Danger — Overspending!',  tone: 'red',   icon: '🚨' }
    : { label: 'On Track — Good Job!',    tone: 'green', icon: '✅' }

  const statusStyles = {
    amber: { bg: '#FFFBEB', border: '#FDE68A', title: '#92400E', sub: '#B45309' },
    red:   { bg: '#FEF2F2', border: '#FECACA', title: '#991B1B', sub: '#DC2626' },
    green: { bg: '#ECFDF5', border: '#A7F3D0', title: '#065F46', sub: '#059669' },
  }[status.tone]

  return (
    <section id="finance" className="py-28 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px divider" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(27,67,50,0.04) 0%, transparent 70%)' }} />

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
            className="text-[38px] md:text-[52px] font-black leading-tight tracking-[-0.03em] mb-4"
            style={{ color: '#1A1508' }}
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
            Try the live demo below.
          </motion.p>
        </div>

        {/* Dashboard grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left: Budget card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-card border border-border p-6"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-2 text-[12px] text-muted font-medium flex-1">ZEEYA — Monthly Budget</span>
              <button
                onClick={() => setEditing(e => !e)}
                className="text-[11px] border px-2.5 py-1 rounded-lg transition-colors font-medium"
                style={{ color: '#1B4332', borderColor: 'rgba(27,67,50,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(27,67,50,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                {editing ? 'Done' : 'Edit numbers'}
              </button>
            </div>

            {/* Editable inputs */}
            <AnimatePresence>
              {editing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-bg rounded-xl border border-border">
                    <div>
                      <label className="text-[11px] text-muted font-medium block mb-1">Monthly income (₹)</label>
                      <input
                        type="number"
                        value={income}
                        onChange={e => setIncome(Number(e.target.value))}
                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-bold outline-none"
                        style={{ color: '#1A1508' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,150,58,0.4)'}
                        onBlur={e => e.target.style.borderColor = ''}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted font-medium block mb-1">Spent so far (₹)</label>
                      <input
                        type="number"
                        value={spent}
                        onChange={e => setSpent(Number(e.target.value))}
                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-bold outline-none"
                        style={{ color: '#1A1508' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(201,150,58,0.4)'}
                        onBlur={e => e.target.style.borderColor = ''}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Monthly income', value: income,  prefix: '₹', color: '#1B4332' },
                { label: 'Spent so far',   value: spent,   prefix: '₹', color: '#C9963A' },
                { label: 'Days left',      value: daysLeft, prefix: '', suffix: ' days', color: '#2D6A4F' },
              ].map(s => (
                <div key={s.label} className="bg-bg rounded-xl p-3 text-center">
                  <div className="text-[20px] font-black" style={{ color: s.color }}>
                    {editing
                      ? <span>{s.prefix}{s.value.toLocaleString('en-IN')}{s.suffix ?? ''}</span>
                      : <Counter to={s.value} prefix={s.prefix} suffix={s.suffix ?? ''} />
                    }
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-[11px] text-muted mb-1.5">
                <span>Budget used</span>
                <span className="font-bold" style={{ color: pctSpent > 70 ? '#C9963A' : '#1B4332' }}>{pctSpent}%</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: pctSpent > 70 ? 'linear-gradient(90deg, #C9963A, #EF4444)' : 'linear-gradient(90deg, #1B4332, #2D6A4F)' }}
                  animate={{ width: `${pctSpent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Status card */}
            <div className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{ background: statusStyles.bg, border: `1px solid ${statusStyles.border}` }}>
              <span className="text-[20px]">{status.icon}</span>
              <div>
                <div className="text-[13px] font-bold" style={{ color: statusStyles.title }}>{status.label}</div>
                <div className="text-[12px]" style={{ color: statusStyles.sub }}>
                  Safe daily limit: ₹{dailyLimit.toLocaleString('en-IN')}/day for next {daysLeft} days
                </div>
              </div>
            </div>

            {/* Spend breakdown */}
            <div className="space-y-3">
              <div className="text-[12px] font-bold text-subtle uppercase tracking-wide mb-3">Spending breakdown</div>
              {SPEND_DATA.map(s => <SpendBar key={s.label} {...s} />)}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Daily brief — forest green card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-6 text-white shadow-glow relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' }}
            >
              {/* Gold shimmer accent */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(201,150,58,0.15) 0%, transparent 70%)' }} />

              <div className="flex items-center justify-between mb-4 relative">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest" style={{ opacity: 0.65 }}>Today's brief</div>
                  <div className="text-[22px] font-black mt-1">Safe to spend today</div>
                </div>
                <div className="text-right">
                  <div className="text-[44px] font-black leading-none" style={{ color: '#E8B65A' }}>
                    ₹{dailyLimit.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[12px] mt-1" style={{ opacity: 0.6 }}>Daily limit</div>
                </div>
              </div>
              <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { n: '3',    l: 'Bills due' },
                  { n: '₹840', l: 'Bills total' },
                  { n: `${Math.min(99, Math.round(100 - pctSpent * 0.5))}`, l: 'Safety score' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-[18px] font-black">{s.n}</div>
                    <div className="text-[11px] mt-0.5" style={{ opacity: 0.6 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card border border-border p-5"
            >
              <div className="text-[13px] font-bold mb-4 flex items-center gap-2" style={{ color: '#1A1508' }}>
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

            {/* Month-end prediction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-card border border-border p-5"
            >
              <div className="text-[13px] font-bold mb-4 flex items-center gap-2" style={{ color: '#1A1508' }}>
                <span>📈</span> Month-end prediction
              </div>
              <div className="flex items-end gap-1 h-20">
                {[
                  { h: 40, label: 'Week 1', color: '#1B4332' },
                  { h: 60, label: 'Week 2', color: '#2D6A4F' },
                  { h: 75, label: 'Week 3', color: '#C9963A' },
                  { h: 95, label: 'Week 4 (est)', color: '#EF4444', dashed: true },
                ].map((b, i) => (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full rounded-t-lg"
                      style={{
                        background: b.color,
                        opacity: b.dashed ? 0.45 : 1,
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
              <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#DC2626' }}>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Projected overspend: ₹2,100 at current rate
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live AI chat */}
        <ZeeyaChat />
      </div>
    </section>
  )
}
