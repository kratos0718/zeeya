'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    if (!email || status !== 'idle') return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 900))
    setStatus('done')
  }

  return (
    <section id="cta" className="py-28 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FAF7F2 0%, #F0EBE0 40%, #EAF2ED 80%, #FAF7F2 100%)' }}>

      {/* Decorative blobs */}
      <div className="blob w-[500px] h-[500px] top-[-20%] left-1/2 -translate-x-1/2 opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(27,67,50,0.10) 0%, transparent 70%)' }} />
      <div className="blob w-[300px] h-[300px] bottom-0 right-0 opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(201,150,58,0.15) 0%, transparent 70%)' }} />

      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C9963A 30%, #E8B65A 50%, #C9963A 70%, transparent 100%)' }} />

      <div ref={ref} className="max-w-3xl mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="badge inline-flex mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#C9963A' }} />
          Free for first 10,000 users
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-[44px] md:text-[60px] font-black leading-tight tracking-[-0.04em] mb-5"
          style={{ color: '#1A1508' }}
        >
          Your financial future
          <br />
          <span className="text-gradient">starts with ZEEYA.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-[17px] text-muted mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Join 12,000+ people on the waitlist.
          Launching in Visakhapatnam first — then all of India.
          Built by{' '}
          <span className="font-semibold" style={{ color: '#1B4332' }}>Teja</span>
          {' '}&{' '}
          <span className="font-semibold" style={{ color: '#C9963A' }}>Abhinav</span>.
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          {status === 'done' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-5 shadow-card"
              style={{ border: '1px solid rgba(27,67,50,0.15)' }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>✓</div>
              <div className="text-left">
                <div className="font-bold" style={{ color: '#1A1508' }}>You're on the list!</div>
                <div className="text-[13px] text-muted">We'll notify you when ZEEYA goes live.</div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white border border-border rounded-2xl px-5 py-4 text-[14px] outline-none placeholder:text-subtle shadow-soft transition-all"
                style={{ color: '#1A1508' }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,150,58,0.5)'}
                onBlur={e => e.target.style.borderColor = ''}
              />
              <button type="submit" disabled={status === 'loading'}
                className="btn-primary px-7 py-4 text-[14px] disabled:opacity-60 whitespace-nowrap">
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                      className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Joining...
                  </span>
                ) : 'Join waitlist →'}
              </button>
            </form>
          )}
          <p className="mt-3 text-[12px] text-subtle">No spam. No credit card required.</p>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: '🔒', text: 'Bank-grade security' },
            { icon: '🇮🇳', text: 'Built in India' },
            { icon: '⚡', text: 'Real-time AI' },
            { icon: '🌐', text: '12 languages' },
            { icon: '🆓', text: 'Free to start' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-1.5 text-[13px] text-muted">
              <span>{t.icon}</span>
              <span>{t.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
