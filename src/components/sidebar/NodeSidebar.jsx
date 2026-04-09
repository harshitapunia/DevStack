import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Edit3, Save, ExternalLink, Lock, Unlock,
  ChevronRight, Clock, Zap, CheckCircle2, Plus, Trash2, BookOpen,
  Globe, Server, Palette, Database, Terminal, Brain, Smartphone, Shield,
} from 'lucide-react'

const statusOptions = [
  {
    value: 'pending', label: 'Pending', icon: Clock,
    color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)',
    activeBg: 'rgba(148,163,184,0.12)',
  },
  {
    value: 'in-progress', label: 'In Progress', icon: Zap,
    color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)',
    activeBg: 'rgba(251,191,36,0.12)',
  },
  {
    value: 'completed', label: 'Completed', icon: CheckCircle2,
    color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)',
    activeBg: 'rgba(52,211,153,0.12)',
  },
]

const CAT_MAP = {
  frontend: { Icon: Globe,       color: '#818cf8', label: 'Frontend' },
  backend:  { Icon: Server,      color: '#34d399', label: 'Backend'  },
  design:   { Icon: Palette,     color: '#f472b6', label: 'Design'   },
  database: { Icon: Database,    color: '#fb923c', label: 'Database' },
  devops:   { Icon: Terminal,    color: '#38bdf8', label: 'DevOps'   },
  ai:       { Icon: Brain,       color: '#c084fc', label: 'AI / ML'  },
  mobile:   { Icon: Smartphone,  color: '#2dd4bf', label: 'Mobile'   },
  security: { Icon: Shield,      color: '#fbbf24', label: 'Security' },
  default:  { Icon: BookOpen,    color: '#94a3b8', label: 'General'  },
}

export default function NodeSidebar({ node, onClose, onUpdateNode, onUpdateStatus, onAddChild }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState([{ label: '', url: '' }])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (node) {
      setTitle(node.data?.title || node.data?.label || '')
      setDescription(node.data?.description || '')
      setLinks(node.data?.links?.length ? node.data.links : [{ label: '', url: '' }])
      setIsEditing(false)
    }
  }, [node])

  if (!node) return null

  const currentStatus = node.data?.status || 'pending'
  const isLocked = !node.data?.unlocked
  const currentStatusObj = statusOptions.find((s) => s.value === currentStatus)

  const handleCancel = () => {
    setTitle(node.data?.title || node.data?.label || '')
    setDescription(node.data?.description || '')
    setLinks(node.data?.links?.length ? node.data.links : [{ label: '', url: '' }])
    setIsEditing(false)
  }

  const updateLink = (i, field, val) => setLinks((p) => p.map((l, idx) => idx === i ? { ...l, [field]: val } : l))
  const addLink = () => setLinks((p) => [...p, { label: '', url: '' }])
  const removeLink = (i) => setLinks((p) => p.filter((_, idx) => idx !== i))

  const handleSave = () => {
    onUpdateNode(node.id, {
      title, label: title, description,
      links: links.filter((l) => l.url?.trim() || l.label?.trim()),
    })
    setIsEditing(false)
  }

  return (
    <AnimatePresence>
      <motion.aside
        key="sidebar"
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        style={{
          position: 'fixed', right: 0, top: 56, zIndex: 50,
          height: 'calc(100vh - 56px)',
          width: 340,
          maxWidth: '90vw',
          display: 'flex', flexDirection: 'column',
          background: 'rgba(5, 8, 16, 0.98)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(30,41,59,0.5)',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.55)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid rgba(30,41,59,0.45)',
          background: 'rgba(15,23,42,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: currentStatusObj?.color,
                  boxShadow: `0 0 6px ${currentStatusObj?.color}`,
                }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Skill Details
                </p>
              </div>
              <p style={{
                fontSize: 14, fontWeight: 700, color: '#e2e8f0',
                letterSpacing: '-0.01em', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {title || 'New Skill'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                border: '1px solid rgba(30,41,59,0.6)',
                background: 'rgba(15,23,42,0.5)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#475569', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)'; e.currentTarget.style.color = '#475569' }}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
          {/* Lock / Status badges + category */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 8,
              fontSize: 10, fontWeight: 700,
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(30,41,59,0.6)',
              color: isLocked ? '#64748b' : '#34d399',
            }}>
              {isLocked ? <Lock size={10} /> : <Unlock size={10} />}
              {isLocked ? 'Locked' : 'Unlocked'}
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 8,
              fontSize: 10, fontWeight: 700,
              background: currentStatusObj?.bg,
              border: `1px solid ${currentStatusObj?.border}`,
              color: currentStatusObj?.color,
            }}>
              {currentStatusObj?.label}
            </span>
            {(() => {
              const catKey = node.data?.category || 'default'
              const catCfg = CAT_MAP[catKey] || CAT_MAP.default
              return (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 8,
                  fontSize: 10, fontWeight: 700,
                  background: `${catCfg.color}12`,
                  border: `1px solid ${catCfg.color}28`,
                  color: catCfg.color,
                }}>
                  <catCfg.Icon size={10} />
                  {catCfg.label}
                </span>
              )
            })()}
          </div>

          {/* Status Controls */}
          <SectionBlock title="Progress Status">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {statusOptions.map((s) => {
                const isActive = currentStatus === s.value
                const isDisabled = isLocked && s.value !== 'pending'
                const StatusIcon = s.icon
                return (
                  <button
                    key={s.value}
                    onClick={() => !isDisabled && onUpdateStatus(node.id, s.value)}
                    disabled={isDisabled}
                    style={{
                      padding: '9px 6px',
                      borderRadius: 10,
                      border: `1px solid ${isActive ? s.color + '50' : 'rgba(30,41,59,0.5)'}`,
                      background: isActive ? s.activeBg : 'rgba(15,23,42,0.4)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      opacity: isDisabled ? 0.25 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    <StatusIcon
                      size={14}
                      style={{ color: isActive ? s.color : '#475569' }}
                    />
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: isActive ? s.color : '#475569', letterSpacing: '0.04em' }}>
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {isLocked && (
              <div style={{
                marginTop: 10, padding: '10px 12px', borderRadius: 9,
                background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)',
              }}>
                <p style={{ fontSize: 11, color: '#d97706', lineHeight: 1.55 }}>
                  ⚠ Complete all prerequisite skills first to unlock this node.
                </p>
              </div>
            )}
          </SectionBlock>

          {/* Title Field */}
          <SectionBlock title="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditing}
              style={{
                width: '100%', padding: '10px 13px',
                borderRadius: 9, border: '1px solid rgba(30,41,59,0.7)',
                background: isEditing ? 'rgba(15,23,42,0.7)' : 'rgba(15,23,42,0.3)',
                color: '#f1f5f9', fontSize: 13, fontWeight: 600,
                outline: 'none', transition: 'all 0.2s',
                cursor: isEditing ? 'text' : 'default',
                opacity: isEditing ? 1 : 0.8,
                fontFamily: 'inherit',
              }}
            />
          </SectionBlock>

          {/* Description Field */}
          <SectionBlock title="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder={isEditing ? 'Describe what you will learn...' : 'No description'}
              style={{
                width: '100%', padding: '10px 13px',
                borderRadius: 9, border: '1px solid rgba(30,41,59,0.7)',
                background: isEditing ? 'rgba(15,23,42,0.7)' : 'rgba(15,23,42,0.3)',
                color: '#cbd5e1', fontSize: 12, lineHeight: 1.65,
                outline: 'none', transition: 'all 0.2s', resize: 'vertical',
                cursor: isEditing ? 'text' : 'default',
                opacity: isEditing ? 1 : description ? 0.85 : 0.4,
                fontFamily: 'inherit',
              }}
            />
          </SectionBlock>

          {/* Resources */}
          <SectionBlock title="Resources" icon={<BookOpen size={10} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {links.map((link, i) => (
                <div key={`${i}-${link.url}`}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        value={link.label || ''}
                        onChange={(e) => updateLink(i, 'label', e.target.value)}
                        placeholder="Label"
                        style={{
                          width: '36%', padding: '8px 10px',
                          borderRadius: 8, border: '1px solid rgba(30,41,59,0.7)',
                          background: 'rgba(15,23,42,0.6)', color: '#f1f5f9',
                          fontSize: 11, outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                      <input
                        value={link.url || ''}
                        onChange={(e) => updateLink(i, 'url', e.target.value)}
                        placeholder="https://..."
                        style={{
                          flex: 1, padding: '8px 10px',
                          borderRadius: 8, border: '1px solid rgba(30,41,59,0.7)',
                          background: 'rgba(15,23,42,0.6)', color: '#f1f5f9',
                          fontSize: 11, outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                      <button
                        onClick={() => removeLink(i)}
                        style={{
                          flexShrink: 0, width: 28, height: 28, borderRadius: 6,
                          background: 'none', border: '1px solid rgba(30,41,59,0.6)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#475569', transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)' }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ) : (
                    link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 12px', borderRadius: 8,
                          border: '1px solid rgba(30,41,59,0.5)',
                          background: 'rgba(15,23,42,0.4)',
                          textDecoration: 'none',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.5)'; e.currentTarget.style.background = 'rgba(15,23,42,0.4)' }}
                      >
                        <ExternalLink size={11} color="#6366f1" style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 11, color: '#818cf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {link.label || link.url}
                        </span>
                        <ChevronRight size={11} color="#334155" style={{ flexShrink: 0 }} />
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <button
                onClick={addLink}
                style={{
                  marginTop: 8, width: '100%',
                  padding: '8px 0',
                  borderRadius: 8, border: '1px dashed rgba(99,102,241,0.3)',
                  background: 'rgba(99,102,241,0.04)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
              >
                <Plus size={11} /> Add link
              </button>
            )}

            {!isEditing && links.every((l) => !l.url) && (
              <p style={{ fontSize: 11, color: '#334155', fontStyle: 'italic' }}>No resources added yet.</p>
            )}
          </SectionBlock>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 18px 18px',
          borderTop: '1px solid rgba(30,41,59,0.45)',
          background: 'rgba(5,8,16,0.5)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {/* Quick add child */}
          {onAddChild && (
            <button
              onClick={() => { onAddChild(node.id); onClose() }}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 10,
                border: '1px solid rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.06)',
                cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#818cf8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
            >
              <Plus size={13} /> Add Child Skill
            </button>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsEditing(true)}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 11, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                }}
              >
                <Edit3 size={14} /> Edit Skill
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSave}
                  style={{
                    flex: 2, padding: '11px 0', borderRadius: 11, border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
                  }}
                >
                  <Save size={13} /> Save Changes
                </motion.button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1, padding: '11px 0', borderRadius: 11,
                    border: '1px solid rgba(30,41,59,0.7)',
                    background: 'rgba(15,23,42,0.4)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

function SectionBlock({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 8,
      }}>
        {icon && <span style={{ color: '#334155' }}>{icon}</span>}
        <label style={{
          fontSize: 10, fontWeight: 700, color: '#475569',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {title}
        </label>
      </div>
      {children}
    </div>
  )
}
