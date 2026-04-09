import { memo, useState, useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
  CheckCircle2, Clock, Lock, Globe, Server, Palette,
  Database, Terminal, Brain, Smartphone, Shield, BookOpen,
  ExternalLink, Zap, Plus, GitBranch, MoreHorizontal,
} from 'lucide-react'

/* ── Category map ─────────────────────────────────────────────── */
const CATS = {
  frontend: { Icon: Globe,       color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: 'Frontend' },
  backend:  { Icon: Server,      color: '#34d399', bg: 'rgba(52,211,153,0.12)',  label: 'Backend'  },
  design:   { Icon: Palette,     color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: 'Design'   },
  database: { Icon: Database,    color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  label: 'Database' },
  devops:   { Icon: Terminal,    color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'DevOps'   },
  ai:       { Icon: Brain,       color: '#c084fc', bg: 'rgba(192,132,252,0.12)', label: 'AI / ML'  },
  mobile:   { Icon: Smartphone,  color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)', label: 'Mobile'   },
  security: { Icon: Shield,      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Security' },
  default:  { Icon: BookOpen,    color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: 'General' },
}

function detectCat(title = '', override = '') {
  if (override && CATS[override]) return override
  const t = title.toLowerCase()
  if (/react|html|css|tailwind|next|vue|angular|svelte|vite|webpack|frontend|ui|ux/.test(t)) return 'frontend'
  if (/node|express|api|backend|server|fastify|django|flask|rails|php|go|rust|spring/.test(t)) return 'backend'
  if (/figma|design|typography|color|layout|ui design|wireframe|sketch/.test(t)) return 'design'
  if (/sql|postgres|mongo|database|prisma|supabase|redis|firebase|mysql|orm/.test(t)) return 'database'
  if (/docker|kubernetes|ci\/cd|linux|devops|cloud|aws|gcp|azure|deploy|terraform|nginx/.test(t)) return 'devops'
  if (/ml|ai|deep|neural|nlp|pytorch|tensorflow|scikit|numpy|pandas|llm|langchain/.test(t)) return 'ai'
  if (/android|ios|kotlin|swift|react native|flutter|mobile|compose|xcode/.test(t)) return 'mobile'
  if (/auth|security|jwt|oauth|encryption|ssl|https|penetration|hacking/.test(t)) return 'security'
  return 'default'
}

/* ── Status config ────────────────────────────────────────────── */
const ST = {
  pending: {
    label: 'Pending', Icon: Clock, color: '#64748b',
    border: 'rgba(30,41,59,0.55)',
    bg: 'linear-gradient(165deg, #0d1424 0%, #0a0f1e 100%)',
    footerBg: 'rgba(5,8,16,0.6)',
    badge: { bg: 'rgba(71,85,105,0.14)', border: 'rgba(71,85,105,0.22)', text: '#475569' },
  },
  'in-progress': {
    label: 'In Progress', Icon: Zap, color: '#fbbf24',
    border: 'rgba(251,191,36,0.3)',
    bg: 'linear-gradient(165deg, #12100a 0%, #0e0c07 100%)',
    footerBg: 'rgba(20,15,0,0.6)',
    badge: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24' },
  },
  completed: {
    label: 'Done', Icon: CheckCircle2, color: '#34d399',
    border: 'rgba(52,211,153,0.3)',
    bg: 'linear-gradient(165deg, #08140e 0%, #050e08 100%)',
    footerBg: 'rgba(0,15,8,0.6)',
    badge: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', text: '#34d399' },
  },
}

/* ── Tiny arc progress indicator ─────────────────────────────── */
function ArcProgress({ status }) {
  const size = 28
  const stroke = 2.5
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = status === 'completed' ? 100 : status === 'in-progress' ? 55 : 0
  const color = ST[status]?.color || '#64748b'
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(30,41,59,0.4)" strokeWidth={stroke} />
      {pct > 0 && (
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      )}
    </svg>
  )
}

/* ── NODE COMPONENT ───────────────────────────────────────────── */
function SkillNode({ id, data }) {
  const updateNodeStatus = useStore((s) => s.updateNodeStatus)
  const selectedNodeId   = useStore((s) => s.selectedNodeId)
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isSelected = selectedNodeId === id
  const isLocked   = !data.unlocked
  const status     = data.status || 'pending'
  const st         = ST[status] || ST.pending
  const { Icon: StatusIcon } = st

  const title   = data.title || data.label || 'New Skill'
  const catKey  = detectCat(title, data.category)
  const cat     = CATS[catKey]
  const { Icon: CatIcon } = cat

  const linkCount = data.links?.filter(l => l.url)?.length || 0
  const show       = hovered || isSelected

  // Dependency highlight
  const hl = data.relationHighlight
  const isPrereq = hl === 'prerequisite'
  const isDep    = hl === 'dependent'

  const getBorder = () => {
    if (isLocked) return 'rgba(20,30,50,0.5)'
    if (isSelected) return '#6366f1'
    if (isPrereq) return 'rgba(248,113,113,0.6)'
    if (isDep)    return 'rgba(52,211,153,0.6)'
    if (hovered)  return cat.color + '55'
    return st.border
  }

  const getShadow = () => {
    if (isLocked)   return '0 2px 8px rgba(0,0,0,0.3)'
    if (isSelected) return `0 0 0 2px #6366f1, 0 12px 36px rgba(99,102,241,0.22)`
    if (isPrereq)   return '0 0 0 1.5px rgba(248,113,113,0.45)'
    if (isDep)      return '0 0 0 1.5px rgba(52,211,153,0.45)'
    if (status === 'in-progress') return `0 0 0 1px ${st.border}, 0 6px 24px rgba(251,191,36,0.1)`
    if (status === 'completed')   return `0 0 0 1px ${st.border}, 0 6px 24px rgba(52,211,153,0.1)`
    return hovered ? '0 8px 28px rgba(0,0,0,0.5)' : '0 3px 14px rgba(0,0,0,0.4)'
  }

  const setStatus = useCallback((s) => {
    updateNodeStatus(id, s)
    setMenuOpen(false)
  }, [id, updateNodeStatus])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{ position: 'relative', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Add-Child floating button (bottom-center, outside card) ─ */}
      <AnimatePresence>
        {show && !isLocked && data.onAddChild && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => { e.stopPropagation(); data.onAddChild(id) }}
            title="Add child skill"
            style={{
              position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
              zIndex: 20,
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: '2px solid rgba(4,7,14,1)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(99,102,241,0.5)',
            }}
          >
            <Plus size={11} color="white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Card ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{
          width: 216,
          background: isLocked ? 'linear-gradient(165deg, #060910, #040712)' : st.bg,
          border: `1.5px solid ${getBorder()}`,
          borderRadius: 16,
          boxShadow: getShadow(),
          opacity: isLocked ? 0.38 : 1,
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'border-color 0.18s, box-shadow 0.18s, opacity 0.2s',
          userSelect: 'none',
        }}
      >
        {/* Color accent stripe */}
        <div style={{
          height: 2.5,
          background: isLocked ? '#111827' : `linear-gradient(90deg, ${cat.color}cc, ${st.color}55)`,
        }} />

        {/* ── Main body ──────────────────────────────────────────── */}
        <div style={{ padding: '11px 12px 10px' }}>

          {/* Row 1: icon + title + arc */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            {/* Category icon */}
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLocked ? 'rgba(15,23,42,0.3)' : cat.bg,
              border: `1px solid ${isLocked ? 'rgba(30,41,59,0.2)' : cat.color + '28'}`,
            }}>
              <CatIcon size={14} color={isLocked ? '#1e293b' : cat.color} />
            </div>

            {/* Title + status */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
              <div style={{
                fontWeight: 800, fontSize: 12, lineHeight: 1.3,
                color: isLocked ? '#1a2a40' : '#f1f5f9',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                letterSpacing: '-0.015em', marginBottom: 5,
              }}>{title}</div>

              {/* Status badge */}
              {isLocked ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '2px 7px', borderRadius: 5, fontSize: 9, fontWeight: 700,
                  background: 'rgba(10,15,28,0.8)', color: '#1e2d45',
                  border: '1px solid rgba(15,25,45,0.8)',
                }}>
                  <Lock size={8} /> Locked
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '2px 7px', borderRadius: 5, fontSize: 9, fontWeight: 700,
                  background: st.badge.bg, color: st.badge.text,
                  border: `1px solid ${st.badge.border}`,
                }}>
                  <StatusIcon size={9} />
                  {st.label}
                </span>
              )}
            </div>

            {/* Arc progress */}
            {!isLocked && (
              <div style={{ flexShrink: 0, marginTop: 1 }}>
                <ArcProgress status={status} />
              </div>
            )}
          </div>

          {/* Description */}
          {!isLocked && data.description && (
            <p style={{
              fontSize: 10.5, color: '#3d5070', lineHeight: 1.55, marginTop: 8,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {data.description}
            </p>
          )}

          {/* Meta row: category + links */}
          {!isLocked && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 8,
            }}>
              <span style={{
                padding: '2px 7px', borderRadius: 4,
                fontSize: 8.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                background: cat.bg, color: cat.color,
              }}>
                {cat.label}
              </span>
              {linkCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, color: '#4f5b8c', fontWeight: 600 }}>
                  <ExternalLink size={9} />
                  {linkCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Status action footer (shown on hover / selection) ───── */}
        {!isLocked && (
          <div style={{
            borderTop: `1px solid rgba(30,41,59,0.4)`,
            padding: '6px 10px 8px',
            background: st.footerBg,
            display: 'flex', gap: 4,
            overflow: 'hidden',
            // Use height transition instead of scaleY to avoid overflow glitch
            maxHeight: show ? 60 : 0,
            paddingTop: show ? 6 : 0,
            paddingBottom: show ? 8 : 0,
            borderTopWidth: show ? 1 : 0,
            transition: 'max-height 0.18s ease, padding 0.18s ease, border-top-width 0.18s',
          }}>
            {[
              { key: 'pending',     Icon: Clock,         color: '#64748b', label: 'Pending'  },
              { key: 'in-progress', Icon: Zap,           color: '#fbbf24', label: 'Working'  },
              { key: 'completed',   Icon: CheckCircle2,  color: '#34d399', label: 'Done'     },
            ].map(({ key, Icon, color, label }) => {
              const active = status === key
              return (
                <button
                  key={key}
                  onMouseDown={(e) => { e.stopPropagation(); setStatus(key) }}
                  title={`Mark as ${label}`}
                  style={{
                    flex: 1, padding: '4px 0', borderRadius: 7, cursor: 'pointer',
                    border: `1px solid ${active ? color + '50' : 'rgba(30,41,59,0.5)'}`,
                    background: active ? `${color}16` : 'rgba(5,8,16,0.4)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    transition: 'all 0.13s',
                    outline: 'none',
                  }}
                >
                  <Icon size={11} color={active ? color : '#2a3a55'} />
                  <span style={{ fontSize: 8, fontWeight: 700, color: active ? color : '#2a3a55', letterSpacing: '0.04em' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* ── ReactFlow Handles ─────────────────────────────────────── */}
      {/* TOP — incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#6366f1',
          border: '2.5px solid #03060f',
          width: 13, height: 13,
          top: -6.5,
          boxShadow: '0 0 10px rgba(99,102,241,0.65)',
        }}
      />
      {/* BOTTOM — outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#6366f1',
          border: '2.5px solid #03060f',
          width: 13, height: 13,
          bottom: -6.5,
          boxShadow: '0 0 10px rgba(99,102,241,0.65)',
        }}
      />
      {/* LEFT — additional input */}
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={{
          background: '#4f46e5',
          border: '2px solid #03060f',
          width: 10, height: 10,
          left: -5,
          opacity: show ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      />
      {/* RIGHT — additional output */}
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          background: '#4f46e5',
          border: '2px solid #03060f',
          width: 10, height: 10,
          right: -5,
          opacity: show ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      />
    </div>
  )
}

export default memo(SkillNode)
