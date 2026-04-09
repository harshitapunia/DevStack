export default function ProgressDashboard({ total, completed, unlocked, percentage }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/50 px-2.5 py-1.5 backdrop-blur">
      <div className="min-w-[52px]">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Nodes</p>
        <p className="text-xs font-bold text-slate-200">{completed}/{total}</p>
      </div>

      <div className="h-6 w-px bg-slate-700/60" />

      <div className="min-w-[50px]">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Open</p>
        <p className="text-xs font-bold text-emerald-300">{unlocked}</p>
      </div>

      <div className="h-6 w-px bg-slate-700/60" />

      <div className="min-w-[72px]">
        <div className="mb-0.5 flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Progress</p>
          <p className="text-[10px] font-bold text-indigo-300">{percentage}%</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
