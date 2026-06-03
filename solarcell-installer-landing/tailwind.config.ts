import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Landing tokens (semantic) + onboarding tokens (numeric scale) coexist
        // under `solar` because their keys do not overlap.
        solar: {
          ink: '#0D2B33',
          text: '#10262D',
          muted: '#4B5C63',
          green: '#43A047',
          greenDark: '#0B8A3A',
          greenDeep: '#0C7E34',
          pale: '#E8F5E9',
          panel: '#052D36',
          panel2: '#082B33',
          line: '#E5ECE8',
          25: '#f7fcf8',
          50: '#eef9f0',
          100: '#dff3e4',
          200: '#bce7c8',
          300: '#8ed3a0',
          400: '#43b85b',
          500: '#159a34',
          600: '#078a26',
          700: '#087122',
          900: '#043d17',
        },
        ink: {
          DEFAULT: '#07142f',
          50: '#f8fafc',
          100: '#edf2f7',
          950: '#09111f',
          200: '#dce5ee',
          300: '#cbd8e4',
          500: '#65758b',
          700: '#243145',
          800: '#111827',
          900: '#07111f',
        },
        warning: {
          50: '#fff7ed',
          500: '#f97316',
          700: '#b45309',
        },
      },
      boxShadow: {
        soft: '0 18px 55px rgba(8, 43, 51, 0.14)',
        button: '0 13px 26px rgba(20, 150, 67, 0.22)',
        shell: '0 18px 55px rgba(15, 23, 42, 0.05)',
        card: '0 14px 40px rgba(15, 23, 42, 0.055)',
        softGreen: '0 14px 35px rgba(5, 150, 51, 0.18)',
        'solar-card': '0 18px 52px rgba(15, 23, 42, 0.055)',
        'solar-soft': '0 10px 30px rgba(15, 23, 42, 0.04)',
      },
      backgroundImage: {
        page: 'radial-gradient(circle at 32% 10%, rgba(31, 156, 62, 0.05), transparent 24%), linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
        greenSoft: 'linear-gradient(90deg, rgba(20, 156, 52, 0.09), rgba(20, 156, 52, 0.02))',
        orangeSoft: 'linear-gradient(135deg, rgba(255, 247, 237, 0.98), rgba(254, 242, 226, 0.92))',
      },
    },
  },
  plugins: [],
} satisfies Config;
