import { motion } from 'framer-motion'
import { Clock4 } from 'lucide-react'
import GlassCard from '../../../shared/ui/GlassCard.jsx'

function DealCard({ deal }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{deal.merchant}</p>
            <h4 className="font-display mt-1 text-base text-white">{deal.title}</h4>
          </div>
          <span className="rounded-full bg-violet-400/20 px-2.5 py-1 text-xs text-violet-200">{deal.badge}</span>
        </div>
        <p className="text-sm text-slate-300">{deal.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock4 className="h-3.5 w-3.5" />
            Expires {deal.expiry}
          </span>
          <span className="rounded-full border border-emerald-300/30 px-2 py-1 text-emerald-300">{deal.status}</span>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default DealCard
