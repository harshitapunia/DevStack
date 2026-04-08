export default function ProgressDashboard({ total, completed, unlocked, percentage }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-2 py-2 shadow-lg shadow-black/20 backdrop-blur md:gap-3 md:px-3">
      <div className="min-w-16 md:min-w-20">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">Nodes</p>
        <p className="text-xs font-semibold text-slate-100 md:text-sm">{completed}/{total}</p>
      </div>

      <div className="h-8 w-px bg-slate-700/80" />

      <div className="min-w-14 md:min-w-20">
        <p className="text-[10px] uppercase tracking-wider text-slate-400">Unlocked</p>
        <p className="text-xs font-semibold text-emerald-300 md:text-sm">{unlocked}</p>
      </div>

      <div className="h-8 w-px bg-slate-700/80" />

      <div className="min-w-20 md:min-w-24">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Progress</p>
          <p className="text-xs font-semibold text-indigo-300">{percentage}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
