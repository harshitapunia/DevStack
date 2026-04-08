import { create } from 'zustand'

const STORAGE_KEY = 'devstakes_data'

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

const saveToStorage = (nodes, edges) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }))
  } catch {}
}

const computeUnlocks = (nodes, edges) => {
  return nodes.map((node) => {
    const incoming = edges.filter((e) => e.target === node.id)
    if (incoming.length === 0) return { ...node, data: { ...node.data, unlocked: true } }
    const allDone = incoming.every((e) => {
      const src = nodes.find((n) => n.id === e.source)
      return src?.data?.status === 'completed'
    })
    return { ...node, data: { ...node.data, unlocked: allDone } }
  })
}

const saved = loadFromStorage()

export const useStore = create((set, get) => ({
  nodes: saved?.nodes ? computeUnlocks(saved.nodes, saved.edges) : [],
  edges: saved?.edges || [],
  selectedNodeId: null,

  setNodes: (nodes) => {
    const updated = computeUnlocks(nodes, get().edges)
    saveToStorage(updated, get().edges)
    set({ nodes: updated })
  },

  setEdges: (edges) => {
    const updated = computeUnlocks(get().nodes, edges)
    saveToStorage(updated, edges)
    set({ edges, nodes: updated })
  },

  updateNodeStatus: (id, status) => {
    const nodes = get().nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, status } } : n
    )
    const updated = computeUnlocks(nodes, get().edges)
    saveToStorage(updated, get().edges)
    set({ nodes: updated })
  },

  addSkillNode: (data = {}, parentId = null) => {
    const id = `node_${Date.now()}`
    const nodes = get().nodes
    const edges = get().edges

    // Find parent node to position below it
    const parent = nodes.find((n) => n.id === parentId)
    const siblings = parentId
      ? edges.filter((e) => e.source === parentId).length
      : nodes.filter((n) => !edges.some((e) => e.target === n.id)).length

    let position
    if (parent) {
      position = {
        x: parent.position.x + (siblings - 1) * 260,
        y: parent.position.y + 220,
      }
    } else if (nodes.length === 0) {
      position = { x: 400, y: 200 }
    } else {
      position = {
        x: 100 + nodes.length * 220,
        y: 200,
      }
    }

    const newNode = {
      id,
      type: 'skillNode',
      position,
      data: {
        label: data.title || 'New Skill',
        description: data.description || '',
        links: data.links || [],
        status: 'pending',
        unlocked: !parentId,
      },
    }

    const newEdge = parentId ? [{
      id: `e_${parentId}_${id}`,
      source: parentId,
      target: id,
      animated: true,
      style: { stroke: '#4f46e5', strokeWidth: 2 },
    }] : []

    const updatedNodes = computeUnlocks([...nodes, newNode], [...edges, ...newEdge])
    saveToStorage(updatedNodes, [...edges, ...newEdge])
    set({ nodes: updatedNodes, edges: [...edges, ...newEdge] })
    return id
  },

  deleteNode: (id) => {
    const nodes = get().nodes.filter((n) => n.id !== id)
    const edges = get().edges.filter((e) => e.source !== id && e.target !== id)
    const updated = computeUnlocks(nodes, edges)
    saveToStorage(updated, edges)
    set({ nodes: updated, edges })
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}))