const formatDate = (iso) => {
  if (!iso) return 'No date'
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return 'No date'
  }
}

export default function RoadmapLibrary({
  roadmaps,
  onCreateRoadmap,
  onOpenRoadmap,
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">DevStakes</p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Saved Learning Roadmaps</h1>
            <p className="mt-1 text-sm text-slate-400">
              Save your complete graph as a card and reopen it anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateRoadmap}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.02]"
            >
              + New Roadmap
            </button>
          </div>
        </header>

        {roadmaps.length === 0 ? (
          <div className="flex min-h-[48vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 text-center">
            <h2 className="text-xl font-semibold text-slate-100">No roadmaps saved yet</h2>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Open the editor, build your skill tree, then click Save. It will appear here as a card.
            </p>
            <button
              onClick={onCreateRoadmap}
              className="mt-6 rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-200 transition hover:border-indigo-300"
            >
              Start Building
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((roadmap) => (
              <button
                key={roadmap.id}
                onClick={() => onOpenRoadmap(roadmap.id)}
                className="group rounded-2xl border border-slate-800 bg-slate-900/75 p-5 text-left shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-indigo-500/70"
              >
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">Roadmap</p>
                <h3 className="line-clamp-2 text-lg font-semibold text-slate-100">
                  {roadmap.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">
                  {roadmap.summary || 'Structured skill roadmap with connected milestones and progress tracking.'}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Total Skills</span>
                    <span className="font-semibold">{roadmap.stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <span className="font-semibold text-emerald-300">{roadmap.stats.completed}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-semibold text-indigo-300">{roadmap.stats.percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                      style={{ width: `${roadmap.stats.percentage}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">Updated {formatDate(roadmap.updatedAt)}</p>
                <p className="mt-2 text-xs font-medium text-indigo-300 opacity-90 transition group-hover:opacity-100">
                  Open roadmap →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
