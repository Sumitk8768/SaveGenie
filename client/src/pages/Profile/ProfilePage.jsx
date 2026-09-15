import { CreditCard, Link2, SlidersHorizontal } from 'lucide-react'
import GlassCard from '../../shared/ui/GlassCard.jsx'
import SectionHeading from '../../shared/ui/SectionHeading.jsx'
import ToggleSwitch from '../../shared/ui/ToggleSwitch.jsx'
import { useAppContext } from '../../app/providers/AppContext.js'

function ProfilePage() {
  const { notifyDeals, setNotifyDeals, autoOptimize, setAutoOptimize } = useAppContext()

  return (
    <div className="space-y-4">
      <SectionHeading title="Profile & Preferences" subtitle="Manage connected apps, settings, and achievements." />

      <GlassCard>
        <h3 className="font-display text-white">Savings achievements</h3>
        <p className="mt-2 text-sm text-slate-300">Level 4 Saver. You have unlocked 14 AI-optimized wins this month.</p>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="font-display text-white">Connected apps</h3>
        <p className="inline-flex items-center gap-2 text-sm text-slate-300">
          <Link2 className="h-4 w-4 text-emerald-300" /> Apple Wallet, PayPal, Chase
        </p>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="font-display text-white">AI preferences</h3>
        <ToggleSwitch checked={autoOptimize} onChange={setAutoOptimize} label="Enable auto coupon optimization" />
        <ToggleSwitch checked={notifyDeals} onChange={setNotifyDeals} label="Allow proactive deal notifications" />
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="font-display text-white">Payment methods</h3>
        <p className="inline-flex items-center gap-2 text-sm text-slate-300">
          <CreditCard className="h-4 w-4 text-violet-300" /> 2 cards connected and optimized
        </p>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="font-display text-white">Account settings</h3>
        <p className="inline-flex items-center gap-2 text-sm text-slate-300">
          <SlidersHorizontal className="h-4 w-4 text-emerald-300" /> Privacy, export data, billing
        </p>
      </GlassCard>
    </div>
  )
}

export default ProfilePage
