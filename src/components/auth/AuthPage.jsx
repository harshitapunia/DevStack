import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GitBranch, Mail, Lock, User, ArrowRight, Eye, EyeOff, Zap, Shield } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, error, clearError, user, loading } = useAuthStore()

  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && !loading) navigate('/library')
  }, [user, loading, navigate])

  useEffect(() => {
    clearError()
  }, [isRegister, clearError])

  const handleDemoLogin = () => navigate('/library')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isSupabaseConfigured) { navigate('/library'); return }
    setSubmitting(true)
    const success = isRegister
      ? await register(email, password, displayName)
      : await login(email, password)
    setSubmitting(false)
    if (success) navigate('/library')
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #030508 0%, #050810 40%, #060b14 100%)', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', top: '20%', left: '20%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '20%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(30,41,59,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo + Brand */}
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
            style={{
              width: 60, height: 60,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.2)',
              marginBottom: 20,
            }}
          >
            <GitBranch size={26} color="white" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? 'reg' : 'login'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 8 }}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                {isRegister ? 'Start building your learning roadmaps' : 'Continue your learning journey'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <div style={{
          borderRadius: 24,
          border: '1px solid rgba(30,41,59,0.7)',
          background: 'rgba(8, 12, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
          overflow: 'hidden',
        }}>
          {/* Demo Banner */}
          {!isSupabaseConfigured && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                borderBottom: '1px solid rgba(99,102,241,0.15)',
                background: 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                padding: '16px 28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 1,
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(99,102,241,0.25)',
                }}>
                  <Zap size={14} color="#818cf8" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', marginBottom: 3 }}>Demo Mode Active</p>
                  <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
                    Supabase not configured — explore freely. All data saves locally in your browser.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleDemoLogin}
                    style={{
                      marginTop: 12, width: '100%',
                      padding: '10px 0',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontSize: 12, fontWeight: 700, color: 'white',
                      boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                    }}
                  >
                    <ArrowRight size={13} />
                    Continue as Guest
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <div style={{ padding: '28px 28px 24px' }}>
            {/* Divider */}
            {!isSupabaseConfigured && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(30,41,59,0.8)' }} />
                <span style={{ fontSize: 11, color: '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  or sign in with Supabase
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(30,41,59,0.8)' }} />
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Display Name (register only) */}
              <AnimatePresence mode="wait">
                {isRegister && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, marginBottom: -18 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: -18 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <FormField label="Display Name" icon={<User size={14} color="#475569" />}>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        style={inputStyle}
                      />
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <FormField label="Email Address" icon={<Mail size={14} color="#475569" />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </FormField>

              {/* Password */}
              <FormField label="Password" icon={<Lock size={14} color="#475569" />}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    style={{ ...inputStyle, paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#475569', padding: 2,
                      display: 'flex', alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FormField>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid rgba(239,68,68,0.2)',
                      background: 'rgba(239,68,68,0.07)',
                      fontSize: 12, color: '#fca5a5', lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                style={{
                  width: '100%', padding: '13px 0',
                  borderRadius: 12, border: 'none', cursor: submitting ? 'default' : 'pointer',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 14, fontWeight: 700, color: 'white',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  opacity: submitting ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  marginTop: 4,
                }}
              >
                {submitting ? (
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                ) : (
                  <>
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#475569', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
              >
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <span style={{ color: '#818cf8', fontWeight: 600 }}>
                  {isRegister ? 'Sign in' : 'Sign up'}
                </span>
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div style={{
            padding: '12px 28px',
            borderTop: '1px solid rgba(30,41,59,0.5)',
            background: 'rgba(5,8,16,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Shield size={11} color="#334155" />
            <span style={{ fontSize: 11, color: '#334155' }}>Secured with end-to-end encryption</span>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#334155', transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#64748b'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#334155'}
          >
            ← Back to home
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

/* ── Form Field ── */
function FormField({ label, icon, children }) {
  return (
    <div>
      <label style={{
        display: 'block', marginBottom: 8,
        fontSize: 11, fontWeight: 700,
        color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', pointerEvents: 'none',
        }}>
          {icon}
        </div>
        {children}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  borderRadius: 10,
  border: '1px solid rgba(30,41,59,0.8)',
  background: 'rgba(15,23,42,0.5)',
  color: '#f1f5f9',
  fontSize: 13,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: "'Inter', sans-serif",
}
