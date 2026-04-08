import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function AddSkillModal({ onClose, parentId = null }) {
  const nodes = useStore((s) => s.nodes)
  const addSkillNode = useStore((s) => s.addSkillNode)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState([{ label: '', url: '' }])
  const [selectedParent, setSelectedParent] = useState(parentId || '')

  const addLink = () => setLinks([...links, { label: '', url: '' }])
  const updateLink = (i, field, value) => {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i))

  const handleSave = () => {
    if (!title.trim()) return alert('Please add a skill title!')
    addSkillNode(
      { title, description, links: links.filter((l) => l.url) },
      selectedParent || null
    )
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 20, padding: 28,
        width: 480, maxWidth: '92vw',
        boxShadow: '0 0 60px rgba(99,102,241,0.25)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 700, margin: 0 }}>
              ✨ New Skill Node
            </h2>
            <p style={{ color: '#475569', fontSize: 12, margin: '4px 0 0' }}>
              Add a skill to your learning tree
            </p>
          </div>
          <button onClick={onClose} style={{
            background: '#1e293b', border: '1px solid #334155',
            color: '#64748b', borderRadius: 8, width: 32, height: 32,
            cursor: 'pointer', fontSize: 16,
          }}>✕</button>
        </div>

        {/* Parent selector */}
        {nodes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              🌿 CONNECT AS CHILD OF
            </label>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              style={{
                width: '100%', background: '#1e293b',
                border: '1px solid #334155', borderRadius: 10,
                padding: '10px 14px', color: '#e2e8f0',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value=''>— None (Root node) —</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.data.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            SKILL TITLE *
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="e.g. React Hooks, CSS Grid, Node.js..."
            style={{
              width: '100%', background: '#1e293b',
              border: '1px solid #334155', borderRadius: 10,
              padding: '10px 14px', color: '#e2e8f0',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will you learn? What are the key concepts?"
            rows={3}
            style={{
              width: '100%', background: '#1e293b',
              border: '1px solid #334155', borderRadius: 10,
              padding: '10px 14px', color: '#e2e8f0',
              fontSize: 14, outline: 'none', resize: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Links */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>
            📚 STUDY RESOURCES
          </label>
          {links.map((link, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                value={link.label}
                onChange={(e) => updateLink(i, 'label', e.target.value)}
                placeholder="Label"
                style={{
                  width: '35%', background: '#1e293b',
                  border: '1px solid #334155', borderRadius: 8,
                  padding: '8px 12px', color: '#e2e8f0',
                  fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, 'url', e.target.value)}
                placeholder="https://..."
                style={{
                  flex: 1, background: '#1e293b',
                  border: '1px solid #334155', borderRadius: 8,
                  padding: '8px 12px', color: '#e2e8f0',
                  fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button onClick={() => removeLink(i)} style={{
                background: '#1e293b', border: '1px solid #334155',
                color: '#f87171', borderRadius: 8,
                padding: '0 10px', cursor: 'pointer', fontSize: 18,
              }}>×</button>
            </div>
          ))}
          <button onClick={addLink} style={{
            background: 'none', border: '1px dashed #334155',
            color: '#6366f1', borderRadius: 8,
            padding: '7px 14px', fontSize: 13,
            cursor: 'pointer', width: '100%',
          }}>
            + Add resource link
          </button>
        </div>

        {/* Save */}
        <button onClick={handleSave} style={{
          width: '100%',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#fff', border: 'none', borderRadius: 12,
          padding: '13px', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        }}>
          Add to Tree ✨
        </button>
      </div>
    </div>
  )
}