/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#FAFAFA',
        surface:  '#FFFFFF',
        card:     '#FFFFFF',
        border:   '#E5E7EB',
        borderl:  '#D1D5DB',
        primary:  '#4F46E5',
        primaryl: '#6366F1',
        violet:   '#7C3AED',
        lavender: '#8B5CF6',
        cyan:     '#06B6D4',
        sky:      '#0EA5E9',
        text:     '#111827',
        muted:    '#6B7280',
        subtle:   '#9CA3AF',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'soft':   '0 2px 20px rgba(79,70,229,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card':   '0 4px 24px rgba(79,70,229,0.08), 0 1px 6px rgba(0,0,0,0.04)',
        'hover':  '0 8px 40px rgba(79,70,229,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        'glow':   '0 0 40px rgba(79,70,229,0.18)',
        'cyan':   '0 0 40px rgba(6,182,212,0.15)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.7' },
          '50%':     { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FAFAFA 0%, #F0EFFE 40%, #EEF9FF 70%, #FAFAFA 100%)',
        'primary-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,238,254,0.6) 100%)',
      },
    },
  },
  plugins: [],
}
