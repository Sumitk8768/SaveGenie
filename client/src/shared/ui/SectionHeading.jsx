function SectionHeading({ title, subtitle, actions = null }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl text-white sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  )
}

export default SectionHeading