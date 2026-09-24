import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Canonical Palette
        primary: '#316342',
        'primary-fixed': '#b9efc5',
        'primary-container': '#4a7c59',
        'on-primary': '#ffffff',
        'on-primary-fixed': '#00210e',
        'on-primary-container': '#e1ffe5',
        secondary: '#655d52',
        'secondary-container': '#e9ded0',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#696156',
        tertiary: '#6d5622',
        'tertiary-container': '#886e38',
        'on-tertiary': '#ffffff',
        surface: '#f7faf4',
        'surface-bright': '#f7faf4',
        'surface-dim': '#d8dbd5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f1f5ef',
        'surface-container': '#ecefe9',
        'surface-container-high': '#e6e9e3',
        'surface-container-highest': '#e0e3de',
        'surface-variant': '#e0e3de',
        'on-surface': '#191d19',
        'on-surface-variant': '#414942',
        background: '#f7faf4',
        'on-background': '#191d19',
        outline: '#717971',
        'outline-variant': '#c1c9bf',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        // Bitcoin brand
        btc: {
          500: '#F7931A',
          600: '#E87A0C',
        },
      },
      fontFamily: {
        headline: ['Literata', 'Georgia', 'serif'],
        display: ['Literata', 'Georgia', 'serif'],
        body: ['Nunito Sans', 'sans-serif'],
        label: ['Nunito Sans', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Nunito Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
