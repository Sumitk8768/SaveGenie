import { motion } from 'framer-motion'

const dots = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 7.3) % 100}%`,
  top: `${(index * 11.9) % 100}%`,
  duration: 4 + (index % 5),
}))

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="grid-overlay absolute inset-0" />
      <div className="ai-orb left-[-10%] top-[8%] h-48 w-48 bg-emerald-300/40 sm:h-64 sm:w-64" />
      <div className="ai-orb right-[-8%] top-[20%] h-56 w-56 bg-violet-400/40 sm:h-72 sm:w-72" />
      <div className="ai-orb bottom-[-12%] left-[40%] h-56 w-56 bg-sky-400/30 sm:h-72 sm:w-72" />
      {dots.map((dot) => (
        <motion.span
          key={dot.id}
          className="absolute h-1 w-1 rounded-full bg-emerald-300/70"
          style={{ left: dot.left, top: dot.top }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground