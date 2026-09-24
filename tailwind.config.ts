import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0F17',
        surface: {
          1: '#111827',
          2: '#161F30',
          3: '#1E293B',
        },
        border: {
          default: '#1E293B',
          active: '#334155',
        },
        btc: {
          50: '#fff9ed',
          100: '#ffefd4',
          500: '#F7931A',
          600: '#E87A0C',
        },
        brand: {
          primary: '#F7931A',
          hover: '#E87A0C',
          cyan: '#38BDF8',
          emerald: '#10B981',
          rose: '#EF4444',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: '0.125rem', // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
      },
    },
  },
  plugins: [],
};

export default config;
