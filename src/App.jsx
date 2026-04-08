import { useMemo, useState } from 'react'
import FlowCanvas from './components/FlowCanvas'
import RoadmapLibrary from './components/RoadmapLibrary'
import { useStore } from './store/useStore'
import 'reactflow/dist/style.css'

const ROADMAP_LIBRARY_KEY = 'devstakes_roadmap_library'

const cloneData = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

const buildStats = (nodes) => {
  const total = nodes.length
  const completed = nodes.filter((node) => node.data?.status === 'completed').length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, percentage }
}

const loadLibrary = () => {
  try {
    const raw = localStorage.getItem(ROADMAP_LIBRARY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []

    return parsed.map((roadmap) => ({
      ...roadmap,
      stats: roadmap.stats || buildStats(roadmap.nodes || []),
    }))
  } catch {
    return []
  }
}

const saveLibrary = (roadmaps) => {
  try {
    localStorage.setItem(ROADMAP_LIBRARY_KEY, JSON.stringify(roadmaps))
  } catch {}
}

export default function App() {
  const replaceGraph = useStore((state) => state.replaceGraph)

  const [roadmaps, setRoadmaps] = useState(() => loadLibrary())
  const [view, setView] = useState('library')
  const [activeRoadmapId, setActiveRoadmapId] = useState(null)

  const activeRoadmap = useMemo(
    () => roadmaps.find((roadmap) => roadmap.id === activeRoadmapId) || null,
    [roadmaps, activeRoadmapId]
  )

  const openRoadmap = (roadmapId) => {
    const targetRoadmap = roadmaps.find((roadmap) => roadmap.id === roadmapId)
    if (!targetRoadmap) return

    replaceGraph({
      nodes: cloneData(targetRoadmap.nodes || []),
      edges: cloneData(targetRoadmap.edges || []),
    })

    setActiveRoadmapId(targetRoadmap.id)
    setView('editor')
  }

  const createRoadmap = () => {
    replaceGraph({ nodes: [], edges: [] })
    setActiveRoadmapId(null)
    setView('editor')
  }

  const saveRoadmapFromCanvas = ({ nodes, edges, stats }) => {
    const existing = roadmaps.find((roadmap) => roadmap.id === activeRoadmapId)
    const fallbackTitle = existing?.title || nodes[0]?.data?.title || `Roadmap ${roadmaps.length + 1}`
    const typedTitle = window.prompt('Enter roadmap title', fallbackTitle)

    if (typedTitle === null) return

    const title = typedTitle.trim() || fallbackTitle
    const now = new Date().toISOString()
    const roadmapId = existing?.id || `roadmap_${Date.now()}`
    const normalizedStats = stats || buildStats(nodes)

    const nextRoadmap = {
      id: roadmapId,
      title,
      summary: existing?.summary || 'Custom roadmap created in DevStakes.',
      nodes: cloneData(nodes),
      edges: cloneData(edges),
      stats: {
        total: normalizedStats.total,
        completed: normalizedStats.completed,
        percentage: normalizedStats.percentage,
      },
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    setRoadmaps((previousRoadmaps) => {
      const nextRoadmaps = existing
        ? previousRoadmaps.map((roadmap) => (roadmap.id === roadmapId ? nextRoadmap : roadmap))
        : [nextRoadmap, ...previousRoadmaps]

      saveLibrary(nextRoadmaps)
      return nextRoadmaps
    })

    setActiveRoadmapId(roadmapId)
    setView('library')
  }

  if (view === 'library') {
    return (
      <RoadmapLibrary
        roadmaps={roadmaps}
        onCreateRoadmap={createRoadmap}
        onOpenRoadmap={openRoadmap}
      />
    )
  }

  return (
    <FlowCanvas
      onSaveRoadmap={saveRoadmapFromCanvas}
      onBackToLibrary={() => setView('library')}
      activeRoadmapTitle={activeRoadmap?.title || null}
    />
  )
}