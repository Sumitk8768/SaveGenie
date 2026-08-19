import { motion } from 'framer-motion'

function EmptyState({ title, message, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-8 text-center"
    >
      {Icon ? (
        <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <Icon className="h-5 w-5 text-emerald-300" />
        </div>
      ) : null}
      <h3 className="font-display text-lg text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">{message}</p>
    </motion.div>
  )
}

export default EmptyState