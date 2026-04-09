import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  GitBranch, Hand, Pencil, Plus, Trash2, Save, Download,
  ArrowLeft, Search, Undo2, Redo2, Share2, X, Link as LinkIcon,
} from 'lucide-react'

function CanvasToolbar({
  mode, setMode,
  selectedNodeId,
  onAddSkill,
  onAddChild,
  onDeleteNode,
  onSaveRoadmap,
  onExportJson,
  onBackToLibrary,
  onSearch,
  onUndo, onRedo,
  canUndo, canRedo,
  onShareLink,
  onLinkMode,
  activeRoadmapTitle,
  progress,
}) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    onSearch?.(val)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    handleSearchChange('')
  }

  const { total = 0, completed = 0, unlocked = 0, percentage = 0 } = progress || {}

  return (
    <div
      style={{
        height: 56, zIndex: 100, position: 'relative', flexShrink: 0,
        background: 'rgba(4, 7, 14, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,41,59,0.45)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex', alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 14px', gap: 6 }}>

        {/* Logo — click to go home */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginRight: 4, flexShrink: 0,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
          title="Back to Home"
        >
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <GitBranch size={14} color="white" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em', transition: 'color 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#e2e8f0'}
          >
            DevStakes
          </span>
        </button>

        <Sep />

        {/* Back button */}
        {onBackToLibrary && (
          <ToolbarBtn onClick={onBackToLibrary} tooltip="Back to Library">
            <ArrowLeft size={13} />
            <span style={{ fontSize: 11 }}>Library</span>
          </ToolbarBtn>
        )}

        {/* Roadmap title */}
        {activeRoadmapTitle && (
          <div style={{
            maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            padding: '4px 10px', borderRadius: 7,
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(30,41,59,0.5)',
            fontSize: 11, fontWeight: 500, color: '#475569',
          }}>
            {activeRoadmapTitle}
          </div>
        )}

        <Sep />

        {/* Mode toggle */}
        <div style={{
          display: 'flex', borderRadius: 9,
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(30,41,59,0.6)',
          padding: 3, gap: 2, flexShrink: 0,
        }}>
          <ModeBtn active={mode === 'pan'} onClick={() => setMode('pan')} Icon={Hand} label="Pan" />
          <ModeBtn active={mode === 'edit'} onClick={() => setMode('edit')} Icon={Pencil} label="Edit" />
        </div>

        <Sep />

        {/* Add Skill button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddSkill}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 13px', borderRadius: 9, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'white',
            boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
            letterSpacing: '0.01em', flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={13} /> Add Skill
        </motion.button>

        {/* Edit mode contextual actions */}
        <AnimatePresence>
          {selectedNodeId && (
            <motion.div
              initial={{ opacity: 0, x: -8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <ToolbarBtn
                onClick={onAddSkill}
                variant="indigo"
                tooltip="Add child of selected (N)"
              >
                <Plus size={12} />
                <span style={{ fontSize: 11 }}>Child</span>
              </ToolbarBtn>
              <ToolbarBtn
                onClick={onLinkMode}
                variant="amber"
                tooltip="Link this node to another"
              >
                <LinkIcon size={12} />
                <span style={{ fontSize: 11 }}>Link</span>
              </ToolbarBtn>
              {mode === 'edit' && (
                <ToolbarBtn onClick={onDeleteNode} variant="rose" tooltip="Delete node (Del)">
                  <Trash2 size={12} />
                </ToolbarBtn>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Sep />

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <IconBtn onClick={onUndo} disabled={!canUndo} tooltip="Undo (Ctrl+Z)">
            <Undo2 size={14} />
          </IconBtn>
          <IconBtn onClick={onRedo} disabled={!canRedo} tooltip="Redo (Ctrl+Y)">
            <Redo2 size={14} />
          </IconBtn>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <IconBtn onClick={() => setSearchOpen(!searchOpen)} tooltip="Search">
            <Search size={14} />
          </IconBtn>
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                style={{
                  position: 'absolute', left: 0, top: '100%', marginTop: 8, zIndex: 50,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                  placeholder="Search nodes..."
                  style={{
                    width: 180, padding: '7px 12px',
                    borderRadius: 9, border: '1px solid rgba(30,41,59,0.8)',
                    background: '#0a1120',
                    color: 'white', fontSize: 11, outline: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontFamily: 'inherit',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={closeSearch}
                    style={{
                      width: 22, height: 22, borderRadius: 5 , border: 'none',
                      background: 'rgba(30,41,59,0.7)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#64748b',
                    }}
                  >
                    <X size={11} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Progress stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <StatItem label="Nodes" value={`${completed}/${total}`} color="#e2e8f0" />
          <StatItem label="Open" value={unlocked} color="#34d399" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Progress
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 64, height: 5, borderRadius: 3, background: 'rgba(30,41,59,0.8)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: 'linear-gradient(90deg, #6366f1, #34d399)',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', minWidth: 28, textAlign: 'right' }}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        <Sep />

        {/* Share */}
        {onShareLink && (
          <IconBtn onClick={onShareLink} tooltip="Share">
            <Share2 size={14} />
          </IconBtn>
        )}

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSaveRoadmap}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 13px', borderRadius: 9, border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'white',
            boxShadow: '0 2px 10px rgba(16,185,129,0.25)',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          <Save size={12} /> Save
        </motion.button>

        {/* Export */}
        <IconBtn onClick={onExportJson} tooltip="Export JSON">
          <Download size={14} />
        </IconBtn>
      </div>
    </div>
  )
}

/* ─── Sub-components ──────────────────────────────────────────── */

function Sep() {
  return (
    <div style={{ width: 1, height: 22, background: 'rgba(30,41,59,0.7)', flexShrink: 0, margin: '0 2px' }} />
  )
}

function StatItem({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: 12, fontWeight: 800, color }}>
        {value}
      </span>
    </div>
  )
}

function ModeBtn({ active, onClick, Icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
        background: active ? '#5046e5' : 'transparent',
        color: active ? '#fff' : '#475569',
        fontSize: 11, fontWeight: 600,
        boxShadow: active ? '0 1px 8px rgba(80,70,229,0.4)' : 'none',
        transition: 'all 0.15s',
      }}
    >
      <Icon size={12} /> {label}
    </button>
  )
}

function IconBtn({ children, onClick, disabled, tooltip }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{
        width: 30, height: 30, borderRadius: 7,
        background: 'transparent', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? '#1e293b' : '#4b5563', transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#cbd5e1' } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = disabled ? '#1e293b' : '#4b5563' }}
    >
      {children}
    </button>
  )
}

function ToolbarBtn({ children, onClick, variant, tooltip }) {
  const variants = {
    indigo: { border: 'rgba(99,102,241,0.3)', bg: 'rgba(99,102,241,0.08)', color: '#818cf8', hoverBg: 'rgba(99,102,241,0.15)' },
    rose:   { border: 'rgba(239,68,68,0.3)',  bg: 'rgba(239,68,68,0.08)',  color: '#f87171', hoverBg: 'rgba(239,68,68,0.15)'  },
    amber:  { border: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.08)', color: '#fbbf24', hoverBg: 'rgba(251,191,36,0.14)' },
    emerald:{ border: 'rgba(52,211,153,0.3)', bg: 'rgba(52,211,153,0.08)', color: '#34d399', hoverBg: 'rgba(52,211,153,0.14)' },
    default:{ border: 'rgba(30,41,59,0.7)',   bg: 'rgba(15,23,42,0.5)',    color: '#94a3b8', hoverBg: 'rgba(30,41,59,0.6)'    },
  }
  const v = variants[variant] || variants.default

  return (
    <button
      onClick={onClick}
      title={tooltip}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 7,
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = v.hoverBg }}
      onMouseLeave={(e) => { e.currentTarget.style.background = v.bg }}
    >
      {children}
    </button>
  )
}

export default memo(CanvasToolbar)
