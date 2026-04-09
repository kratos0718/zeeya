export default function Footer() {
  return (
    <footer className="bg-white border-t border-border px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Gold top accent */}
        <div className="gold-line mb-10 opacity-40" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-soft"
                style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)' }}>
                <span className="text-[14px] font-black" style={{ color: '#E8B65A' }}>Z</span>
              </div>
              <span className="font-bold text-[17px] tracking-tight" style={{ color: '#1A1508' }}>ZEEYA</span>
            </div>
            <p className="text-[13px] text-muted leading-relaxed mb-3">
              Your AI Financial Brain. Track, protect, and grow your money automatically.
            </p>
            <p className="text-[12px] text-subtle">
              Founded by{' '}
              <span className="font-semibold" style={{ color: '#1B4332' }}>Teja</span>
              {' '}&{' '}
              <span className="font-semibold" style={{ color: '#C9963A' }}>Abhinav</span>
              {' '}· Visakhapatnam, India
            </p>

            {/* Domain pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2D6A4F' }} />
              <span className="text-[12px] font-medium text-muted">zeeya.online</span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-10">
            {[
              { title: 'Product', links: ['Features', 'How it works', 'AI Finance', 'Download'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal',   links: ['Privacy', 'Terms', 'Security', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: '#9E8E79' }}>{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-[13px] text-muted hover:text-primary transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-subtle">© 2025 ZEEYA. Built with care in Visakhapatnam, India.</p>
          <div className="flex items-center gap-1.5 text-[12px] text-subtle">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2D6A4F' }} />
            SMS data never stored on servers
          </div>
        </div>
      </div>
    </footer>
  )
}
