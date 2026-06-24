/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          hover: '#1C357D',
          container: '#DBE4FF',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          variant: '#EEF2F7',
        },
        ews: {
          red: '#EF4444',
          amber: '#F59E0B',
          green: '#10B981',
        },
        outline: '#E2E8F0',
      },
      fontSize: {
        display: ['36px', { lineHeight: '44px', fontWeight: '700' }],
        h1: ['28px', { lineHeight: '36px', fontWeight: '700' }],
        h2: ['22px', { lineHeight: '30px', fontWeight: '600' }],
        h3: ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        body: ['14px', { lineHeight: '20px' }],
        label: ['13px', { lineHeight: '18px', fontWeight: '500' }],
        badge: ['11px', { lineHeight: '16px', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,.08), 0 1px 2px rgba(15,23,42,.04)',
        pop: '0 8px 24px rgba(15,23,42,.12)',
      },
    },
  },
  plugins: [],
};
