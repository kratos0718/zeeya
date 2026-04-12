'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTripPlan } from '../app/actions'

const DURATIONS = [
  { id: 'weekend', label: 'Weekend', sub: '2 days' },
  { id: '3-4days', label: '3–4 Days', sub: 'Long weekend' },
  { id: 'week',    label: 'A Week',  sub: '6–7 days' },
  { id: '10days',  label: '10+ Days', sub: 'Big trip' },
]

const VIBES = [
  { id: 'chill',      label: 'Chill & Rest',  icon: '🌊' },
  { id: 'adventure',  label: 'Adventure',     icon: '🏔️' },
  { id: 'cultural',   label: 'Culture & History', icon: '🏛️' },
  { id: 'party',      label: 'Nightlife & Party', icon: '🎉' },
  { id: 'romantic',   label: 'Romantic',      icon: '💑' },
  { id: 'solo',       label: 'Solo & Explore', icon: '🎒' },
]

const TRAVELERS = [
  { id: '1', label: 'Solo' },
  { id: '2', label: '2 people' },
  { id: '3-4', label: '3–4 friends' },
  { id: '5+', label: '5+ group' },
]

const LABEL_COLOR = {
  'Budget Pick':  { bg: 'rgba(27,67,50,0.06)',   border: '#2D6A4F', text: '#1B4332' },
  'Best Value':   { bg: 'rgba(201,150,58,0.08)', border: '#C9963A', text: '#C9963A' },
  'Stretch Pick': { bg: 'rgba(109,40,217,0.06)', border: '#7C3AED', text: '#7C3AED' },
}

function TripCard({ trip, isActive, onClick, index }) {
  const lc = LABEL_COLOR[trip.label] || LABEL_COLOR['Best Value']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16,1,0.3,1] }}
      onClick={onClick}
      className="rounded-2xl p-5 border cursor-pointer transition-all duration-200"
      style={{
        background: isActive ? '#FFFEF9' : '#FAF7F2',
        borderColor: isActive ? '#2D6A4F' : '#E8DFCE',
        boxShadow: isActive ? '0 4px 24px rgba(27,67,50,0.12)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 inline-block"
            style={{ background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}>
            {trip.label}
          </span>
          <h4 className="text-[15px] font-bold text-text leading-tight">{trip.destination}</h4>
          <p className="text-[12px] text-muted mt-0.5">{trip.tagline}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-muted">Total cost</p>
          <p className="text-[15px] font-black" style={{ color: '#1B4332' }}>{trip.totalCost}</p>
        </div>
      </div>

      {/* Cost breakdown (collapsed unless active) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t pt-3 mb-3" style={{ borderColor: '#E8DFCE' }}>
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Cost Breakdown</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(trip.breakdown || {}).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-sm">
                      {key === 'transport' ? '🚆' : key === 'stay' ? '🏨' : key === 'food' ? '🍜' : '🎭'}
                    </span>
                    <div>
                      <p className="text-[10px] text-muted capitalize">{key}</p>
                      <p className="text-[12px] font-semibold text-text">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-3">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">Must-do</p>
              <div className="flex flex-wrap gap-1.5">
                {trip.highlights?.map((h, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full border"
                    style={{ background: 'rgba(27,67,50,0.04)', borderColor: '#E8DFCE', color: '#6B5C45' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl p-3"
              style={{ background: 'rgba(201,150,58,0.07)', border: '1px solid rgba(201,150,58,0.2)' }}>
              <span className="text-sm">💡</span>
              <p className="text-[11px] text-muted leading-relaxed">{trip.zeeyaTip}</p>
            </div>

            <p className="text-[11px] text-muted mt-2">
              Best time: <span className="font-semibold text-primary">{trip.bestTime}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isActive && (
        <p className="text-[11px] text-muted mt-1">Tap to see cost breakdown →</p>
      )}
    </motion.div>
  )
}

export default function TripPlanner() {
  const [step, setStep]         = useState('form')   // form | loading | result
  const [budget, setBudget]     = useState('')
  const [duration, setDuration] = useState('')
  const [vibe, setVibe]         = useState('')
  const [fromCity, setFromCity] = useState('')
  const [travelers, setTravelers] = useState('1')
  const [result, setResult]     = useState(null)
  const [activeTrip, setActiveTrip] = useState(0)
  const [error, setError]       = useState('')

  async function handlePlan() {
    if (!budget || !duration || !vibe) {
      setError('Please set your budget, duration, and trip vibe.')
      return
    }
    setError('')
    setStep('loading')
    try {
      const data = await getTripPlan({ budget, duration, vibe, fromCity: fromCity || 'Hyderabad', travelers })
      if (data) {
        setResult(data)
        setActiveTrip(0)
        setStep('result')
      } else {
        setError('Could not generate trips. Try again.')
        setStep('form')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('form')
    }
  }

  const BUDGET_PRESETS = ['3000', '5000', '8000', '15000', '25000']

  return (
    <section id="trips" className="py-24 px-6" style={{ background: '#FAF7F2' }}>
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
              Phase 2 · Trip Planner
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-text leading-[1.1] mb-5">
              Travel more,{' '}
              <span className="text-gradient">stress less.</span>
            </h2>
            <p className="text-muted text-[15px] max-w-xl mx-auto leading-relaxed">
              Tell ZEEYA your budget and vibe. Get 3 real trip options with exact cost breakdowns — so you know exactly what you'll spend.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-[1fr_1.15fr] gap-8 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-7 border shadow-card"
            style={{ background: '#FFFEF9', borderColor: '#E8DFCE' }}
          >
            <h3 className="text-[16px] font-bold text-text mb-6">Plan My Trip</h3>

            {/* Budget */}
            <div className="mb-5">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
                Total Budget (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 8000"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-[14px] text-text outline-none transition-colors mb-2"
                style={{ background: '#FAF7F2', borderColor: budget ? '#2D6A4F' : '#E8DFCE' }}
              />
              <div className="flex flex-wrap gap-1.5">
                {BUDGET_PRESETS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    className="text-[11px] px-2.5 py-1 rounded-full border transition-all"
                    style={{
                      background: budget === b ? 'rgba(27,67,50,0.08)' : 'transparent',
                      borderColor: budget === b ? '#2D6A4F' : '#E8DFCE',
                      color: budget === b ? '#1B4332' : '#9E8E79',
                    }}
                  >
                    ₹{parseInt(b).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-5">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2.5 block">
                How long?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDuration(d.id)}
                    className="flex flex-col px-3 py-2.5 rounded-xl text-left transition-all border"
                    style={{
                      background: duration === d.id ? 'rgba(27,67,50,0.08)' : 'transparent',
                      borderColor: duration === d.id ? '#2D6A4F' : '#E8DFCE',
                    }}
                  >
                    <span className="text-[13px] font-semibold" style={{ color: duration === d.id ? '#1B4332' : '#1A1508' }}>
                      {d.label}
                    </span>
                    <span className="text-[11px] text-muted">{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div className="mb-5">
              <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2.5 block">
                Trip vibe
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VIBES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all border text-left"
                    style={{
                      background: vibe === v.id ? 'rgba(201,150,58,0.1)' : 'transparent',
                      borderColor: vibe === v.id ? '#C9963A' : '#E8DFCE',
                      color: vibe === v.id ? '#C9963A' : '#6B5C45',
                    }}
                  >
                    <span>{v.icon}</span>
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* From city + travelers row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
                  From city
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad"
                  value={fromCity}
                  onChange={e => setFromCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-[13px] text-text outline-none"
                  style={{ background: '#FAF7F2', borderColor: '#E8DFCE' }}
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2 block">
                  Travelers
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TRAVELERS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTravelers(t.id)}
                      className="py-2 rounded-xl text-[11px] font-medium transition-all border"
                      style={{
                        background: travelers === t.id ? 'rgba(27,67,50,0.08)' : 'transparent',
                        borderColor: travelers === t.id ? '#2D6A4F' : '#E8DFCE',
                        color: travelers === t.id ? '#1B4332' : '#6B5C45',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-[12px] mb-4" style={{ color: '#B91C1C' }}>{error}</p>
            )}

            <button
              onClick={handlePlan}
              disabled={step === 'loading'}
              className="btn-primary w-full py-3.5 text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {step === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finding your trips…
                </span>
              ) : (
                'Plan My Trip →'
              )}
            </button>
          </motion.div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                    style={{ background: 'rgba(201,150,58,0.08)' }}>
                    🗺️
                  </div>
                  <p className="text-[14px] font-semibold text-text mb-2">Your 3 trips appear here</p>
                  <p className="text-[13px] text-muted max-w-xs leading-relaxed">
                    Set your budget and vibe — ZEEYA will suggest real destinations with exact rupee breakdowns, no fluff.
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
                  <div className="flex flex-col gap-3 mb-4">
                    {result.trips?.map((trip, i) => (
                      <TripCard
                        key={i}
                        trip={trip}
                        index={i}
                        isActive={activeTrip === i}
                        onClick={() => setActiveTrip(activeTrip === i ? -1 : i)}
                      />
                    ))}
                  </div>

                  {/* Savings tip */}
                  {result.savingsTip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-2xl p-5 border"
                      style={{ background: 'rgba(27,67,50,0.05)', borderColor: '#2D6A4F' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm"
                          style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                          <span className="text-[#E8B65A] font-black text-[11px]">Z</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">ZEEYA says</p>
                          <p className="text-[13px] text-text leading-relaxed">{result.savingsTip}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={() => { setStep('form'); setResult(null) }}
                    className="mt-4 text-[12px] text-muted hover:text-primary transition-colors underline underline-offset-4"
                  >
                    ← Plan a different trip
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
