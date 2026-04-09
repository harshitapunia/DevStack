import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
  X, Plus, Link as LinkIcon, Sparkles, GitBranch,
  Tag, AlignLeft, BookOpen, Globe, Server, Palette,
  Database, Terminal, Brain, Smartphone, Shield, Trash2,
  ChevronRight, Check,
} from 'lucide-react'

/* ── Category config ─────────────────────────────────────────────── */
const CATS = [
  { value: 'frontend', label: 'Frontend', color: '#818cf8', Icon: Globe },
  { value: 'backend', label: 'Backend', color: '#34d399', Icon: Server },
  { value: 'design', label: 'Design', color: '#f472b6', Icon: Palette },
  { value: 'database', label: 'Database', color: '#fb923c', Icon: Database },
  { value: 'devops', label: 'DevOps', color: '#38bdf8', Icon: Terminal },
  { value: 'ai', label: 'AI / ML', color: '#c084fc', Icon: Brain },
  { value: 'mobile', label: 'Mobile', color: '#2dd4bf', Icon: Smartphone },
  { value: 'security', label: 'Security', color: '#fbbf24', Icon: Shield },
]

/* ── Styled input component ─────────────────────────────────────── */
function FieldInput({ value, onChange, placeholder, type = 'text', as = 'input', rows, autoFocus, onKeyDown, disabled }) {
  const props = {
    value, placeholder, autoFocus, onKeyDown, disabled,
    onChange: (e) => onChange(e.target.value),
    className: 'field-input',
    style: {
      width: '100%', padding: as === 'textarea' ? '12px 14px' : '11px 14px',
      borderRadius: 11,
      border: '1px solid rgba(30,41,59,0.7)',
      background: value ? 'rgba(99,102,241,0.03)' : 'rgba(8,12,22,0.6)',
      color: '#f1f5f9', fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
      fontFamily: "'Inter', sans-serif",
      resize: as === 'textarea' ? 'vertical' : undefined,
      minHeight: as === 'textarea' ? 80 : undefined,
      lineHeight: as === 'textarea' ? 1.65 : undefined,
    },
    onFocus: (e) => {
      e.target.style.borderColor = 'rgba(99,102,241,0.5)'
      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
      e.target.style.background = 'rgba(99,102,241,0.04)'
    },
    onBlur: (e) => {
      e.target.style.borderColor = value ? 'rgba(99,102,241,0.3)' : 'rgba(30,41,59,0.7)'
      e.target.style.boxShadow = 'none'
      e.target.style.background = value ? 'rgba(99,102,241,0.03)' : 'rgba(8,12,22,0.6)'
    },
  }
  if (as === 'textarea') return <textarea rows={rows || 3} {...props} />
  return <input type={type} {...props} />
}

function Label({ icon, text, required }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <span style={{ color: '#334155' }}>{icon}</span>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {text}
      </span>
      {required && <span style={{ color: '#6366f1', fontSize: 11, marginLeft: 1 }}>*</span>}
    </div>
  )
}

/* ── Live Preview Card ───────────────────────────────────────────── */
function PreviewCard({ title, category, description, linkCount }) {
  const cat = CATS.find(c => c.value === category)
  const color = cat?.color || '#6366f1'
  const CatIcon = cat?.Icon || BookOpen
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: `1.5px solid ${color}30`,
      background: 'rgba(8,12,22,0.9)',
      boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ height: 2.5, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
      <div style={{ padding: '11px 13px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${color}14`, border: `1px solid ${color}25`,
            flexShrink: 0,
          }}>
            <CatIcon size={13} style={{ color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 12, fontWeight: 800, color: title ? '#f1f5f9' : '#334155',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              letterSpacing: '-0.015em', marginBottom: 3,
            }}>
              {title || 'Skill title preview...'}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 5, fontSize: 9, fontWeight: 700,
              background: `${color}10`, color, border: `1px solid ${color}20`,
            }}>
              {cat?.label || 'General'}
            </span>
          </div>
        </div>
        {description && (
          <p style={{ fontSize: 10.5, color: '#475569', lineHeight: 1.5, marginBottom: 6,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {description}
          </p>
        )}
        {linkCount > 0 && (
          <span style={{ fontSize: 9.5, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 3 }}>
            <LinkIcon size={8} /> {linkCount} resource{linkCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

/* ── AddSkillModal ───────────────────────────────────────────────── */
export default function AddSkillModal({ onClose, parentId = null, onBeforeAdd }) {
  const nodes = useStore((s) => s.nodes)
  const addSkillNode = useStore((s) => s.addSkillNode)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [selectedParent, setSelectedParent] = useState(parentId || '')
  const [links, setLinks] = useState([])
  const [step, setStep] = useState(0) // 0=details, 1=resources
  const [saved, setSaved] = useState(false)

  const titleRef = useRef()
  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 80) }, [])

  const canNext = title.trim().length > 0

  const handleSave = () => {
    if (!canNext) return
    onBeforeAdd?.()
    addSkillNode(
      { title: title.trim(), description, links, category },
      selectedParent || null
    )
    setSaved(true)
    setTimeout(onClose, 500)
  }

  const addLink = () => setLinks(p => [...p, { label: '', url: '' }])
  const updateLink = (i, f, v) => setLinks(p => p.map((l, idx) => idx === i ? { ...l, [f]: v } : l))
  const removeLink = (i) => setLinks(p => p.filter((_, idx) => idx !== i))
  const linkCount = links.filter(l => l.url.trim()).length

  const selectedCat = CATS.find(c => c.value === category)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.93 }}
        animate={{ opacity: saved ? 0.6 : 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        style={{
          width: 640, maxWidth: '96vw',
          maxHeight: '92vh',
          borderRadius: 24,
          border: '1px solid rgba(30,41,59,0.75)',
          background: 'rgba(5, 8, 16, 0.98)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.02) inset',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '20px 22px 0',
          background: 'rgba(15,23,42,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: selectedCat ? `${selectedCat.color}18` : 'rgba(99,102,241,0.12)',
                border: `1px solid ${selectedCat ? selectedCat.color + '30' : 'rgba(99,102,241,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}>
                <Sparkles size={17} color={selectedCat?.color || '#818cf8'} />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 2 }}>
                  Create Skill Node
                </h2>
                <p style={{ fontSize: 11.5, color: '#475569' }}>
                  {step === 0 ? 'Define the skill details and category' : 'Add study resources (optional)'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(30,41,59,0.6)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#475569', transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30,41,59,0.5)'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Progress track */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
            {['Details', 'Resources'].map((s, i) => (
              <button
                key={s}
                onClick={() => { if (i === 0) setStep(0); else if (canNext) setStep(1) }}
                style={{
                  flex: 1, padding: '10px 0 12px',
                  background: 'none', border: 'none', cursor: canNext || i === 0 ? 'pointer' : 'not-allowed',
                  borderBottom: `2px solid ${step === i ? '#6366f1' : 'rgba(30,41,59,0.4)'}`,
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800,
                  background: step === i ? '#6366f1' : (i < step ? '#34d399' : 'rgba(30,41,59,0.6)'),
                  color: 'white',
                  transition: 'all 0.2s',
                }}>
                  {i < step ? <Check size={11} /> : i + 1}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: step === i ? '#818cf8' : i < step ? '#34d399' : '#334155',
                  transition: 'color 0.2s',
                }}>
                  {s}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', gap: 0 }}>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                style={{
                  flex: 1, padding: '22px 22px',
                  display: 'flex', gap: 20,
                }}
              >
                {/* Left: Form */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Title */}
                  <div>
                    <Label icon={<Tag size={11} />} text="Skill Title" required />
                    <FieldInput
                      value={title}
                      onChange={setTitle}
                      placeholder="e.g. React Hooks, TypeScript Generics, Docker..."
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter' && canNext) setStep(1) }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label icon={<AlignLeft size={11} />} text="Description" />
                    <FieldInput
                      as="textarea"
                      value={description}
                      onChange={setDescription}
                      placeholder="What will you learn? Key concepts, goals, frameworks..."
                      rows={3}
                    />
                  </div>

                  {/* Category pills */}
                  <div>
                    <Label icon={<BookOpen size={11} />} text="Category" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {CATS.map((c) => {
                        const isActive = category === c.value
                        return (
                          <button
                            key={c.value}
                            onClick={() => setCategory(isActive ? '' : c.value)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                              border: `1px solid ${isActive ? c.color + '50' : 'rgba(30,41,59,0.55)'}`,
                              background: isActive ? `${c.color}14` : 'rgba(8,12,22,0.5)',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = c.color + '35'; e.currentTarget.style.background = c.color + '0a' } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.55)'; e.currentTarget.style.background = 'rgba(8,12,22,0.5)' } }}
                          >
                            <c.Icon size={11} style={{ color: isActive ? c.color : '#334155' }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? c.color : '#475569' }}>
                              {c.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Parent node */}
                  {nodes.length > 0 && (
                    <div>
                      <Label icon={<GitBranch size={11} />} text="Connect as Child of" />
                      <select
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        style={{
                          width: '100%', padding: '11px 14px',
                          borderRadius: 11, border: '1px solid rgba(30,41,59,0.7)',
                          background: 'rgba(8,12,22,0.6)', color: selectedParent ? '#f1f5f9' : '#475569',
                          fontSize: 13, outline: 'none', cursor: 'pointer',
                          fontFamily: "'Inter', sans-serif",
                          appearance: 'none',
                        }}
                        className="field-input"
                      >
                        <option value="" style={{ background: '#0a1120' }}>— Root node (no parent) —</option>
                        {nodes.map((n) => (
                          <option key={n.id} value={n.id} style={{ background: '#0a1120' }}>
                            {n.data.title || n.data.label}
                            {n.data.status === 'completed' ? ' ✓' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Right: Live preview */}
                <div style={{ width: 190, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Preview
                  </p>
                  <PreviewCard
                    title={title}
                    category={category}
                    description={description}
                    linkCount={linkCount}
                  />
                  {!title && (
                    <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.55, marginTop: 4 }}>
                      Start typing a skill name to see it come to life →
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                style={{ flex: 1, padding: '22px 22px', display: 'flex', gap: 20 }}
              >
                {/* Left: Links form */}
                <div style={{ flex: 1 }}>
                  <Label icon={<LinkIcon size={11} />} text="Study Resources" />
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.55 }}>
                    Attach documentation, tutorials, or course links to this skill node.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {links.length === 0 && (
                      <div style={{
                        padding: '24px 16px', borderRadius: 12,
                        border: '1px dashed rgba(30,41,59,0.5)',
                        background: 'rgba(8,12,22,0.4)',
                        textAlign: 'center',
                      }}>
                        <LinkIcon size={22} color="#1e293b" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 12, color: '#334155' }}>No resources yet</p>
                        <p style={{ fontSize: 11, color: '#1e293b', marginTop: 4 }}>Click "Add resource" to attach links</p>
                      </div>
                    )}
                    <AnimatePresence>
                      {links.map((link, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          style={{
                            borderRadius: 12, border: '1px solid rgba(30,41,59,0.6)',
                            background: 'rgba(8,12,22,0.5)',
                            padding: '12px 12px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <input
                              value={link.label}
                              onChange={(e) => updateLink(i, 'label', e.target.value)}
                              placeholder="Label (e.g. MDN Docs)"
                              className="field-input"
                              style={{
                                flex: 1, padding: '9px 12px', borderRadius: 9,
                                border: '1px solid rgba(30,41,59,0.6)',
                                background: 'rgba(5,8,16,0.6)', color: '#f1f5f9',
                                fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif",
                              }}
                            />
                            <button
                              onClick={() => removeLink(i)}
                              style={{
                                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                                border: '1px solid rgba(30,41,59,0.5)',
                                background: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#334155', transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = '#f87171' }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.5)'; e.currentTarget.style.color = '#334155' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <input
                            value={link.url}
                            onChange={(e) => updateLink(i, 'url', e.target.value)}
                            placeholder="https://..."
                            type="url"
                            className="field-input"
                            style={{
                              width: '100%', padding: '9px 12px', borderRadius: 9,
                              border: '1px solid rgba(30,41,59,0.6)',
                              background: 'rgba(5,8,16,0.6)', color: '#f1f5f9',
                              fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif",
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={addLink}
                    style={{
                      marginTop: 10, width: '100%', padding: '11px 0',
                      borderRadius: 11, border: '1px dashed rgba(99,102,241,0.3)',
                      background: 'rgba(99,102,241,0.03)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#6366f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.03)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
                  >
                    <Plus size={13} /> Add resource link
                  </button>
                </div>

                {/* Right: Preview */}
                <div style={{ width: 190, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Preview
                  </p>
                  <PreviewCard
                    title={title}
                    category={category}
                    description={description}
                    linkCount={linkCount}
                  />
                  {linkCount > 0 && (
                    <div style={{
                      padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(52,211,153,0.2)',
                      background: 'rgba(52,211,153,0.05)',
                    }}>
                      <p style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                        ✓ {linkCount} resource{linkCount !== 1 ? 's' : ''} added
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '14px 22px 18px',
          borderTop: '1px solid rgba(30,41,59,0.45)',
          background: 'rgba(5,8,16,0.5)',
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          {step === 0 ? (
            <>
              <button
                onClick={onClose}
                style={{
                  padding: '11px 20px', borderRadius: 12,
                  border: '1px solid rgba(30,41,59,0.6)',
                  background: 'rgba(8,12,22,0.5)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#475569',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
              >
                Cancel
              </button>

              {/* Quick create (skip resources) */}
              <button
                onClick={canNext ? handleSave : undefined}
                disabled={!canNext}
                style={{
                  padding: '11px 20px', borderRadius: 12,
                  border: `1px solid ${canNext ? 'rgba(52,211,153,0.3)' : 'rgba(30,41,59,0.4)'}`,
                  background: canNext ? 'rgba(52,211,153,0.07)' : 'rgba(8,12,22,0.3)',
                  cursor: canNext ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 600,
                  color: canNext ? '#34d399' : '#334155',
                  transition: 'all 0.15s',
                }}
                title="Create without adding resources"
              >
                Quick Create
              </button>

              <motion.button
                whileHover={canNext ? { scale: 1.01 } : {}}
                whileTap={canNext ? { scale: 0.99 } : {}}
                onClick={() => canNext && setStep(1)}
                disabled={!canNext}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, border: 'none',
                  background: canNext ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30,41,59,0.5)',
                  cursor: canNext ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 700, color: canNext ? 'white' : '#334155',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: canNext ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                Add Resources <ChevronRight size={15} />
              </motion.button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(0)}
                style={{
                  padding: '11px 20px', borderRadius: 12,
                  border: '1px solid rgba(30,41,59,0.6)',
                  background: 'rgba(8,12,22,0.5)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#475569',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
              >
                ← Back
              </button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 12, border: 'none',
                  background: saved
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  cursor: 'pointer',
                  fontSize: 14, fontWeight: 800, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: saved ? '0 4px 16px rgba(16,185,129,0.3)' : '0 4px 16px rgba(99,102,241,0.35)',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.25s',
                }}
              >
                {saved ? (
                  <><Check size={16} /> Created!</>
                ) : (
                  <><Sparkles size={14} /> Create Skill Node</>
                )}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
