import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import SkillNode from '../nodes/SkillNode'
import AddSkillModal from '../sidebar/AddSkillModal'
import NodeSidebar from '../sidebar/NodeSidebar'
import CanvasToolbar from './CanvasToolbar'
import {
  GitBranch, Plus, Keyboard, Trash2, GitMerge,
  SidebarOpen, Copy, Link as LinkIcon,
} from 'lucide-react'

const nodeTypes = { skillNode: SkillNode }

const BASE_EDGE = {
  type: 'smoothstep',
  animated: false,
  style: { stroke: 'rgba(99,102,241,0.4)', strokeWidth: 1.8 },
}

// ─── Traversal helpers ───────────────────────────────────────────
const collectUpstream = (nodeId, allEdges) => {
  const nodeIds = new Set(), edgeIds = new Set()
  const queue = [nodeId], visited = new Set([nodeId])
  while (queue.length) {
    const target = queue.shift()
    allEdges.forEach((e) => {
      if (e.target !== target) return
      edgeIds.add(e.id); nodeIds.add(e.source)
      if (!visited.has(e.source)) { visited.add(e.source); queue.push(e.source) }
    })
  }
  return { nodeIds, edgeIds }
}

const collectDownstream = (nodeId, allEdges) => {
  const nodeIds = new Set(), edgeIds = new Set()
  const queue = [nodeId], visited = new Set([nodeId])
  while (queue.length) {
    const source = queue.shift()
    allEdges.forEach((e) => {
      if (e.source !== source) return
      edgeIds.add(e.id); nodeIds.add(e.target)
      if (!visited.has(e.target)) { visited.add(e.target); queue.push(e.target) }
    })
  }
  return { nodeIds, edgeIds }
}

// ─── Undo / Redo ────────────────────────────────────────────────
function useUndoRedo(storeNodes, storeEdges, setStoreNodes, setStoreEdges) {
  const [history, setHistory] = useState([])
  const [future, setFuture]   = useState([])
  const [lastSnap, setLastSnap] = useState(null)

  const takeSnapshot = useCallback(() => {
    const snap = JSON.stringify({ nodes: storeNodes, edges: storeEdges })
    if (snap === lastSnap) return
    setHistory((h) => [...h.slice(-49), snap])
    setFuture([])
    setLastSnap(snap)
  }, [storeNodes, storeEdges, lastSnap])

  const undo = useCallback(() => {
    if (!history.length) return
    const cur = JSON.stringify({ nodes: storeNodes, edges: storeEdges })
    setFuture((f) => [cur, ...f])
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    const p = JSON.parse(prev)
    setStoreNodes(p.nodes); setStoreEdges(p.edges); setLastSnap(prev)
  }, [history, storeNodes, storeEdges, setStoreNodes, setStoreEdges])

  const redo = useCallback(() => {
    if (!future.length) return
    const cur = JSON.stringify({ nodes: storeNodes, edges: storeEdges })
    setHistory((h) => [...h, cur])
    const next = future[0]
    setFuture((f) => f.slice(1))
    const p = JSON.parse(next)
    setStoreNodes(p.nodes); setStoreEdges(p.edges); setLastSnap(next)
  }, [future, storeNodes, storeEdges, setStoreNodes, setStoreEdges])

  return { takeSnapshot, undo, redo, canUndo: history.length > 0, canRedo: future.length > 0 }
}

// ─── Context Menu ────────────────────────────────────────────────
function ContextMenu({ x, y, nodeId, onClose, onAddChild, onDelete, onOpenSidebar, onDuplicate }) {
  const items = [
    { icon: Plus,        label: 'Add Child Node',   action: () => { onAddChild(nodeId); onClose() }, color: '#818cf8' },
    { icon: SidebarOpen, label: 'Open Details',     action: () => { onOpenSidebar(nodeId); onClose() }, color: '#94a3b8' },
    { icon: Copy,        label: 'Duplicate Node',   action: () => { onDuplicate(nodeId); onClose() }, color: '#94a3b8' },
    { sep: true },
    { icon: Trash2,      label: 'Delete Node',      action: () => { onDelete(nodeId); onClose() }, color: '#f87171', danger: true },
  ]

  useEffect(() => {
    const handler = () => onClose()
    window.addEventListener('click', handler)
    window.addEventListener('contextmenu', handler)
    return () => { window.removeEventListener('click', handler); window.removeEventListener('contextmenu', handler) }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'fixed', left: x, top: y, zIndex: 9999,
        background: 'rgba(5,8,18,0.98)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(30,41,59,0.7)', borderRadius: 14,
        boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset',
        padding: '6px',
        minWidth: 180,
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, i) =>
        item.sep ? (
          <div key={i} style={{ height: 1, background: 'rgba(30,41,59,0.5)', margin: '4px 0' }} />
        ) : (
          <button
            key={i}
            onClick={item.action}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: 'transparent', textAlign: 'left',
              fontSize: 12.5, fontWeight: 600,
              color: item.danger ? '#f87171' : '#94a3b8',
              transition: 'all 0.12s',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.1)' : 'rgba(30,41,59,0.5)'
              e.currentTarget.style.color = item.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = item.danger ? '#f87171' : '#94a3b8'
            }}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        )
      )}
    </motion.div>
  )
}

// ─── Connection guidance toast ────────────────────────────────────
function ConnectingToast({ source }) {
  if (!source) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      style={{
        position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 18px', borderRadius: 100,
        background: 'rgba(99,102,241,0.15)',
        border: '1px solid rgba(99,102,241,0.4)',
        backdropFilter: 'blur(12px)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <LinkIcon size={13} color="#818cf8" />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8' }}>
        Click another node to link — or press Escape to cancel
      </span>
    </motion.div>
  )
}

// ─── Main Flow ───────────────────────────────────────────────────
function Flow({ onSaveRoadmap, onBackToLibrary, activeRoadmapTitle }) {
  const storeNodes      = useStore((s) => s.nodes)
  const storeEdges      = useStore((s) => s.edges)
  const setStoreNodes   = useStore((s) => s.setNodes)
  const setStoreEdges   = useStore((s) => s.setEdges)
  const updateNodeData  = useStore((s) => s.updateNodeData)
  const updateNodeStatus = useStore((s) => s.updateNodeStatus)
  const selectedNodeId  = useStore((s) => s.selectedNodeId)
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId)
  const deleteNode      = useStore((s) => s.deleteNode)
  const addSkillNode    = useStore((s) => s.addSkillNode)

  const [nodes, setNodes] = useState(storeNodes)
  const [edges, setEdges] = useState(storeEdges)
  const [showModal, setShowModal]     = useState(false)
  const [modalParentId, setModalParentId] = useState(null)
  const [sidebarNode, setSidebarNode] = useState(null)
  const [mode, setMode]               = useState('pan')
  const [searchQuery, setSearchQuery] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [contextMenu, setContextMenu] = useState(null) // { x, y, nodeId }
  const [linkingFrom, setLinkingFrom] = useState(null)  // nodeId being linked from

  const rfRef = useRef(null)

  const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(
    storeNodes, storeEdges, setStoreNodes, setStoreEdges
  )

  useEffect(() => setNodes(storeNodes), [storeNodes])
  useEffect(() => setEdges(storeEdges), [storeEdges])

  useEffect(() => {
    if (!selectedNodeId) { setSidebarNode(null); return }
    const n = storeNodes.find((n) => n.id === selectedNodeId)
    if (n) setSidebarNode(n)
  }, [selectedNodeId, storeNodes])

  // ─── Open add-child modal ─────────────────────────────────────
  const handleAddChild = useCallback((parentId) => {
    setModalParentId(parentId)
    setShowModal(true)
  }, [])

  const handleOpenAddSkill = useCallback(() => {
    setModalParentId(selectedNodeId || null)
    setShowModal(true)
  }, [selectedNodeId])

  // ─── Duplicate node ───────────────────────────────────────────
  const handleDuplicate = useCallback((nodeId) => {
    const node = storeNodes.find((n) => n.id === nodeId)
    if (!node) return
    takeSnapshot()
    const id = `node_${Date.now()}`
    const newNode = {
      ...node, id,
      position: { x: node.position.x + 240, y: node.position.y + 40 },
      data: { ...node.data, title: node.data.title + ' (copy)', label: node.data.label + ' (copy)' },
      selected: false,
    }
    setStoreNodes([...storeNodes, newNode])
  }, [storeNodes, setStoreNodes, takeSnapshot])

  // ─── Link nodes (click-to-link mode) ─────────────────────────
  const handleLinkMode = useCallback((fromId) => {
    setLinkingFrom(fromId)
    setMode('link')
  }, [])

  // ─── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (isInput) return

      if (e.key === 'Escape') {
        setSelectedNodeId(null); setSidebarNode(null)
        setShowModal(false); setContextMenu(null); setLinkingFrom(null)
        if (mode === 'link') setMode('pan')
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId && mode === 'edit') {
          takeSnapshot(); deleteNode(selectedNodeId)
          setSelectedNodeId(null); setSidebarNode(null)
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveRoadmap() }
      if (e.key === 'n' || e.key === 'N') { setModalParentId(null); setShowModal(true) }
      if (e.key === 'e' || e.key === 'E') setMode((m) => m === 'edit' ? 'pan' : 'edit')
      if (e.key === '?') setShowShortcuts((p) => !p)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedNodeId, mode, undo, redo, deleteNode, setSelectedNodeId, takeSnapshot])

  // ─── Dependency context ────────────────────────────────────────
  const depCtx = useMemo(() => {
    if (!selectedNodeId) return { upNodes: new Set(), upEdges: new Set(), downNodes: new Set(), downEdges: new Set() }
    const up   = collectUpstream(selectedNodeId, edges)
    const down = collectDownstream(selectedNodeId, edges)
    return { upNodes: up.nodeIds, upEdges: up.edgeIds, downNodes: down.nodeIds, downEdges: down.edgeIds }
  }, [selectedNodeId, edges])

  // ─── Highlighted nodes — inject callbacks into data ───────────
  const highlightedNodes = useMemo(() => {
    return nodes.map((node) => {
      let hl = 'none'
      if (selectedNodeId === node.id) hl = 'selected'
      else if (depCtx.upNodes.has(node.id)) hl = 'prerequisite'
      else if (depCtx.downNodes.has(node.id)) hl = 'dependent'

      let searchStyle = undefined
      if (searchQuery) {
        const t = (node.data?.title || node.data?.label || '').toLowerCase()
        const match = t.includes(searchQuery.toLowerCase())
        searchStyle = { opacity: match ? 1 : 0.12, transition: 'opacity 0.25s', filter: match ? 'none' : 'grayscale(1)' }
      }

      // Highlight linking source
      const isLinkSource = linkingFrom === node.id

      return {
        ...node,
        data: {
          ...node.data,
          relationHighlight: hl,
          onAddChild: handleAddChild,   // ← inject callback into node data
        },
        style: {
          ...searchStyle,
          outline: isLinkSource ? '2px solid #818cf8' : undefined,
          borderRadius: isLinkSource ? 20 : undefined,
        },
      }
    })
  }, [nodes, selectedNodeId, depCtx, searchQuery, linkingFrom, handleAddChild])

  // ─── Styled edges ──────────────────────────────────────────────
  const styledEdges = useMemo(() => {
    return edges.map((e) => {
      const baseStyle = { ...BASE_EDGE }
      if (!selectedNodeId) return baseStyle.type === 'smoothstep'
        ? { ...e, ...BASE_EDGE }
        : { ...e, ...BASE_EDGE }
      if (depCtx.upEdges.has(e.id)) return {
        ...e, ...BASE_EDGE, animated: true,
        style: { stroke: '#f87171', strokeWidth: 2, filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.5))' },
      }
      if (depCtx.downEdges.has(e.id)) return {
        ...e, ...BASE_EDGE, animated: true,
        style: { stroke: '#34d399', strokeWidth: 2, filter: 'drop-shadow(0 0 4px rgba(52,211,153,0.5))' },
      }
      return { ...e, ...BASE_EDGE, style: { stroke: 'rgba(30,41,59,0.45)', strokeWidth: 1.2 } }
    })
  }, [edges, selectedNodeId, depCtx])

  // ─── Progress ─────────────────────────────────────────────────
  const progress = useMemo(() => {
    const total = storeNodes.length
    const completed = storeNodes.filter((n) => n.data.status === 'completed').length
    const unlocked  = storeNodes.filter((n) => n.data.unlocked).length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, unlocked, percentage }
  }, [storeNodes])

  // ─── Flow event handlers ───────────────────────────────────────
  const onNodesChange = useCallback((changes) => {
    if (mode === 'pan' || mode === 'link') return
    takeSnapshot()
    setNodes((n) => { const next = applyNodeChanges(changes, n); setStoreNodes(next); return next })
  }, [setStoreNodes, mode, takeSnapshot])

  const onEdgesChange = useCallback((changes) => {
    takeSnapshot()
    setEdges((e) => { const next = applyEdgeChanges(changes, e); setStoreEdges(next); return next })
  }, [setStoreEdges, takeSnapshot])

  const onConnect = useCallback((params) => {
    takeSnapshot()
    setEdges((e) => {
      const next = addEdge({
        ...params,
        ...BASE_EDGE,
        animated: true,
        style: { stroke: 'rgba(99,102,241,0.7)', strokeWidth: 2, filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.35))' },
      }, e)
      setStoreEdges(next)
      return next
    })
    if (mode === 'link') { setMode('pan'); setLinkingFrom(null) }
  }, [setStoreEdges, takeSnapshot, mode])

  const onNodeClick = useCallback((_, node) => {
    // Link mode: clicking a 2nd node creates an edge
    if (mode === 'link' && linkingFrom && linkingFrom !== node.id) {
      takeSnapshot()
      const edgeId = `e_${linkingFrom}_${node.id}`
      const newEdge = {
        id: edgeId, source: linkingFrom, target: node.id,
        ...BASE_EDGE,
        animated: true,
        style: { stroke: 'rgba(99,102,241,0.7)', strokeWidth: 2 },
      }
      setEdges((prev) => {
        // avoid duplicates
        if (prev.some((e) => e.id === edgeId)) return prev
        const next = [...prev, newEdge]
        setStoreEdges(next)
        return next
      })
      setMode('pan')
      setLinkingFrom(null)
      return
    }
    setSelectedNodeId(node.id)
  }, [mode, linkingFrom, setSelectedNodeId, takeSnapshot, setStoreEdges])

  const onNodeContextMenu = useCallback((e, node) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id })
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null); setSidebarNode(null)
    setContextMenu(null); setShowShortcuts(false)
    if (mode === 'link') { setMode('pan'); setLinkingFrom(null) }
  }, [setSelectedNodeId, mode])

  const handleDeleteNode = useCallback((nodeId) => {
    takeSnapshot()
    deleteNode(nodeId)
    setSelectedNodeId(null); setSidebarNode(null)
  }, [deleteNode, setSelectedNodeId, takeSnapshot])

  const handleUpdateNode = useCallback((nodeId, updates) => {
    takeSnapshot(); updateNodeData(nodeId, updates)
  }, [updateNodeData, takeSnapshot])

  const handleExportJson = () => {
    const str = JSON.stringify({ nodes: storeNodes, edges: storeEdges }, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'devstakes-roadmap.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveRoadmap = () => {
    onSaveRoadmap?.({ nodes: storeNodes, edges: storeEdges, stats: progress })
  }

  const handleBack = () => {
    if (!onBackToLibrary) return
    setSelectedNodeId(null); setSidebarNode(null); onBackToLibrary()
  }

  const isEmpty = storeNodes.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#03060f' }}>
      <CanvasToolbar
        mode={mode}
        setMode={(m) => {
          setMode(m)
          if (m === 'pan' || m === 'edit') { setLinkingFrom(null) }
          if (m === 'pan') { setSelectedNodeId(null); setSidebarNode(null) }
        }}
        selectedNodeId={selectedNodeId}
        onAddSkill={handleOpenAddSkill}
        onDeleteNode={() => selectedNodeId && handleDeleteNode(selectedNodeId)}
        onSaveRoadmap={handleSaveRoadmap}
        onExportJson={handleExportJson}
        onBackToLibrary={handleBack}
        onSearch={setSearchQuery}
        onUndo={undo} onRedo={redo}
        canUndo={canUndo} canRedo={canRedo}
        activeRoadmapTitle={activeRoadmapTitle}
        progress={progress}
        onLinkMode={() => {
          if (selectedNodeId) { setLinkingFrom(selectedNodeId); setMode('link') }
          else { alert('Select a node first, then click Link') }
        }}
      />

      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>

        {/* ── Empty state ──────────────────────────────────────── */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Inter', sans-serif", pointerEvents: 'none',
              }}
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                style={{
                  width: 68, height: 68, borderRadius: 20, marginBottom: 22,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(99,102,241,0.08)',
                }}
              >
                <GitBranch size={28} color="#6366f1" style={{ opacity: 0.7 }} />
              </motion.div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 10 }}>
                Start your skill tree
              </h2>
              <p style={{ fontSize: 13.5, color: '#475569', marginBottom: 28, maxWidth: 360, textAlign: 'center', lineHeight: 1.65 }}>
                Add your first skill node. Connect nodes to define prerequisites. Build your learning path.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setModalParentId(null); setShowModal(true) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '13px 26px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white',
                  pointerEvents: 'all',
                  boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
                }}
              >
                <Plus size={17} /> Create First Skill
              </motion.button>
              <p style={{ marginTop: 14, fontSize: 11, color: '#334155' }}>
                Press{' '}
                <kbd style={{ padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(30,41,59,0.6)', background: 'rgba(15,23,42,0.5)', fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>N</kbd>
                {' '}anytime to add a skill
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mode pill ────────────────────────────────────────── */}
        <AnimatePresence>
          {(mode === 'edit' || mode === 'link') && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                zIndex: 20, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 16px', borderRadius: 100,
                border: `1px solid ${mode === 'link' ? 'rgba(251,191,36,0.35)' : 'rgba(99,102,241,0.35)'}`,
                background: mode === 'link' ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.1)',
                backdropFilter: 'blur(12px)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: mode === 'link' ? '#fbbf24' : '#818cf8',
                boxShadow: `0 0 8px ${mode === 'link' ? '#fbbf24' : '#818cf8'}`,
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: mode === 'link' ? '#fbbf24' : '#818cf8', letterSpacing: '0.05em' }}>
                {mode === 'link' ? '🔗 LINK MODE — click target node' : '✏️ EDIT MODE — drag nodes & handles to connect'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dep legend ───────────────────────────────────────── */}
        <AnimatePresence>
          {selectedNodeId && mode !== 'link' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                zIndex: 20, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '7px 18px', borderRadius: 100,
                border: '1px solid rgba(30,41,59,0.6)',
                background: 'rgba(3,6,15,0.94)', backdropFilter: 'blur(12px)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {[
                { color: '#f87171', label: 'Prerequisites' },
                { color: '#34d399', label: 'Dependents' },
              ].map(({ color, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {label}
                </span>
              ))}
              {mode === 'edit' && (
                <>
                  <span style={{ width: 1, height: 14, background: 'rgba(30,41,59,0.6)' }} />
                  <span style={{ fontSize: 11, color: '#475569' }}>
                    <kbd style={{ padding: '1px 5px', borderRadius: 4, border: '1px solid rgba(30,41,59,0.6)', fontSize: 9, background: 'rgba(15,23,42,0.6)', color: '#64748b', fontFamily: 'monospace' }}>Del</kbd> to remove
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connecting-mode toast */}
        <AnimatePresence>
          {mode === 'link' && <ConnectingToast source={linkingFrom} />}
        </AnimatePresence>

        {/* ── Shortcuts panel button ───────────────────────────── */}
        <button
          onClick={() => setShowShortcuts((p) => !p)}
          title="Keyboard shortcuts (?)"
          style={{
            position: 'absolute', bottom: 12, right: 212, zIndex: 20,
            width: 30, height: 30, borderRadius: 8,
            border: '1px solid rgba(30,41,59,0.6)',
            background: 'rgba(5,8,16,0.85)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#334155', transition: 'all 0.15s', backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = 'rgba(30,41,59,0.6)' }}
        >
          <Keyboard size={13} />
        </button>

        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              style={{
                position: 'absolute', bottom: 50, right: 212, zIndex: 30,
                background: 'rgba(5,8,16,0.98)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(30,41,59,0.7)', borderRadius: 16,
                padding: '16px 18px', minWidth: 210,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <p style={{ fontSize: 10.5, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Keyboard Shortcuts
              </p>
              {[
                ['N', 'New skill node'],
                ['E', 'Toggle edit mode'],
                ['Del', 'Delete selected node'],
                ['Esc', 'Deselect / cancel'],
                ['Ctrl+Z', 'Undo'],
                ['Ctrl+Y', 'Redo'],
                ['Ctrl+S', 'Save roadmap'],
                ['?', 'Toggle shortcuts'],
              ].map(([key, label]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
                  <kbd style={{ padding: '2px 8px', borderRadius: 5, fontSize: 10, fontFamily: 'monospace', border: '1px solid rgba(30,41,59,0.7)', background: 'rgba(15,23,42,0.5)', color: '#64748b' }}>{key}</kbd>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(30,41,59,0.4)' }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Linking nodes
                </p>
                {[
                  ['Edit mode', 'Drag handles to connect'],
                  ['Right-click', 'Context menu on node'],
                  ['Add Child btn', 'Hover node → click ⊕'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: '#475569' }}>{v}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#334155', textAlign: 'right' }}>{k}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── React Flow canvas ─────────────────────────────────── */}
        <ReactFlow
          nodes={highlightedNodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          fitView={!isEmpty}
          fitViewOptions={{ padding: 0.18, maxZoom: 0.85 }}
          style={{ width: '100%', height: '100%' }}
          panOnDrag={mode === 'pan'}
          panOnScroll={mode === 'pan'}
          panOnScrollMode="free"
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          nodesDraggable={mode === 'edit'}
          nodesConnectable={mode === 'edit'}
          elementsSelectable={mode !== 'pan'}
          minZoom={0.12}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={BASE_EDGE}
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 4' }}
          connectionRadius={30}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24} size={1.1}
            color="rgba(30,41,59,0.38)"
          />
          <Controls position="bottom-left" showFitView showInteractive={false} />
          <MiniMap
            position="bottom-right"
            nodeColor={(n) => {
              if (!n.data?.unlocked) return '#0c1524'
              if (n.data?.status === 'completed')  return '#34d399'
              if (n.data?.status === 'in-progress') return '#fbbf24'
              return '#6366f1'
            }}
            maskColor="rgba(3,6,15,0.88)"
            style={{ borderRadius: 14, border: '1px solid rgba(30,41,59,0.6)' }}
            nodeStrokeWidth={0}
          />
        </ReactFlow>

        {/* ── Context menu ──────────────────────────────────────── */}
        <AnimatePresence>
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              nodeId={contextMenu.nodeId}
              onClose={() => setContextMenu(null)}
              onAddChild={(nid) => handleAddChild(nid)}
              onDelete={handleDeleteNode}
              onOpenSidebar={(nid) => {
                const n = storeNodes.find((node) => node.id === nid)
                if (n) { setSidebarNode(n); setSelectedNodeId(nid) }
              }}
              onDuplicate={handleDuplicate}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showModal && (
          <AddSkillModal
            onClose={() => { setShowModal(false); setModalParentId(null) }}
            parentId={modalParentId}
            onBeforeAdd={takeSnapshot}
          />
        )}
      </AnimatePresence>

      {/* Node Sidebar */}
      <NodeSidebar
        node={sidebarNode}
        onClose={() => { setSidebarNode(null); setSelectedNodeId(null) }}
        onUpdateNode={handleUpdateNode}
        onUpdateStatus={(id, s) => { takeSnapshot(); updateNodeStatus(id, s) }}
        onAddChild={handleAddChild}
      />
    </div>
  )
}

export default function FlowCanvas({ onSaveRoadmap, onBackToLibrary, activeRoadmapTitle }) {
  return (
    <ReactFlowProvider>
      <Flow
        onSaveRoadmap={onSaveRoadmap}
        onBackToLibrary={onBackToLibrary}
        activeRoadmapTitle={activeRoadmapTitle}
      />
    </ReactFlowProvider>
  )
}
