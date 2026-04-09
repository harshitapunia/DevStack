import { useEffect, useMemo, useState, lazy, Suspense, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from './store/useAuthStore'
import { useStore } from './store/useStore'
import {
  fetchRoadmaps, upsertRoadmap, deleteRoadmap as deleteRoadmapApi,
  isSupabaseConfigured,
} from './lib/supabase'
import { PRESET_ROADMAPS } from './data/presets'
import { SaveModal } from './components/canvas/SaveModal'

// ─── Lazy pages ──────────────────────────────────────────────────
const LandingPage    = lazy(() => import('./components/landing/LandingPage'))
const AuthPage       = lazy(() => import('./components/auth/AuthPage'))
const RoadmapLibrary = lazy(() => import('./components/library/RoadmapLibrary'))
const FlowCanvas     = lazy(() => import('./components/canvas/FlowCanvas'))

// ─── Loading screen ──────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#050810' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.2)',
          borderTop: '2px solid #6366f1',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: 13, color: '#475569', fontFamily: "'Inter', sans-serif" }}>Loading DevStakes...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── Protected Route ─────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (!isSupabaseConfigured) return children
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth" replace />
  return children
}

// ─── Helpers ─────────────────────────────────────────────────────
const cloneData = (v) => {
  try {
    if (typeof structuredClone === 'function') return structuredClone(v)
    return JSON.parse(JSON.stringify(v))
  } catch { return v }
}

const buildStats = (nodes) => {
  const total     = nodes.length
  const completed = nodes.filter((n) => n.data?.status === 'completed').length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, percentage }
}

const STORAGE_KEY = 'devstakes_roadmap_library'
const loadLocal   = () => { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : [] } catch { return [] } }
const saveLocal   = (list) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch {} }

// ─── Inner App ───────────────────────────────────────────────────
function AppRoutes() {
  const { user, loading: authLoading, initialize } = useAuthStore()
  const replaceGraph = useStore((s) => s.replaceGraph)
  const storeNodes   = useStore((s) => s.nodes)
  const storeEdges   = useStore((s) => s.edges)

  const [roadmaps, setRoadmaps]           = useState([])
  const [activeRoadmapId, setActiveRoadmapId] = useState(null)
  const [syncing, setSyncing]             = useState(false)
  const [saveModal, setSaveModal]         = useState(null)  // { nodes, edges, stats, nav }

  useEffect(() => { initialize() }, [initialize])

  // Load roadmpas (Supabase or local)
  useEffect(() => {
    if (!isSupabaseConfigured) { setRoadmaps(loadLocal()); return }
    if (!user) { setRoadmaps([]); return }
    setSyncing(true)
    fetchRoadmaps(user.id).then(({ data }) => {
      setRoadmaps(data || []); setSyncing(false)
    })
  }, [user])

  const activeRoadmap = useMemo(
    () => roadmaps.find((r) => r.id === activeRoadmapId) || null,
    [roadmaps, activeRoadmapId]
  )

  // ── Library callbacks ─────────────────────────────────────────
  const openRoadmap = useCallback((id, nav) => {
    const target = roadmaps.find((r) => r.id === id)
    if (!target) return
    replaceGraph({ nodes: cloneData(target.nodes || []), edges: cloneData(target.edges || []) })
    setActiveRoadmapId(id)
    nav('/editor')
  }, [roadmaps, replaceGraph])

  const createRoadmap = useCallback((nav) => {
    replaceGraph({ nodes: [], edges: [] })
    setActiveRoadmapId(null)
    nav('/editor')
  }, [replaceGraph])

  const loadPreset = useCallback((preset, nav) => {
    replaceGraph({ nodes: cloneData(preset.nodes), edges: cloneData(preset.edges) })
    setActiveRoadmapId(null)
    nav('/editor')
  }, [replaceGraph])

  const importJson = useCallback((data, nav) => {
    if (!data?.nodes || !data?.edges) return
    replaceGraph({ nodes: cloneData(data.nodes), edges: cloneData(data.edges) })
    setActiveRoadmapId(null)
    nav('/editor')
  }, [replaceGraph])

  const handleDeleteRoadmap = useCallback(async (id) => {
    if (isSupabaseConfigured) { await deleteRoadmapApi(id) }
    setRoadmaps((prev) => {
      const next = prev.filter((r) => r.id !== id)
      if (!isSupabaseConfigured) saveLocal(next)
      return next
    })
  }, [])

  // ── Save from canvas — opens SaveModal (no window.prompt) ─────
  const saveRoadmapFromCanvas = useCallback(({ nodes, edges, stats }, nav) => {
    if (nodes.length === 0) {
      // Nothing to save — show a brief notification instead of a modal
      alert('Add some skill nodes before saving your roadmap.')
      return
    }
    const existing = roadmaps.find((r) => r.id === activeRoadmapId)
    setSaveModal({ nodes, edges, stats, nav, defaultTitle: existing?.title || '' })
  }, [roadmaps, activeRoadmapId])

  const handleSaveConfirm = useCallback(async ({ title, summary }) => {
    if (!saveModal) return
    const { nodes, edges, stats, nav } = saveModal
    setSaveModal(null)

    const existing        = roadmaps.find((r) => r.id === activeRoadmapId)
    const normalizedStats = stats || buildStats(nodes)
    const now             = new Date().toISOString()

    if (isSupabaseConfigured && user) {
      const roadmapData = {
        ...(existing?.id ? { id: existing.id } : {}),
        user_id: user.id, title,
        summary: summary || existing?.summary || 'Custom roadmap created in DevStakes.',
        nodes: cloneData(nodes), edges: cloneData(edges),
        stats: { total: normalizedStats.total, completed: normalizedStats.completed, percentage: normalizedStats.percentage },
      }
      const { data: saved, error } = await upsertRoadmap(roadmapData)
      if (error) { alert('Failed to save roadmap.'); return }
      if (saved) {
        setRoadmaps((prev) => {
          const idx = prev.findIndex((r) => r.id === saved.id)
          if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next }
          return [saved, ...prev]
        })
        setActiveRoadmapId(saved.id)
      }
    } else {
      // Offline localStorage mode
      const roadmapId = existing?.id || `roadmap_${Date.now()}`
      const localRoadmap = {
        id: roadmapId, title,
        summary: summary || existing?.summary || 'Custom roadmap created in DevStakes.',
        nodes: cloneData(nodes), edges: cloneData(edges),
        stats: { total: normalizedStats.total, completed: normalizedStats.completed, percentage: normalizedStats.percentage },
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      }
      setRoadmaps((prev) => {
        const next = existing
          ? prev.map((r) => (r.id === roadmapId ? localRoadmap : r))
          : [localRoadmap, ...prev]
        saveLocal(next)
        return next
      })
      setActiveRoadmapId(roadmapId)
    }

    nav('/library')
  }, [saveModal, roadmaps, activeRoadmapId, user])

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/"     element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/library" element={
            <ProtectedRoute>
              <LibraryWrapper
                roadmaps={roadmaps}
                onCreateRoadmap={createRoadmap}
                onOpenRoadmap={openRoadmap}
                onDeleteRoadmap={handleDeleteRoadmap}
                onLoadPreset={loadPreset}
                onImportJson={importJson}
              />
            </ProtectedRoute>
          } />

          <Route path="/editor" element={
            <ProtectedRoute>
              <EditorWrapper
                onSaveRoadmap={saveRoadmapFromCanvas}
                activeRoadmapTitle={activeRoadmap?.title || null}
              />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* ── Save Modal (global) ─────────────────────────────────── */}
      <AnimatePresence>
        {saveModal && (
          <SaveModal
            defaultTitle={saveModal.defaultTitle}
            onSave={handleSaveConfirm}
            onCancel={() => setSaveModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Wrappers ────────────────────────────────────────────────────
function LibraryWrapper({ roadmaps, onCreateRoadmap, onOpenRoadmap, onDeleteRoadmap, onLoadPreset, onImportJson }) {
  const nav = useNavigate()
  return (
    <RoadmapLibrary
      roadmaps={roadmaps}
      onCreateRoadmap={() => onCreateRoadmap(nav)}
      onOpenRoadmap={(id) => onOpenRoadmap(id, nav)}
      onDeleteRoadmap={onDeleteRoadmap}
      onLoadPreset={(preset) => onLoadPreset(preset, nav)}
      onImportJson={(data) => onImportJson(data, nav)}
    />
  )
}

function EditorWrapper({ onSaveRoadmap, activeRoadmapTitle }) {
  const nav = useNavigate()
  return (
    <FlowCanvas
      onSaveRoadmap={(payload) => onSaveRoadmap(payload, nav)}
      onBackToLibrary={() => nav('/library')}
      activeRoadmapTitle={activeRoadmapTitle}
    />
  )
}

// ─── Root ────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}