import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Upload, Trash2, LogOut, GitBranch,
  LayoutGrid, Clock, CheckCircle2, ChevronRight, Sparkles, User, X,
  BookOpen, Layers,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { PRESET_ROADMAPS } from '../../data/presets'
import { ImportModal } from '../canvas/SaveModal'

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch { return '' }
}

const BG_STYLE = {
  background: 'linear-gradient(135deg, #030508 0%, #050810 40%, #060b14 100%)',
  fontFamily: "'Inter', sans-serif",
  minHeight: '100vh',
}

export default function RoadmapLibrary({
  roadmaps,
  onCreateRoadmap,
  onOpenRoadmap,
  onDeleteRoadmap,
  onLoadPreset,
  onImportJson,
}) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [search, setSearch] = useState('')
  const [showPresets, setShowPresets] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const fileInputRef = useRef(null)

  const filtered = roadmaps.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleImport = (data) => {
    if (data?.nodes && data?.edges) {
      onImportJson?.(data)
      setShowImport(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Guest'

  return (
    <div style={BG_STYLE}>
      {/* Background layers */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '30%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(30,41,59,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.055) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
      </div>

      {/* ── Top Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(4, 7, 14, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,41,59,0.45)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 60,
        }}>
          {/* Brand — click to go home */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
              flexShrink: 0,
            }}>
              <GitBranch size={15} color="white" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
              DevStakes
            </span>
          </button>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 9,
              border: '1px solid rgba(30,41,59,0.6)',
              background: 'rgba(15,23,42,0.5)',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={11} color="white" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                width: 34, height: 34, borderRadius: 9,
                border: '1px solid rgba(30,41,59,0.6)',
                background: 'rgba(15,23,42,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#475569', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#475569' }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 36 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
            Dashboard
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                My Roadmaps
              </h1>
              <p style={{ marginTop: 8, fontSize: 14, color: '#475569' }}>
                {roadmaps.length === 0
                  ? 'Create your first roadmap to get started'
                  : `${roadmaps.length} roadmap${roadmaps.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={13} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search roadmaps..."
                  style={{
                    padding: '8px 14px 8px 34px',
                    borderRadius: 9, border: '1px solid rgba(30,41,59,0.7)',
                    background: 'rgba(15,23,42,0.5)', color: '#f1f5f9',
                    fontSize: 12, outline: 'none',
                    width: 180, fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.2s, width 0.3s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.width = '220px' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(30,41,59,0.7)'; e.target.style.width = '180px' }}
                />
              </div>

              {/* Import */}
              <ActionBtn onClick={() => setShowImport(true)} icon={<Upload size={12} />} label="Import" />

              {/* Templates */}
              <ActionBtn
                onClick={() => setShowPresets(!showPresets)}
                icon={<Sparkles size={12} />}
                label="Templates"
                variant="indigo"
                active={showPresets}
              />

              {/* New Roadmap */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCreateRoadmap}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'white',
                  boxShadow: '0 3px 12px rgba(99,102,241,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Plus size={14} /> New Roadmap
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Preset Templates ── */}
        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 36 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.28 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                borderRadius: 20,
                border: '1px solid rgba(99,102,241,0.15)',
                background: 'rgba(8, 12, 22, 0.85)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                padding: '24px 24px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Sparkles size={14} color="#818cf8" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.01em' }}>
                        Preset Templates
                      </h2>
                      <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                        Pick a curated roadmap and customize it
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPresets(false)}
                    style={{
                      width: 28, height: 28, borderRadius: 7,
                      border: '1px solid rgba(30,41,59,0.6)',
                      background: 'rgba(15,23,42,0.4)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#475569', transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
                  >
                    <X size={13} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {PRESET_ROADMAPS.map((preset, i) => (
                    <motion.button
                      key={preset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      onClick={() => { onLoadPreset?.(preset); setShowPresets(false) }}
                      style={{
                        borderRadius: 14, border: '1px solid rgba(30,41,59,0.55)',
                        background: 'rgba(15,23,42,0.5)',
                        padding: '16px 14px',
                        textAlign: 'left', cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.55)'; e.currentTarget.style.background = 'rgba(15,23,42,0.5)' }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${preset.color}12`,
                        border: `1px solid ${preset.color}25`,
                        fontSize: 18, marginBottom: 12,
                      }}>
                        {preset.icon}
                      </div>
                      <h3 style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        {preset.title}
                      </h3>
                      <p style={{ fontSize: 10.5, color: '#475569', lineHeight: 1.5, margin: 0,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {preset.summary}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Roadmap Grid / Empty State ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: '50vh', textAlign: 'center', padding: '60px 20px',
              borderRadius: 24, border: '1px dashed rgba(30,41,59,0.4)',
              background: 'rgba(8,12,22,0.5)',
            }}
          >
            {roadmaps.length === 0 ? (
              <>
                <div style={{
                  width: 64, height: 64, borderRadius: 18, marginBottom: 22,
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Layers size={28} color="#6366f1" style={{ opacity: 0.6 }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
                  No roadmaps yet
                </h2>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, maxWidth: 380, margin: '0 0 28px' }}>
                  Create your first roadmap from scratch or pick one of our preset templates to get started quickly.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <ActionBtn onClick={() => setShowPresets(true)} icon={<Sparkles size={12} />} label="Browse Templates" variant="indigo" />
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={onCreateRoadmap}
                    style={{
                      padding: '10px 20px', borderRadius: 10, border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
                      boxShadow: '0 3px 12px rgba(99,102,241,0.3)',
                    }}
                  >
                    Create Blank
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <Search size={30} color="#334155" style={{ marginBottom: 16 }} />
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>No matches found</h2>
                <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Try a different search term.</p>
              </>
            )}
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filtered.map((roadmap, i) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                index={i}
                onOpen={() => onOpenRoadmap(roadmap.id)}
                onDelete={onDeleteRoadmap ? () => {
                  if (confirm(`Delete "${roadmap.title}"?`)) onDeleteRoadmap(roadmap.id)
                } : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <ImportModal
            onImport={handleImport}
            onCancel={() => setShowImport(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Roadmap Card ── */
function RoadmapCard({ roadmap, index, onOpen, onDelete }) {
  const percentage = roadmap.stats?.percentage || 0
  const total = roadmap.stats?.total || 0
  const completed = roadmap.stats?.completed || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      style={{ position: 'relative' }}
    >
      {/* Delete */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          style={{
            position: 'absolute', right: 12, top: 12, zIndex: 10,
            width: 28, height: 28, borderRadius: 7,
            border: '1px solid rgba(30,41,59,0.6)',
            background: 'rgba(8,12,22,0.6)', backdropFilter: 'blur(8px)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#334155', opacity: 0, transition: 'all 0.15s',
          }}
          className="card-delete-btn"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#334155' }}
        >
          <Trash2 size={12} />
        </button>
      )}

      <button
        onClick={onOpen}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          padding: '22px 20px',
          borderRadius: 18,
          border: '1px solid rgba(30,41,59,0.5)',
          background: 'rgba(8,12,22,0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          display: 'block',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)'
          const del = e.currentTarget.parentElement.querySelector('.card-delete-btn')
          if (del) del.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(30,41,59,0.5)'
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)'
          const del = e.currentTarget.parentElement.querySelector('.card-delete-btn')
          if (del) del.style.opacity = '0'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 10, paddingRight: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0 }}>
            {roadmap.title}
          </h3>
        </div>
        <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, margin: '0 0 16px',
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {roadmap.summary || 'Interactive skill roadmap with connected milestones.'}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LayoutGrid size={12} color="#475569" />
            <span style={{ fontSize: 12, color: '#475569' }}>{total} nodes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={12} color="#34d399" />
            <span style={{ fontSize: 12, color: '#34d399' }}>{completed} done</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Progress
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: percentage > 0 ? '#818cf8' : '#334155' }}>
              {percentage}%
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(30,41,59,0.8)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.9, delay: index * 0.06, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(90deg, #6366f1, #34d399)',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {formatDate(roadmap.updated_at || roadmap.updatedAt) ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#334155' }}>
              <Clock size={10} />
              {formatDate(roadmap.updated_at || roadmap.updatedAt)}
            </span>
          ) : <span />}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
            Open <ChevronRight size={13} />
          </span>
        </div>
      </button>
    </motion.div>
  )
}

/* ── Small reusable button ── */
function ActionBtn({ onClick, icon, label, variant, active }) {
  const isIndigo = variant === 'indigo'
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 9, cursor: 'pointer',
        fontSize: 12, fontWeight: 600,
        border: isIndigo ? `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.2)'}` : '1px solid rgba(30,41,59,0.6)',
        background: isIndigo ? (active ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)') : 'rgba(15,23,42,0.4)',
        color: isIndigo ? '#818cf8' : '#64748b',
        transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (isIndigo) e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
        else { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.5)'; e.currentTarget.style.color = '#94a3b8' }
      }}
      onMouseLeave={(e) => {
        if (isIndigo) e.currentTarget.style.background = active ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)'
        else { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#64748b' }
      }}
    >
      {icon} {label}
    </button>
  )
}
