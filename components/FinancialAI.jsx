'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { askZeeya } from '../app/actions'

// Animated counter
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
      <div className="w-14 text-right text-[12px] font-semibold text-text">₹{amount.toLocaleString('en-IN')}</div>
    </div>
  )
}

const SPEND_DATA = [
  { label: 'Food',      amount: 4200, pct: 84, color: '#4F46E5' },
  { label: 'Transport', amount: 1800, pct: 36, color: '#06B6D4' },
  { label: 'Shopping',  amount: 3100, pct: 62, color: '#7C3AED' },
  { label: 'Bills',     amount: 2400, pct: 48, color: '#0EA5E9' },
  { label: 'Others',    amount: 950,  pct: 19, color: '#8B5CF6' },
]

const ADVICE = [
  { icon: '⚠️', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', text: 'Food spending is 68% above your usual. Consider cooking at home 3 days this week.' },
  { icon: '✅', color: '#059669', bg: '#F0FDF4', border: '#A7F3D0', text: 'Transport costs are on track. Great job using public transit this month!' },
  { icon: '💡', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', text: "At this rate, you'll overspend by ₹2,100 by month end. Cut ₹70/day to stay safe." },
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
      className="mt-10 bg-white rounded-2xl shadow-card border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            <span className="text-white text-[13px] font-black">Z</span>
          </div>
          <div>
            <div className="text-[14px] font-bold text-text">Ask ZEEYA</div>
            <div className="text-[11px] text-muted">Live AI financial advice</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[280px] overflow-y-auto p-5 space-y-4">
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
                  style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #C7D2FE' }}>
                  <span className="text-[11px] font-black" style={{ color: '#4F46E5' }}>Z</span>
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                m.role === 'user'
                  ? 'text-white font-medium rounded-br-sm'
                  : 'bg-bg border border-border text-text rounded-bl-sm'
              }`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #C7D2FE' }}>
              <span className="text-[11px] font-black" style={{ color: '#4F46E5' }}>Z</span>
            </div>
            <div className="bg-bg border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted"
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
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {QUICK_ASKS.map(q => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={loading}
            className="flex-shrink-0 text-[11px] text-muted border border-border px-3 py-1.5 rounded-full hover:border-primary/30 hover:text-primary transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex gap-3">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask ZEEYA about your finances..."
          disabled={loading}
          className="flex-1 bg-bg border border-border text-text text-[13px] rounded-xl px-4 py-3 outline-none focus:border-primary/40 placeholder:text-subtle transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 font-bold text-[13px] rounded-xl text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
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

  // Editable budget state
  const [income, setIncome]   = useState(25000)
  const [spent, setSpent]     = useState(12450)
  const [editing, setEditing] = useState(false)
  const daysLeft = 14
  const remaining = income - spent
  const dailyLimit = Math.max(0, Math.round(remaining / daysLeft))
  const pctSpent = Math.min(100, Math.round((spent / income) * 100))
  const status = pctSpent > 70 ? { label: 'Warning — Moderate Risk', color: 'amber', icon: '⚠️' }
               : pctSpent > 90 ? { label: 'Danger — Overspending!', color: 'red',   icon: '🚨' }
               : { label: 'On Track — Good Job!', color: 'green', icon: '✅' }

  return (
    <section id="finance" className="py-28 px-6 bg-white relative overflow-hidden">
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
            Try the live demo below.
          </motion.p>
        </div>

        {/* Dashboard */}
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
              <span className="ml-2 text-[12px] text-muted font-medium flex-1">ZEEYA — Monthly Budget</span>
              <button
                onClick={() => setEditing(e => !e)}
                className="text-[11px] text-primary border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-colors font-medium"
              >
                {editing ? 'Done' : 'Edit numbers'}
              </button>
            </div>

            {/* Edit inputs */}
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
                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-bold text-text outline-none focus:border-primary/40"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted font-medium block mb-1">Spent so far (₹)</label>
                      <input
                        type="number"
                        value={spent}
                        onChange={e => setSpent(Number(e.target.value))}
                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-bold text-text outline-none focus:border-primary/40"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Budget stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Monthly income', value: income,     prefix: '₹', color: '#059669' },
                { label: 'Spent so far',   value: spent,      prefix: '₹', color: '#4F46E5' },
                { label: 'Days left',      value: daysLeft,   prefix: '',  suffix: ' days', color: '#7C3AED' },
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
                <span className="font-bold" style={{ color: pctSpent > 70 ? '#F59E0B' : '#059669' }}>{pctSpent}%</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: pctSpent > 70 ? 'linear-gradient(90deg, #4F46E5, #EF4444)' : 'linear-gradient(90deg, #4F46E5, #059669)' }}
                  animate={{ width: `${pctSpent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Status card */}
            <div className={`flex items-center gap-3 p-3 rounded-xl mb-5 ${
              status.color === 'amber' ? 'bg-amber-50 border border-amber-200' :
              status.color === 'red'   ? 'bg-red-50 border border-red-200' :
                                         'bg-green-50 border border-green-200'
            }`}>
              <span className="text-[20px]">{status.icon}</span>
              <div>
                <div className={`text-[13px] font-bold ${
                  status.color === 'amber' ? 'text-amber-800' :
                  status.color === 'red'   ? 'text-red-800' : 'text-green-800'
                }`}>{status.label}</div>
                <div className={`text-[12px] ${
                  status.color === 'amber' ? 'text-amber-600' :
                  status.color === 'red'   ? 'text-red-600' : 'text-green-600'
                }`}>Safe daily limit: ₹{dailyLimit.toLocaleString('en-IN')}/day for next {daysLeft} days</div>
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
              className="rounded-2xl p-6 text-white shadow-glow"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest opacity-70">Today's brief</div>
                  <div className="text-[22px] font-black mt-1">Safe to spend today</div>
                </div>
                <div className="text-right">
                  <div className="text-[42px] font-black leading-none">₹{dailyLimit.toLocaleString('en-IN')}</div>
                  <div className="text-[12px] opacity-70 mt-1">Daily limit</div>
                </div>
              </div>
              <div className="h-px bg-white/20 mb-4" />
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { n: '3',    l: 'Bills due' },
                  { n: '₹840', l: 'Bills total' },
                  { n: `${Math.min(99, Math.round(100 - pctSpent * 0.5))}`, l: 'Safety score' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-[18px] font-black">{s.n}</div>
                    <div className="text-[11px] opacity-60 mt-0.5">{s.l}</div>
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

            {/* Month-end prediction */}
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
              <div className="mt-3 flex items-center gap-2 text-[12px] text-red-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Projected overspend: ₹{Math.max(0, Math.round((spent / 16 * 30) - income)).toLocaleString('en-IN') || '2,100'} at current rate
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
