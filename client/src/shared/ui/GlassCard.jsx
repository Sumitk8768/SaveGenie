import { cn } from '../lib/format.js'

function GlassCard({ children, className = '' }) {
  return <div className={cn('glass-card rounded-2xl p-4 sm:p-5', className)}>{children}</div>
}

export default GlassCard
