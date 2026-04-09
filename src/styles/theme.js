// ╔═══════════════════════════════════════════════════════════════╗
// ║  Design Tokens — Centralized theme configuration            ║
// ╚═══════════════════════════════════════════════════════════════╝

export const colors = {
  // Base
  bg: '#050810',
  bgCard: '#0c1222',
  bgSurface: '#111827',
  bgInput: '#1a2236',

  // Borders
  border: '#1e293b',
  borderHover: '#334155',
  borderActive: '#4f46e5',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  textAccent: '#818cf8',

  // Brand
  indigo: '#6366f1',
  indigoDark: '#4f46e5',
  indigoLight: '#818cf8',
  indigoGlow: 'rgba(99, 102, 241, 0.4)',

  // Status
  emerald: '#34d399',
  emeraldDark: '#059669',
  emeraldGlow: 'rgba(52, 211, 153, 0.35)',
  amber: '#fbbf24',
  amberDark: '#d97706',
  rose: '#f87171',
  roseDark: '#dc2626',

  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  gradientSecondary: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  gradientSuccess: 'linear-gradient(135deg, #10b981, #34d399)',
  gradientHero: 'linear-gradient(135deg, #0c1222 0%, #1a1145 50%, #0c1222 100%)',
}

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
  md: '0 4px 16px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
  glow: {
    indigo: '0 0 20px rgba(99, 102, 241, 0.35)',
    emerald: '0 0 20px rgba(52, 211, 153, 0.3)',
    amber: '0 0 20px rgba(251, 191, 36, 0.3)',
  },
}

export const transitions = {
  spring: { type: 'spring', stiffness: 300, damping: 25 },
  smooth: { duration: 0.3, ease: 'easeInOut' },
  bouncy: { type: 'spring', stiffness: 400, damping: 15 },
  slow: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.08 },
    },
  },
}
