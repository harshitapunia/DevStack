import { useCallback, useState, useEffect, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useStore } from '../store/useStore'
import SkillNode from './SkillNode'
import AddSkillModal from './AddSkillModal'
import NodeSidebar from './NodeSidebar'

const nodeTypes = { skillNode: SkillNode }

function Flow() {
  const storeNodes = useStore((s) => s.nodes)
  const storeEdges = useStore((s) => s.edges)
  const setStoreNodes = useStore((s) => s.setNodes)
  const setStoreEdges = useStore((s) => s.setEdges)
  const selectedNodeId = useStore((s) => s.selectedNodeId)
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId)
  const deleteNode = useStore((s) => s.deleteNode)

  const [nodes, setNodes] = useState(storeNodes)
  const [edges, setEdges] = useState(storeEdges)
  const [showModal, setShowModal] = useState(false)
  const [sidebarNode, setSidebarNode] = useState(null)
  const [mode, setMode] = useState('pan')

  useEffect(() => setNodes(storeNodes), [storeNodes])
  useEffect(() => setEdges(storeEdges), [storeEdges])

  useEffect(() => {
    if (sidebarNode) {
      const updated = storeNodes.find((n) => n.id === sidebarNode.id)
      if (updated) setSidebarNode(updated)
    }
  }, [storeNodes])

  const onNodesChange = useCallback((changes) => {
    if (mode === 'pan') return
    setNodes((n) => {
      const next = applyNodeChanges(changes, n)
      setStoreNodes(next)
      return next
    })
  }, [setStoreNodes, mode])

  const onEdgesChange = useCallback((changes) => {
    setEdges((e) => {
      const next = applyEdgeChanges(changes, e)
      setStoreEdges(next)
      return next
    })
  }, [setStoreEdges])

  const onConnect = useCallback((params) => {
    setEdges((e) => {
      const next = addEdge({
        ...params, animated: true,
        style: { stroke: '#4f46e5', strokeWidth: 2 }
      }, e)
      setStoreEdges(next)
      return next
    })
  }, [setStoreEdges])

  const onNodeClick = useCallback((_, node) => {
    if (mode === 'pan') return
    setSelectedNodeId(node.id)
    setSidebarNode(node)
  }, [setSelectedNodeId, mode])

  const handleUpdateNode = useCallback((nodeId, updates) => {
    const updated = storeNodes.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
    )
    setStoreNodes(updated)
    setNodes(updated)
    if (sidebarNode?.id === nodeId) {
      setSidebarNode(prev => ({ ...prev, data: { ...prev.data, ...updates } }))
    }
  }, [storeNodes, setStoreNodes, sidebarNode])

  const styledEdges = selectedNodeId
    ? edges.map((edge) => {
        if (edge.target === selectedNodeId)
          return { ...edge, style: { stroke: '#f87171', strokeWidth: 2.5 }, animated: true }
        if (edge.source === selectedNodeId)
          return { ...edge, style: { stroke: '#34d399', strokeWidth: 2.5 }, animated: true }
        return { ...edge, style: { stroke: '#1e293b', strokeWidth: 1 }, animated: false }
      })
    : edges

  const handleSaveAll = () => {
    const dataStr = JSON.stringify({ nodes: storeNodes, edges: storeEdges }, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skill-tree.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const isEmpty = storeNodes.length === 0

  const modeBtn = (m, icon, label) => (
    <button
      onClick={() => {
        setMode(m)
        if (m === 'pan') { setSelectedNodeId(null); setSidebarNode(null) }
      }}
      style={{
        padding: '6px 14px', fontSize: 13, fontWeight: 600,
        borderRadius: 8, cursor: 'pointer', border: 'none',
        background: mode === m ? '#4f46e5' : '#1e293b',
        color: mode === m ? '#fff' : '#64748b',
        boxShadow: mode === m ? '0 2px 10px rgba(99,102,241,0.4)' : 'none',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 5,
      }}
    >
      {icon} {label}
    </button>
  )

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      overflow: 'hidden', background: '#0f172a',
    }}>

      {/* ── STICKY NAVBAR ── */}
      <div style={{
        flexShrink: 0,
        height: 54,
        background: 'rgba(15,23,42,0.98)',
        borderBottom: '1px solid #1e293b',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 12,
        zIndex: 100,
        position: 'relative',
      }}>
        {/* Logo */}
        <span style={{ fontSize: 20 }}>🎮</span>
        <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>DevStakes</span>

        <div style={{ width: 1, height: 28, background: '#1e293b', margin: '0 4px' }} />

        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: 4, padding: 4,
          background: '#0a1120', borderRadius: 10,
          border: '1px solid #1e293b',
        }}>
          {modeBtn('pan', '🖐', 'Pan')}
          {modeBtn('edit', '✏️', 'Edit')}
        </div>

        <div style={{ width: 1, height: 28, background: '#1e293b', margin: '0 4px' }} />

        {/* Add skill */}
        <button onClick={() => setShowModal(true)} style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: '#fff', border: 'none', borderRadius: 10,
          padding: '7px 16px', fontWeight: 600, fontSize: 13,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
        }}>
          + Add Skill
        </button>

        {/* Edit mode node actions */}
        {mode === 'edit' && selectedNodeId && (
          <>
            <button onClick={() => setShowModal(true)} style={{
              background: '#1e293b', color: '#818cf8',
              border: '1px solid #4f46e5', borderRadius: 10,
              padding: '7px 14px', fontSize: 13, cursor: 'pointer',
            }}>
              + Child
            </button>
            <button onClick={() => {
              deleteNode(selectedNodeId)
              setSelectedNodeId(null)
              setSidebarNode(null)
            }} style={{
              background: '#1e293b', color: '#f87171',
              border: '1px solid #7f1d1d', borderRadius: 10,
              padding: '7px 14px', fontSize: 13, cursor: 'pointer',
            }}>
              🗑
            </button>
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Mode pill */}
        <div style={{
          background: mode === 'pan' ? 'rgba(99,102,241,0.1)' : 'rgba(52,211,153,0.1)',
          border: `1px solid ${mode === 'pan' ? '#4f46e5' : '#34d399'}`,
          color: mode === 'pan' ? '#818cf8' : '#34d399',
          borderRadius: 999, padding: '4px 14px',
          fontSize: 12, fontWeight: 600,
        }}>
          {mode === 'pan' ? '🖐 Pan — drag to scroll' : '✏️ Edit — drag nodes'}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
          {[
            { color: '#64748b', label: 'Pending' },
            { color: '#facc15', label: 'In Progress' },
            { color: '#34d399', label: 'Done' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
              <span style={{ color: '#475569', fontSize: 11 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: '#1e293b', margin: '0 4px' }} />

        <button onClick={handleSaveAll} style={{
          background: 'transparent', color: '#34d399',
          border: '1px solid #34d399', borderRadius: 10,
          padding: '7px 16px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          💾 Save
        </button>
      </div>

      {/* ── CANVAS AREA (fills remaining height exactly) ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Empty state */}
        {isEmpty && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 60 }}>🌱</div>
            <h2 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>
              Start your skill tree
            </h2>
            <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>
              Add your first skill to get started
            </p>
            <button onClick={() => setShowModal(true)} style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 28px', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', marginTop: 8,
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}>
              + Create First Skill
            </button>
          </div>
        )}

        {/* Dependency hint */}
        {selectedNodeId && mode === 'edit' && (
          <div style={{
            position: 'absolute', bottom: 20, left: '50%',
            transform: 'translateX(-50%)', zIndex: 10,
            background: '#1e293b', border: '1px solid #334155',
            color: '#94a3b8', fontSize: 12,
            padding: '8px 20px', borderRadius: 999,
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            🔴 Red = prerequisites &nbsp;|&nbsp; 🟢 Green = dependents
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            if (mode === 'edit') {
              setSelectedNodeId(null)
              setSidebarNode(null)
            }
          }}
          fitView={!isEmpty}
          style={{ width: '100%', height: '100%', background: '#0f172a' }}
          panOnDrag={mode === 'pan'}
          panOnScroll={mode === 'pan'}
          panOnScrollMode="free"
          zoomOnScroll={false}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          nodesDraggable={mode === 'edit'}
          nodesConnectable={mode === 'edit'}
          elementsSelectable={mode === 'edit'}
          translateExtent={(() => {
  if (nodes.length === 0) return [[-500, -500], [2000, 2000]]
  const maxX = Math.max(...nodes.map((n) => n.position.x)) + 600
  const maxY = Math.max(...nodes.map((n) => n.position.y)) + 600
  const minX = Math.min(...nodes.map((n) => n.position.x)) - 400
  const minY = Math.min(...nodes.map((n) => n.position.y)) - 400
  return [[minX, minY], [maxX, maxY]]
})()}
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background color="#1e293b" gap={28} size={1} />
          <Controls position="bottom-left" />
        </ReactFlow>
      </div>

      {showModal && (
        <AddSkillModal
          onClose={() => setShowModal(false)}
          parentId={selectedNodeId}
        />
      )}

      <NodeSidebar
        node={sidebarNode}
        onClose={() => { setSidebarNode(null); setSelectedNodeId(null) }}
        onUpdateNode={handleUpdateNode}
      />
    </div>
  )
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}