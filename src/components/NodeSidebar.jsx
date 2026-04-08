import { useState, useEffect } from 'react'

export default function NodeSidebar({ node, onClose, onUpdateNode }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (node) {
      setTitle(node.data?.title || '')
      setDescription(node.data?.description || '')
      setIsEditing(false)
    }
  }, [node])

  if (!node) return null

  const handleSave = () => {
    onUpdateNode(node.id, { title, description })
    setIsEditing(false)
  }

  return (
    <div style={{
      position: 'fixed', right: 0, top: 54, height: 'calc(100vh - 54px)',
      width: 320, background: '#0f172a', borderLeft: '1px solid #1e293b',
      display: 'flex', flexDirection: 'column', zIndex: 50,
      boxShadow: '-4px 0 12px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #1e293b',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: 16, fontWeight: 700 }}>
          Node Details
        </h3>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#64748b',
          fontSize: 20, cursor: 'pointer', padding: 0,
          transition: 'color 0.2s',
        }} onMouseEnter={(e) => e.target.style.color = '#e2e8f0'}
           onMouseLeave={(e) => e.target.style.color = '#64748b'}>
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditing}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 14,
              background: isEditing ? '#1e293b' : '#0a1120',
              border: `1px solid ${isEditing ? '#4f46e5' : '#334155'}`,
              borderRadius: 8, color: '#e2e8f0',
              fontWeight: 600, cursor: isEditing ? 'text' : 'default',
              transition: 'all 0.2s',
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 14,
              background: isEditing ? '#1e293b' : '#0a1120',
              border: `1px solid ${isEditing ? '#4f46e5' : '#334155'}`,
              borderRadius: 8, color: '#e2e8f0',
              minHeight: 120, resize: 'vertical', fontFamily: 'inherit',
              cursor: isEditing ? 'text' : 'default',
              transition: 'all 0.2s',
            }}
          />
        </div>

        {/* Status Badge */}
        <div style={{
          padding: '12px 14px', background: '#1e293b', borderRadius: 8,
          border: '1px solid #334155', color: '#94a3b8', fontSize: 12,
        }}>
          <strong>Status:</strong> {node.data?.status || 'Pending'}
        </div>
      </div>

      {/* Footer with buttons */}
      <div style={{
        padding: '16px 20px', borderTop: '1px solid #1e293b',
        display: 'flex', gap: 8,
      }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{
            flex: 1, padding: '10px 14px', background: '#4f46e5',
            color: '#fff', border: 'none', borderRadius: 8,
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }} onMouseEnter={(e) => e.target.style.background = '#5f4ae6'}
             onMouseLeave={(e) => e.target.style.background = '#4f46e5'}>
            ✏️ Edit
          </button>
        ) : (
          <>
            <button onClick={handleSave} style={{
              flex: 1, padding: '10px 14px', background: '#34d399',
              color: '#0f172a', border: 'none', borderRadius: 8,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.2s',
            }} onMouseEnter={(e) => e.target.style.background = '#24d589'}
               onMouseLeave={(e) => e.target.style.background = '#34d399'}>
              ✓ Save
            </button>
            <button onClick={() => setIsEditing(false)} style={{
              flex: 1, padding: '10px 14px', background: '#1e293b',
              color: '#94a3b8', border: '1px solid #334155', borderRadius: 8,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.2s',
            }} onMouseEnter={(e) => {
              e.target.style.background = '#263248'
              e.target.style.borderColor = '#475569'
            }}
               onMouseLeave={(e) => {
                 e.target.style.background = '#1e293b'
                 e.target.style.borderColor = '#334155'
               }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}