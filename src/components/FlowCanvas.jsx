import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useStore } from '../store/useStore'
import SkillNode from './SkillNode'
import AddSkillModal from './AddSkillModal'
import NodeSidebar from './NodeSidebar'
import ProgressDashboard from './ProgressDashboard'

const nodeTypes = { skillNode: SkillNode }
const DEFAULT_EDGE_STYLE = { stroke: '#4f46e5', strokeWidth: 2 }

const collectUpstream = (selectedNodeId, allEdges) => {
  const nodeIds = new Set()
  const edgeIds = new Set()
  const queue = [selectedNodeId]
  const visited = new Set([selectedNodeId])

  while (queue.length) {
    const targetNode = queue.shift()

    allEdges.forEach((edge) => {
      if (edge.target !== targetNode) return

      edgeIds.add(edge.id)
      nodeIds.add(edge.source)

      if (!visited.has(edge.source)) {
        visited.add(edge.source)
        queue.push(edge.source)
      }
    })
  }

  return { nodeIds, edgeIds }
}

const collectDownstream = (selectedNodeId, allEdges) => {
  const nodeIds = new Set()
  const edgeIds = new Set()
  const queue = [selectedNodeId]
  const visited = new Set([selectedNodeId])

  while (queue.length) {
    const sourceNode = queue.shift()

    allEdges.forEach((edge) => {
      if (edge.source !== sourceNode) return

      edgeIds.add(edge.id)
      nodeIds.add(edge.target)

      if (!visited.has(edge.target)) {
        visited.add(edge.target)
        queue.push(edge.target)
      }
    })
  }

  return { nodeIds, edgeIds }
}

function Flow({ onSaveRoadmap, onBackToLibrary, activeRoadmapTitle }) {
  const storeNodes = useStore((s) => s.nodes)
  const storeEdges = useStore((s) => s.edges)
  const setStoreNodes = useStore((s) => s.setNodes)
  const setStoreEdges = useStore((s) => s.setEdges)
  const updateNodeData = useStore((s) => s.updateNodeData)
  const updateNodeStatus = useStore((s) => s.updateNodeStatus)
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
    if (!selectedNodeId) {
      setSidebarNode(null)
      return
    }

    const updated = storeNodes.find((n) => n.id === selectedNodeId)
    if (updated) setSidebarNode(updated)
  }, [selectedNodeId, storeNodes])

  const dependencyContext = useMemo(() => {
    if (!selectedNodeId) {
      return {
        prerequisiteNodeIds: new Set(),
        prerequisiteEdgeIds: new Set(),
        dependentNodeIds: new Set(),
        dependentEdgeIds: new Set(),
      }
    }

    const upstream = collectUpstream(selectedNodeId, edges)
    const downstream = collectDownstream(selectedNodeId, edges)

    return {
      prerequisiteNodeIds: upstream.nodeIds,
      prerequisiteEdgeIds: upstream.edgeIds,
      dependentNodeIds: downstream.nodeIds,
      dependentEdgeIds: downstream.edgeIds,
    }
  }, [selectedNodeId, edges])

  const highlightedNodes = useMemo(() => {
    return nodes.map((node) => {
      let relationHighlight = 'none'

      if (selectedNodeId === node.id) {
        relationHighlight = 'selected'
      } else if (dependencyContext.prerequisiteNodeIds.has(node.id)) {
        relationHighlight = 'prerequisite'
      } else if (dependencyContext.dependentNodeIds.has(node.id)) {
        relationHighlight = 'dependent'
      }

      return {
        ...node,
        data: {
          ...node.data,
          relationHighlight,
        },
      }
    })
  }, [nodes, selectedNodeId, dependencyContext])

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
      const next = addEdge(
        {
          ...params,
          animated: true,
          style: DEFAULT_EDGE_STYLE,
        },
        e
      )

      setStoreEdges(next)
      return next
    })
  }, [setStoreEdges])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])

  const handleUpdateNode = useCallback((nodeId, updates) => {
    updateNodeData(nodeId, updates)
  }, [updateNodeData])

  const styledEdges = useMemo(() => {
    if (!selectedNodeId) return edges

    return edges.map((edge) => {
      if (dependencyContext.prerequisiteEdgeIds.has(edge.id)) {
        return {
          ...edge,
          animated: true,
          style: { stroke: '#f87171', strokeWidth: 2.8 },
        }
      }

      if (dependencyContext.dependentEdgeIds.has(edge.id)) {
        return {
          ...edge,
          animated: true,
          style: { stroke: '#34d399', strokeWidth: 2.8 },
        }
      }

      return {
        ...edge,
        animated: false,
        style: { stroke: '#1e293b', strokeWidth: 1 },
      }
    })
  }, [edges, selectedNodeId, dependencyContext])

  const progress = useMemo(() => {
    const total = storeNodes.length
    const completed = storeNodes.filter((node) => node.data.status === 'completed').length
    const unlocked = storeNodes.filter((node) => node.data.unlocked).length
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    return { total, completed, unlocked, percentage }
  }, [storeNodes])

  const translateExtent = useMemo(() => {
    if (nodes.length === 0) return [[-500, -500], [2000, 2000]]

    const maxX = Math.max(...nodes.map((n) => n.position.x)) + 600
    const maxY = Math.max(...nodes.map((n) => n.position.y)) + 600
    const minX = Math.min(...nodes.map((n) => n.position.x)) - 400
    const minY = Math.min(...nodes.map((n) => n.position.y)) - 400

    return [[minX, minY], [maxX, maxY]]
  }, [nodes])

  const handleExportJson = () => {
    const dataStr = JSON.stringify({ nodes: storeNodes, edges: storeEdges }, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skill-tree.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveRoadmap = () => {
    if (!onSaveRoadmap) return
    onSaveRoadmap({
      nodes: storeNodes,
      edges: storeEdges,
      stats: progress,
    })
  }

  const handleBackToLibrary = () => {
    if (!onBackToLibrary) return
    setSelectedNodeId(null)
    setSidebarNode(null)
    onBackToLibrary()
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

        {onBackToLibrary && (
          <button
            onClick={handleBackToLibrary}
            style={{
              marginLeft: 8,
              background: 'rgba(59,130,246,0.12)',
              color: '#bfdbfe',
              border: '1px solid #2563eb',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Back to main screen"
          >
            ← Back to Main Screen
          </button>
        )}

        {activeRoadmapTitle && (
          <div
            style={{
              marginLeft: 6,
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid #334155',
              background: '#0b1220',
              color: '#94a3b8',
              fontSize: 11,
              maxWidth: 220,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {activeRoadmapTitle}
          </div>
        )}

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

        <ProgressDashboard
          total={progress.total}
          completed={progress.completed}
          unlocked={progress.unlocked}
          percentage={progress.percentage}
        />

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

        <button
          onClick={handleSaveRoadmap}
          style={{
            background: '#34d399', color: '#052e16',
            border: '1px solid #34d399', borderRadius: 10,
            padding: '7px 16px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          💾 Save Roadmap
        </button>

        <button
          onClick={handleExportJson}
          style={{
            background: 'transparent', color: '#34d399',
            border: '1px solid #34d399', borderRadius: 10,
            padding: '7px 16px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          Export JSON
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
          nodes={highlightedNodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedNodeId(null)
            setSidebarNode(null)
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
          translateExtent={translateExtent}
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
        onUpdateStatus={updateNodeStatus}
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