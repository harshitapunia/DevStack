import { Handle, Position } from 'reactflow'
import { useStore } from '../store/useStore'

const statusConfig = {
  pending: { label: '⏳ Pending', borderColor: '#64748b', badgeBg: '#1e293b', badgeColor: '#94a3b8', textColor: '#94a3b8' },
  'in-progress': { label: '🚧 In Progress', borderColor: '#facc15', badgeBg: '#422006', badgeColor: '#fde047', textColor: '#fde047' },
  completed: { label: '✅ Completed', borderColor: '#34d399', badgeBg: '#022c22', badgeColor: '#6ee7b7', textColor: '#6ee7b7' },
}

const relationHighlightConfig = {
  selected: { borderColor: '#818cf8', shadow: '0 0 0 2px rgba(99,102,241,0.55)' },
  prerequisite: { borderColor: '#f87171', shadow: '0 0 0 2px rgba(248,113,113,0.5)' },
  dependent: { borderColor: '#34d399', shadow: '0 0 0 2px rgba(52,211,153,0.5)' },
  none: { borderColor: null, shadow: null },
}

export default function SkillNode({ id, data }) {
  const updateNodeStatus = useStore((s) => s.updateNodeStatus)
  const selectedNodeId = useStore((s) => s.selectedNodeId)
  const isSelected = selectedNodeId === id
  const config = statusConfig[data.status] || statusConfig.pending
  const relationHighlight = relationHighlightConfig[data.relationHighlight || 'none']
  const isLocked = !data.unlocked
  const nodeTitle = data.title || data.label || 'New Skill'

  const borderColor = relationHighlight.borderColor || (isSelected ? '#818cf8' : config.borderColor)
  const primaryShadow = relationHighlight.shadow || 'none'
  const unlockShadow = data.status === 'completed'
    ? '0 0 16px 2px rgba(52,211,153,0.4)'
    : data.unlocked
      ? '0 0 16px 2px rgba(99,102,241,0.45)'
      : 'none'
  const boxShadow = [primaryShadow, unlockShadow].filter((shadow) => shadow !== 'none').join(', ') || 'none'

  return (
    <div style={{
      minWidth: 190, background: '#0f172a',
      border: `2px solid ${borderColor}`,
      borderRadius: 16,
      boxShadow,
      opacity: isLocked ? 0.5 : 1,
      cursor: 'pointer', transition: 'all 0.3s',
    }}>
      <Handle type="target" position={Position.Top}
        style={{ background: '#818cf8', border: '2px solid #4f46e5' }} />

      <div style={{ padding: '12px 16px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: config.textColor }}>{nodeTitle}</span>
        {isLocked && <span style={{ fontSize: 11, background: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: 999 }}>🔒</span>}
      </div>

      <div style={{ padding: '4px 16px 8px' }}>
        <span style={{ fontSize: 11, background: config.badgeBg, color: config.badgeColor, padding: '2px 10px', borderRadius: 999 }}>
          {config.label}
        </span>
      </div>

      {!isLocked && (
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['pending', 'in-progress', 'completed'].map((s) => (
            <button key={s}
              onClick={(e) => { e.stopPropagation(); updateNodeStatus(id, s) }}
              style={{
                fontSize: 12, padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${data.status === s ? '#6366f1' : '#334155'}`,
                background: data.status === s ? '#4f46e5' : '#1e293b',
                color: data.status === s ? '#fff' : '#94a3b8',
              }}>
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom}
        style={{ background: '#818cf8', border: '2px solid #4f46e5' }} />
    </div>
  )
}