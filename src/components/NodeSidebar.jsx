import { useState, useEffect } from 'react'

const statusOptions = [
  { value: 'pending', label: 'Pending', chipClass: 'bg-slate-700 text-slate-200' },
  { value: 'in-progress', label: 'In Progress', chipClass: 'bg-amber-700/70 text-amber-100' },
  { value: 'completed', label: 'Completed', chipClass: 'bg-emerald-700/70 text-emerald-100' },
]

export default function NodeSidebar({ node, onClose, onUpdateNode, onUpdateStatus }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState([{ label: '', url: '' }])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (node) {
      setTitle(node.data?.title || node.data?.label || '')
      setDescription(node.data?.description || '')
      setLinks(node.data?.links?.length ? node.data.links : [{ label: '', url: '' }])
      setIsEditing(false)
    }
  }, [node])

  if (!node) return null

  const currentStatus = node.data?.status || 'pending'
  const isLocked = !node.data?.unlocked

  const handleCancel = () => {
    setTitle(node.data?.title || node.data?.label || '')
    setDescription(node.data?.description || '')
    setLinks(node.data?.links?.length ? node.data.links : [{ label: '', url: '' }])
    setIsEditing(false)
  }

  const updateLink = (index, field, value) => {
    setLinks((prev) => prev.map((link, idx) => (idx === index ? { ...link, [field]: value } : link)))
  }

  const addLink = () => {
    setLinks((prev) => [...prev, { label: '', url: '' }])
  }

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSave = () => {
    onUpdateNode(node.id, {
      title,
      label: title,
      description,
      links: links.filter((link) => link.url?.trim() || link.label?.trim()),
    })

    setIsEditing(false)
  }

  const activeStatusChip = statusOptions.find((status) => status.value === currentStatus)

  return (
    <aside
      className="fixed right-0 top-[54px] z-50 flex h-[calc(100vh-54px)] w-[360px] max-w-[90vw] flex-col border-l border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur"
      style={{ animation: 'slideInPanel 220ms ease-out' }}
    >
      <style>{`@keyframes slideInPanel { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <h3 className="m-0 text-base font-semibold text-slate-100">Skill Details</h3>
          <p className="mt-1 text-xs text-slate-400">Click edit to update this node</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          x
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-slate-300">
            {isLocked ? 'Locked' : 'Unlocked'}
          </span>
          {activeStatusChip && (
            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${activeStatusChip.chipClass}`}>
              {activeStatusChip.label}
            </span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditing}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-indigo-500 disabled:cursor-default disabled:opacity-70"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
            className="min-h-28 w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-500 disabled:cursor-default disabled:opacity-70"
          />
        </div>

        <div>
          <div className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Status
          </div>
          <div className="grid grid-cols-3 gap-2">
            {statusOptions.map((status) => {
              const isActive = currentStatus === status.value
              const isDisabled = isLocked && status.value !== 'pending'

              return (
                <button
                  key={status.value}
                  onClick={() => !isDisabled && onUpdateStatus(node.id, status.value)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-600 text-white'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                  } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {status.label}
                </button>
              )
            })}
          </div>
          {isLocked && (
            <p className="mt-2 text-xs text-amber-300">Complete prerequisite skills to unlock this node.</p>
          )}
        </div>

        <div>
          <div className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Resources
          </div>
          <div className="space-y-2">
            {links.map((link, index) => (
              <div key={`${index}-${link.url}`} className="flex items-center gap-2">
                <input
                  value={link.label || ''}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Label"
                  className="w-2/5 rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none transition focus:border-indigo-500 disabled:opacity-70"
                />
                <input
                  value={link.url || ''}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://..."
                  className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none transition focus:border-indigo-500 disabled:opacity-70"
                />
                {isEditing && (
                  <button
                    onClick={() => removeLink(index)}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-rose-300 transition hover:border-rose-400"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <button
              onClick={addLink}
              className="mt-2 w-full rounded-md border border-dashed border-slate-600 bg-slate-900 px-2 py-2 text-xs font-semibold text-indigo-300 transition hover:border-indigo-500"
            >
              + Add resource link
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-t border-slate-800 px-5 py-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </aside>
  )
}