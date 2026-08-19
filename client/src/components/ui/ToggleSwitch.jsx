function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-slate-200">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={[
          'relative h-6 w-11 rounded-full border transition',
          checked
            ? 'border-emerald-300/60 bg-emerald-300/20'
            : 'border-white/20 bg-white/5',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-all',
            checked ? 'left-6' : 'left-1',
          ].join(' ')}
        />
      </button>
    </label>
  )
}

export default ToggleSwitch