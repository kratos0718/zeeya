export default function Footer() {
  return (
    <footer className="bg-white border-t border-border px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center shadow-soft">
                <span className="text-white text-[14px] font-black">Z</span>
              </div>
              <span className="font-bold text-[17px] text-text">ZEEYA</span>
            </div>
            <p className="text-[13px] text-muted leading-relaxed mb-2">
              Your AI Financial Brain. Track, protect, and grow your money automatically.
            </p>
            <p className="text-[12px] text-subtle">
              Founded by{' '}
              <span className="text-primary font-semibold">Teja</span>
              {' '}&{' '}
              <span className="text-primary font-semibold">Abhinav</span>
              {' '}· Visakhapatnam, India
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-10">
            {[
              { title: 'Product', links: ['Features', 'How it works', 'Pricing', 'Download'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal',   links: ['Privacy', 'Terms', 'Security', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-[12px] font-bold text-text uppercase tracking-wide mb-3">{col.title}</h4>
                <ul className="space-y-2">
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
          <p className="text-[12px] text-subtle">© 2025 ZEEYA. Built with ❤️ in Visakhapatnam, India.</p>
          <div className="flex items-center gap-1.5 text-[12px] text-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            SMS data never stored on servers
          </div>
        </div>
      </div>
    </footer>
  )
}
