import { motion } from 'framer-motion'
import { cn } from '../../utils/format.js'

function GradientButton({ children, className = '', variant = 'solid', ...props }) {
  const variantClasses =
    variant === 'ghost'
      ? 'bg-white/5 text-slate-100 ring-1 ring-white/20 hover:bg-white/10'
      : 'bg-gradient-to-r from-emerald-300 via-emerald-400 to-violet-400 text-slate-950 hover:opacity-90'

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
        variantClasses,
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default GradientButton
