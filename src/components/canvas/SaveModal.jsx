import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, X, Check, FileJson, Upload, Sparkles, AlertCircle } from 'lucide-react'

/* ─── Save Roadmap Modal ────────────────────────────────────────── */
export function SaveModal({ defaultTitle, onSave, onCancel, isSaving }) {
  const [title, setTitle] = useState(defaultTitle || '')
  const [summary, setSummary] = useState('')
  const [saved, setSaved] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [])

  const handleSave = () => {
    if (!title.trim()) { inputRef.current?.focus(); return }
    setSaved(true)
    setTimeout(() => onSave({ title: title.trim(), summary: summary.trim() }), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          width: 440, maxWidth: '95vw',
          borderRadius: 22,
          background: 'rgba(4,7,14,0.99)',
          border: '1px solid rgba(30,41,59,0.8)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.025) inset',
          overflow: 'hidden', fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 22px 0',
          background: 'rgba(15,23,42,0.3)',
          borderBottom: '1px solid rgba(30,41,59,0.45)',
          paddingBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
                border: '1px solid rgba(52,211,153,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Save size={16} color="#34d399" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>
                  Save Roadmap
                </h2>
                <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                  Give your roadmap a name to save it
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              style={{
                width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(30,41,59,0.6)',
                background: 'rgba(15,23,42,0.5)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)' }}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Roadmap Title *
            </label>
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Full Stack Developer Path"
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 11,
                border: `1px solid ${title ? 'rgba(99,102,241,0.4)' : 'rgba(30,41,59,0.7)'}`,
                background: 'rgba(8,12,22,0.7)', color: '#f1f5f9', fontSize: 13,
                outline: 'none', fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={(e) => { e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Summary (optional)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of this learning path..."
              rows={2}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 11,
                border: '1px solid rgba(30,41,59,0.7)',
                background: 'rgba(8,12,22,0.7)', color: '#cbd5e1', fontSize: 12,
                outline: 'none', fontFamily: "'Inter', sans-serif",
                resize: 'vertical', lineHeight: 1.6,
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(30,41,59,0.7)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px 20px',
          borderTop: '1px solid rgba(30,41,59,0.45)',
          background: 'rgba(5,8,16,0.5)',
          display: 'flex', gap: 10,
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '11px 20px', borderRadius: 11,
              border: '1px solid rgba(30,41,59,0.7)', background: 'rgba(15,23,42,0.5)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#475569',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
          >
            Cancel
          </button>
          <motion.button
            whileHover={!saved ? { scale: 1.01 } : {}}
            whileTap={!saved ? { scale: 0.99 } : {}}
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 11, border: 'none',
              background: saved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : title.trim()
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(30,41,59,0.5)',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 700,
              color: title.trim() ? 'white' : '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: title.trim() && !saved ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
              transition: 'all 0.25s',
            }}
          >
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={14} /> Save Roadmap</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Import JSON Modal ─────────────────────────────────────────── */
export function ImportModal({ onImport, onCancel }) {
  const fileInputRef = useRef()
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const parseFile = (file) => {
    if (!file || !file.name.endsWith('.json')) {
      setError('Please select a .json file'); return
    }
    setFileName(file.name)
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data.nodes || !data.edges) {
          setError('Invalid roadmap file — must contain nodes and edges arrays')
          return
        }
        onImport(data)
      } catch {
        setError('Could not parse JSON — ensure the file is valid')
      }
    }
    reader.readAsText(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          width: 420, maxWidth: '95vw', borderRadius: 22,
          background: 'rgba(4,7,14,0.99)',
          border: '1px solid rgba(30,41,59,0.8)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.75)',
          overflow: 'hidden', fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 22px 18px', borderBottom: '1px solid rgba(30,41,59,0.45)', background: 'rgba(15,23,42,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Upload size={16} color="#38bdf8" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Import Roadmap</h2>
                <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Load a saved .json roadmap file</p>
              </div>
            </div>
            <button onClick={onCancel} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(30,41,59,0.6)', background: 'rgba(15,23,42,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569' }}
            ><X size={13} /></button>
          </div>
        </div>

        {/* Drop zone */}
        <div style={{ padding: '20px 22px 22px' }}>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }}
            onChange={(e) => { parseFile(e.target.files?.[0]); e.target.value = '' }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); parseFile(e.dataTransfer.files?.[0]) }}
            style={{
              padding: '40px 20px', borderRadius: 14, cursor: 'pointer',
              border: `2px dashed ${dragOver ? 'rgba(99,102,241,0.5)' : error ? 'rgba(239,68,68,0.3)' : 'rgba(30,41,59,0.6)'}`,
              background: dragOver ? 'rgba(99,102,241,0.06)' : 'rgba(8,12,22,0.5)',
              textAlign: 'center', transition: 'all 0.18s',
            }}
          >
            <FileJson size={36} color={dragOver ? '#818cf8' : '#334155'} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: dragOver ? '#818cf8' : '#475569', marginBottom: 6 }}>
              {fileName ? `✓ ${fileName}` : 'Drop your .json file here'}
            </p>
            <p style={{ fontSize: 11, color: '#334155' }}>or click to browse</p>
          </div>

          {error && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={13} color="#f87171" />
              <p style={{ fontSize: 12, color: '#f87171', margin: 0 }}>{error}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
