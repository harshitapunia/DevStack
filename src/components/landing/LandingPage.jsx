import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, GitBranch, Target, Zap, BookOpen, Users,
  ArrowRight, ExternalLink, CheckCircle2, Star,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

// ─── Constellation Background ───────────────────────────────────
function ConstellationBG() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 110)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.4 + 0.4,
          opacity: Math.random() * 0.45 + 0.15,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.07 * (1 - dist / 140)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
      animationId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()
    const handleResize = () => { resize(); createParticles() }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

// ─── Feature data ────────────────────────────────────────────────
const features = [
  {
    icon: GitBranch, title: 'Interactive Tech Trees', color: '#818cf8',
    description: 'Drag, connect, and build branching skill trees just like RPG tech trees. Visual dependency tracking.',
  },
  {
    icon: Target, title: 'Progress Tracking', color: '#34d399',
    description: 'Track your learning journey node by node. Prerequisites unlock automatically as you complete skills.',
  },
  {
    icon: Zap, title: 'Preset Templates', color: '#fbbf24',
    description: '5 curated roadmaps — Web Dev, Python/DS, Mobile, DevOps, and AI/ML. One click to get started.',
  },
  {
    icon: BookOpen, title: 'Resource Links', color: '#f87171',
    description: 'Attach documentation, tutorials, and course links to each skill node for easy reference.',
  },
  {
    icon: Users, title: 'Share & Collaborate', color: '#38bdf8',
    description: 'Save roadmaps to the cloud. Share public links with classmates, mentees, or your college club.',
  },
  {
    icon: Sparkles, title: 'Cloud Sync', color: '#c084fc',
    description: 'Supabase-powered backend. Your roadmaps sync across devices, never lost.',
  },
]

// ─── Main Component ─────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const handleGetStarted = () => navigate(user ? '/library' : '/auth')

  return (
    <div style={{
      background: 'linear-gradient(135deg, #030508 0%, #050810 40%, #060b14 100%)',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ConstellationBG />

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(30,41,59,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.06) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Glow effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '15%', left: '35%',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Navigation ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(4, 7, 14, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(30,41,59,0.4)',
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 60,
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
            }}>
              <GitBranch size={15} color="white" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              DevStakes
            </span>
          </div>

          {/* Nav actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/library')}
                style={{
                  padding: '9px 20px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
                  boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
                }}
              >
                Dashboard
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  style={{
                    padding: '9px 18px', borderRadius: 10, cursor: 'pointer',
                    border: '1px solid rgba(30,41,59,0.7)',
                    background: 'rgba(15,23,42,0.5)',
                    fontSize: 13, fontWeight: 600, color: '#94a3b8',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.6)'; e.currentTarget.style.color = '#e2e8f0' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.7)'; e.currentTarget.style.color = '#94a3b8' }}
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth?mode=register')}
                  style={{
                    padding: '9px 20px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
                    boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
                  }}
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', textAlign: 'center',
        padding: '120px 32px 80px',
      }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 100,
            border: '1px solid rgba(99,102,241,0.25)',
            background: 'rgba(99,102,241,0.08)',
            fontSize: 12, fontWeight: 600, color: '#818cf8',
          }}>
            <Sparkles size={13} />
            Visual Learning Roadmap Builder
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08,
            color: '#f1f5f9', maxWidth: 820, margin: '0 auto 24px',
          }}
        >
          Build{' '}
          <span style={{
            background: 'linear-gradient(135deg, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Interactive
          </span>
          <br />
          Learning Roadmaps
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          style={{
            fontSize: 18, lineHeight: 1.7, color: '#64748b',
            maxWidth: 560, margin: '0 auto 44px',
          }}
        >
          Create branching tech trees for any skill. Track progress, share with your team,
          and turn static PDF roadmaps into a living, interactive journey.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 52 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleGetStarted}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 30px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              cursor: 'pointer', fontSize: 15, fontWeight: 700, color: 'white',
              boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
            }}
          >
            Start Building <ArrowRight size={17} />
          </motion.button>
          <button
            onClick={() => navigate('/library')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 14,
              border: '1px solid rgba(30,41,59,0.7)',
              background: 'rgba(15,23,42,0.5)',
              cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#94a3b8',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.6)'; e.currentTarget.style.color = '#e2e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.7)'; e.currentTarget.style.color = '#94a3b8' }}
          >
            Explore Templates
          </button>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 11, color: '#334155', marginRight: 4 }}>Built with</span>
          {['React', 'React Flow', 'Zustand', 'Supabase', 'Framer Motion', 'Tailwind CSS'].map((tech) => (
            <span
              key={tech}
              style={{
                padding: '4px 12px', borderRadius: 100,
                border: '1px solid rgba(30,41,59,0.6)',
                background: 'rgba(15,23,42,0.4)',
                fontSize: 11, fontWeight: 500, color: '#475569',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#818cf8' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#475569' }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '0 32px 120px' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
            Features
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 auto 16px', maxWidth: 540 }}>
            Everything You Need to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Learn Smarter
            </span>
          </h2>
          <p style={{ fontSize: 16, color: '#475569', margin: 0 }}>
            Not just another roadmap tool — a complete learning experience engine.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{
                  borderRadius: 20,
                  border: '1px solid rgba(30,41,59,0.6)',
                  background: 'rgba(8, 12, 22, 0.75)',
                  backdropFilter: 'blur(12px)',
                  padding: '28px 26px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${feature.color}25`
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${feature.color}12`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${feature.color}12`,
                  border: `1px solid ${feature.color}25`,
                  marginBottom: 18,
                }}>
                  <Icon size={21} style={{ color: feature.color }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 880, margin: '0 auto', padding: '0 32px 120px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: 28,
            border: '1px solid rgba(99,102,241,0.2)',
            background: 'rgba(8, 12, 22, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.08) inset',
            padding: '60px 40px',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Inner glow */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 400, height: 200,
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 100,
              border: '1px solid rgba(99,102,241,0.25)',
              background: 'rgba(99,102,241,0.08)',
              fontSize: 11, fontWeight: 700, color: '#818cf8',
              marginBottom: 24, letterSpacing: '0.06em',
            }}>
              <Star size={11} />
              FREE TO USE
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', margin: '0 auto 16px', maxWidth: 520 }}>
              Ready to Map Your Journey?
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: '0 auto 36px', maxWidth: 400 }}>
              Join and create your first interactive learning roadmap in minutes.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleGetStarted}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 32px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                cursor: 'pointer', fontSize: 15, fontWeight: 700, color: 'white',
                boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
              }}
            >
              Get Started Free <ArrowRight size={17} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(30,41,59,0.4)',
        padding: '28px 32px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155' }}>
            <GitBranch size={13} color="#475569" />
            <span>DevStakes — Built for Axios Web Wing</span>
          </div>
          <a
            href="https://github.com/Ewan-Dkhar/DevStakes"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: '#334155', textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#334155'}
          >
            <ExternalLink size={13} /> View on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
