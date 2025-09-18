// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced brand colors for MSME ESG Portal
        brand: {
          50: '#edf9f1',
          100: '#d3f1e0',
          200: '#a7e3c2',
          300: '#74d3a1',
          400: '#44c481',
          500: '#26a968',
          600: '#1a8452',
          700: '#176a44',
          800: '#15563a',
          900: '#0f3927',
        },
        // ESG pillar colors
        environmental: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        social: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        governance: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Status colors
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        // Priority colors
        priority: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#f97316',
          urgent: '#ef4444',
        },
        // Background variations
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        // Text variations
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          tertiary: '#64748b',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(34, 169, 104, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'esg-gradient': 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #a855f7 100%)',
      },
    },
  },
  plugins: [
    // Plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Plugin for typography
    require('@tailwindcss/typography'),
    // Plugin for aspect ratio
    require('@tailwindcss/aspect-ratio'),
    // Plugin for container queries
    require('@tailwindcss/container-queries'),
    // Custom plugin for utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.gray.100'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.gray.400'),
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: theme('colors.gray.500'),
            },
          },
        },
      });

      // Custom components
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.2xl'),
          boxShadow: theme('boxShadow.soft'),
          border: `1px solid ${theme('colors.gray.200')}`,
          padding: theme('spacing.4'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.medium'),
          },
        },
        '.card-compact': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.sm'),
          border: `1px solid ${theme('colors.gray.200')}`,
          padding: theme('spacing.3'),
        },
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme('spacing.2'),
          borderRadius: theme('borderRadius.xl'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm[0]'),
          fontWeight: theme('fontWeight.medium'),
          backgroundColor: theme('colors.brand.600'),
          color: theme('colors.white'),
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.brand.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.medium'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            '&:hover': {
              backgroundColor: theme('colors.brand.600'),
              transform: 'none',
              boxShadow: 'none',
            },
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.100'),
          color: theme('colors.gray.700'),
          '&:hover': {
            backgroundColor: theme('colors.gray.200'),
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.brand.600'),
          border: `1px solid ${theme('colors.brand.600')}`,
          '&:hover': {
            backgroundColor: theme('colors.brand.50'),
          },
        },
        '.link': {
          color: theme('colors.brand.700'),
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': {
            color: theme('colors.brand.800'),
          },
        },
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          fontSize: theme('fontSize.xs[0]'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.full'),
          backgroundColor: theme('colors.gray.100'),
          color: theme('colors.gray.700'),
        },
        '.input': {
          width: '100%',
          padding: theme('spacing.2'),
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm[0]'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.brand.500'),
            boxShadow: `0 0 0 3px ${theme('colors.brand.100')}`,
          },
          '&::placeholder': {
            color: theme('colors.gray.400'),
          },
        },
        '.select': {
          width: '100%',
          padding: theme('spacing.2'),
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm[0]'),
          backgroundColor: theme('colors.white'),
          cursor: 'pointer',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.brand.500'),
            boxShadow: `0 0 0 3px ${theme('colors.brand.100')}`,
          },
        },
        '.textarea': {
          width: '100%',
          padding: theme('spacing.2'),
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.sm[0]'),
          resize: 'vertical',
          minHeight: '80px',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.brand.500'),
            boxShadow: `0 0 0 3px ${theme('colors.brand.100')}`,
          },
        },
        '.container': {
          width: '100%',
          maxWidth: theme('maxWidth.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
      });
    },
  ],
  safelist: [
    // Safelist dynamic classes that might not be detected
    'bg-environmental-100',
    'bg-social-100',
    'bg-governance-100',
    'text-environmental-800',
    'text-social-800',
    'text-governance-800',
    'bg-red-100',
    'bg-yellow-100',
    'bg-green-100',
    'bg-blue-100',
    'bg-purple-100',
    'text-red-800',
    'text-yellow-800',
    'text-green-800',
    'text-blue-800',
    'text-purple-800',
  ],
}

export default config