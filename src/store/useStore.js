import { create } from 'zustand'

const STORAGE_KEY = 'devstakes_data'
const VALID_STATUSES = new Set(['pending', 'in-progress', 'completed'])

const normalizeLinks = (links) => {
  if (!Array.isArray(links)) return []
  return links
    .filter((link) => link && (link.url || link.label))
    .map((link) => ({
      label: String(link.label || '').trim(),
      url: String(link.url || '').trim(),
    }))
}

const normalizeNode = (node) => {
  const data = node?.data || {}
  const title = String(data.title || data.label || 'New Skill')
  const status = VALID_STATUSES.has(data.status) ? data.status : 'pending'

  return {
    ...node,
    type: node?.type || 'skillNode',
    data: {
      ...data,
      title,
      label: String(data.label || title),
      description: String(data.description || ''),
      links: normalizeLinks(data.links),
      status,
      unlocked: Boolean(data.unlocked),
    },
  }
}

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
  const normalizedNodes = nodes.map(normalizeNode)
  let workingNodes = normalizedNodes

  // Recompute until stable so status downgrades propagate to all descendants.
  for (let i = 0; i <= normalizedNodes.length; i += 1) {
    const nodeById = new Map(workingNodes.map((node) => [node.id, node]))
    let changed = false

    const nextNodes = workingNodes.map((node) => {
      const incoming = edges.filter((edge) => edge.target === node.id)
      const unlocked = incoming.length === 0 || incoming.every((edge) => {
        const sourceNode = nodeById.get(edge.source)
        return sourceNode?.data?.status === 'completed'
      })

      const nextStatus = unlocked ? node.data.status : 'pending'

      if (nextStatus !== node.data.status || unlocked !== node.data.unlocked) {
        changed = true
        return {
          ...node,
          data: {
            ...node.data,
            status: nextStatus,
            unlocked,
          },
        }
      }

      return node
    })

    workingNodes = nextNodes
    if (!changed) break
  }

  return workingNodes
}

const saved = loadFromStorage()

export const useStore = create((set, get) => ({
  nodes: saved?.nodes ? computeUnlocks(saved.nodes, saved.edges) : [],
  edges: saved?.edges || [],
  selectedNodeId: null,

  replaceGraph: ({ nodes = [], edges = [] }) => {
    const updatedNodes = computeUnlocks(nodes, edges)
    saveToStorage(updatedNodes, edges)
    set({
      nodes: updatedNodes,
      edges,
      selectedNodeId: null,
    })
  },

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
    if (!VALID_STATUSES.has(status)) return

    const nodes = get().nodes.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, status } } : n
    )

    const updated = computeUnlocks(nodes, get().edges)
    saveToStorage(updated, get().edges)
    set({ nodes: updated })
  },

  updateNodeData: (id, updates = {}) => {
    const nextNodes = get().nodes.map((node) => {
      if (node.id !== id) return node

      const nextTitle = updates.title ?? updates.label ?? node.data.title ?? node.data.label

      return {
        ...node,
        data: {
          ...node.data,
          ...updates,
          title: nextTitle,
          label: updates.label ?? nextTitle,
          links: updates.links ? normalizeLinks(updates.links) : node.data.links,
        },
      }
    })

    const updated = computeUnlocks(nextNodes, get().edges)
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
        title: data.title || data.label || 'New Skill',
        label: data.title || data.label || 'New Skill',
        description: data.description || '',
        links: normalizeLinks(data.links),
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