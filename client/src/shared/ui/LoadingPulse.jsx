function LoadingPulse({ label = 'AI processing your data...' }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-200">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
        <span>{label}</span>
      </div>
      <div className="space-y-2">
        <div className="h-2 animate-pulse rounded bg-white/10" />
        <div className="h-2 animate-pulse rounded bg-white/10" />
        <div className="h-2 w-3/4 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  )
}

export default LoadingPulse