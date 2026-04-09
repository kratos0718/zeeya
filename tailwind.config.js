/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#FAF7F2',
        surface:  '#FFFEF9',
        card:     '#FFFFFF',
        border:   '#E8DFCE',
        borderl:  '#D4C9B5',
        primary:  '#1B4332',
        primaryl: '#2D6A4F',
        forest:   '#14532D',
        sage:     '#4A7C59',
        gold:     '#C9963A',
        goldl:    '#E8B65A',
        amber:    '#D97706',
        text:     '#1A1508',
        muted:    '#6B5C45',
        subtle:   '#9E8E79',
        cream:    '#FAF7F2',
        parchment:'#F5EFE3',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'soft':   '0 2px 20px rgba(27,67,50,0.06), 0 1px 4px rgba(0,0,0,0.03)',
        'card':   '0 4px 28px rgba(27,67,50,0.07), 0 1px 6px rgba(0,0,0,0.04)',
        'hover':  '0 10px 44px rgba(27,67,50,0.13), 0 2px 10px rgba(0,0,0,0.06)',
        'glow':   '0 0 50px rgba(27,67,50,0.18)',
        'gold':   '0 0 40px rgba(201,150,58,0.2)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':    'shimmer 2.5s ease-in-out infinite',
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
        shimmer: {
          '0%,100%': { opacity: '0.7' },
          '50%':     { opacity: '1' },
        },
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(140deg, #FAF7F2 0%, #F0EBE0 35%, #EAF2ED 70%, #FAF7F2 100%)',
        'primary-gradient': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
        'gold-gradient':    'linear-gradient(135deg, #C9963A 0%, #E8B65A 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(255,254,249,0.9) 0%, rgba(240,235,224,0.5) 100%)',
        'warm-gradient':    'linear-gradient(135deg, #FAF7F2 0%, #F5EFE3 100%)',
      },
    },
  },
  plugins: [],
}
