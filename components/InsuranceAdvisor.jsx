'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getInsuranceAdvice } from '../app/actions'

const PROFESSIONS = [
  { id: 'student',      label: 'Student',            icon: '🎓' },
  { id: 'fresher',      label: 'Fresher (0–2 yrs)',  icon: '💼' },
  { id: 'professional', label: 'Working Professional',icon: '🏢' },
  { id: 'freelancer',   label: 'Freelancer',          icon: '💻' },
  { id: 'business',     label: 'Business Owner',      icon: '🏪' },
]

const PRIORITY_COLOR = {
  'Critical':    { bg: 'rgba(185,28,28,0.08)', border: '#B91C1C', text: '#B91C1C' },
  'High':        { bg: 'rgba(201,150,58,0.1)',  border: '#C9963A', text: '#C9963A' },
  'Recommended': { bg: 'rgba(27,67,50,0.08)',   border: '#2D6A4F', text: '#2D6A4F' },
}

const TYPE_ICON = {
  'Health Insurance':       '🏥',
  'Term Life Insurance':    '🛡️',
  'Personal Accident':      '⚡',
}

function PlanCard({ plan, index }) {
  const colors = PRIORITY_COLOR[plan.priority] || PRIORITY_COLOR['Recommended']
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16,1,0.3,1] }}
      className="rounded-2xl p-5 border"
      style={{ background: '#FFFEF9', borderColor: '#E8DFCE' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{TYPE_ICON[plan.type] || '📋'}</span>
          <div>
            <p className="text-[11px] text-muted font-medium uppercase tracking-wider">{plan.type}</p>
            <p className="text-[14px] font-semibold text-text leading-tight mt-0.5">{plan.recommended}</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
          {plan.priority}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl p-3" style={{ background: 'rgba(27,67,50,0.04)' }}>
          <p className="text-[10px] text-muted mb-0.5">Annual Premium</p>
          <p className="text-[15px] font-bold" style={{ color: '#1B4332' }}>{plan.annualPremium}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(201,150,58,0.06)' }}>
          <p className="text-[10px] text-muted mb-0.5">Sum Insured</p>
          <p className="text-[15px] font-bold" style={{ color: '#C9963A' }}>{plan.sumInsured}</p>
        </div>
      </div>

      <p className="text-[12px] text-muted leading-relaxed mb-2">{plan.why}</p>

      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#2D6A4F' }} />
        <p className="text-[11px] text-muted">Claim settlement: <span className="font-semibold text-primary">{plan.claimSettlement}</span></p>
      </div>
    </motion.div>
  )
}

export default function InsuranceAdvisor() {
  const [step, setStep]               = useState('form')   // form | loading | result
  const [profession, setProfession]   = useState('')
  const [age, setAge]                 = useState('')
  const [monthlySavings, setMonthlySavings] = useState('')
  const [existingCover, setExistingCover]   = useState('')
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState('')

  async function handleAnalyze() {
    if (!profession || !age || !monthlySavings) {
      setError('Please fill in your profession, age, and monthly savings.')
      return
    }
    setError('')
    setStep('loading')
    try {
      const data = await getInsuranceAdvice({ profession, age, monthlySavings, existingCover })
      if (data) {
        setResult(data)
        setStep('result')
      } else {
        setError('Could not generate recommendations. Try again.')
        setStep('form')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('form')
    }
  }

  return (
    <section id="insurance" className="py-24 px-6" style={{ background: 'linear-gradient(160deg, #F5EFE3 0%, #FAF7F2 50%, #EAF2ED 100%)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="badge text-[11px] font-semibold uppercase tracking-widest mb-4 inline-block">
              Phase 2 · Insurance Advisor
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-text leading-[1.1] mb-5">
              Stop guessing. Start{' '}
              <span className="text-gradient">protecting.</span>
            </h2>
            <p className="text-muted text-[15px] max-w-xl mx-auto leading-relaxed">
              Tell ZEEYA your profile. Get specific insurance recommendations from real Indian providers — what to buy, how much, and why.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-7 border shadow-card"
            style={{ background: '#FFFEF9', borderColor: '#E8DFCE' }}
          >
            <h3 className="text-[16px] font-bold text-text mb-6">Your Profile</h3>

            {/* Profession */}
            <div className="mb-5">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-3 block">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROFESSIONS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProfession(p.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 border text-left"
                    style={{
                      background: profession === p.id ? 'rgba(27,67,50,0.08)' : 'transparent',
                      borderColor: profession === p.id ? '#2D6A4F' : '#E8DFCE',
                      color: profession === p.id ? '#1B4332' : '#6B5C45',
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
                Age
              </label>
              <input
                type="number"
                min="18" max="60"
                placeholder="e.g. 24"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-[14px] text-text outline-none transition-colors"
                style={{ background: '#FAF7F2', borderColor: age ? '#2D6A4F' : '#E8DFCE' }}
              />
            </div>

            {/* Monthly savings */}
            <div className="mb-4">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
                Monthly Savings (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 8000"
                value={monthlySavings}
                onChange={e => setMonthlySavings(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-[14px] text-text outline-none transition-colors"
                style={{ background: '#FAF7F2', borderColor: monthlySavings ? '#2D6A4F' : '#E8DFCE' }}
              />
            </div>

            {/* Existing cover */}
            <div className="mb-6">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
                Existing Insurance (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Company health cover ₹3L"
                value={existingCover}
                onChange={e => setExistingCover(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-[14px] text-text outline-none transition-colors"
                style={{ background: '#FAF7F2', borderColor: '#E8DFCE' }}
              />
            </div>

            {error && (
              <p className="text-[12px] mb-4" style={{ color: '#B91C1C' }}>{error}</p>
            )}

            <button
              onClick={handleAnalyze}
              disabled={step === 'loading'}
              className="btn-primary w-full py-3.5 text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {step === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing your profile…
                </span>
              ) : (
                'Get My Insurance Plan →'
              )}
            </button>
          </motion.div>

          {/* Results */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                    style={{ background: 'rgba(27,67,50,0.07)' }}>
                    🛡️
                  </div>
                  <p className="text-[14px] font-semibold text-text mb-2">Your recommendations appear here</p>
                  <p className="text-[13px] text-muted max-w-xs leading-relaxed">
                    Fill in your profile and ZEEYA will suggest the right insurance from real Indian providers — with exact premiums.
                  </p>
                </motion.div>
              )}

              {step === 'result' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Summary */}
                  <div className="rounded-2xl p-5 mb-4 border" style={{ background: 'rgba(27,67,50,0.05)', borderColor: '#2D6A4F' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm"
                        style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                        <span className="text-[#E8B65A] font-black text-[11px]">Z</span>
                      </div>
                      <p className="text-[13px] text-text leading-relaxed">{result.summary}</p>
                    </div>
                  </div>

                  {/* Plan cards */}
                  <div className="flex flex-col gap-3 mb-4">
                    {result.plans?.map((plan, i) => (
                      <PlanCard key={i} plan={plan} index={i} />
                    ))}
                  </div>

                  {/* Tip */}
                  {result.tip && (
                    <div className="rounded-2xl p-4 border" style={{ background: 'rgba(201,150,58,0.06)', borderColor: 'rgba(201,150,58,0.3)' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-base">💡</span>
                        <p className="text-[12px] text-muted leading-relaxed">{result.tip}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { setStep('form'); setResult(null) }}
                    className="mt-4 text-[12px] text-muted hover:text-primary transition-colors underline underline-offset-4"
                  >
                    ← Try a different profile
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
