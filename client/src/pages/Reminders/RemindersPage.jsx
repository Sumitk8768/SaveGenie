import { BellOff, CalendarClock, CircleAlert, Clock3 } from 'lucide-react'
import { useState } from 'react'
import EmptyState from '../../components/shared/EmptyState.jsx'
import ToggleSwitch from '../../components/ui/ToggleSwitch.jsx'
import { reminderTimeline } from '../../data/mockData.js'

const toneStyles = {
  rose: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
  violet: 'text-[#c0c1ff] bg-[#8083ff]/10 border-[#8083ff]/20',
  mint: 'text-[#6ffbbe] bg-[#4edea3]/10 border-[#4edea3]/20',
  muted: 'text-zinc-400 bg-white/[0.03] border-white/5',
}

const toneIcon = {
  rose: CircleAlert,
  violet: CalendarClock,
  mint: Clock3,
  muted: Clock3,
}

function NotificationsPage() {
  const [empty, setEmpty] = useState(false)
  const [items, setItems] = useState(reminderTimeline)

  const updateToggle = (id, key, nextValue) => {
    setItems((previous) => previous.map((entry) => (entry.id === id ? { ...entry, [key]: nextValue } : entry)))
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-4 md:py-8 space-y-6">
      
      {/* Page Header Block */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-ui hidden sm:block">
            Smart reminders for coupons, cashback, and AI actions.
          </p>
        </div>
        <div className="shrink-0 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl flex items-center">
          <ToggleSwitch checked={empty} onChange={setEmpty} label="Show empty" />
        </div>
      </div>

      {empty ? (
        <EmptyState
          title="No notifications"
          message="You are fully caught up. saveGenie will alert you when new savings actions appear."
          icon={BellOff}
        />
      ) : (
        /* Responsive Grid Split Structure: Stacks on mobile, balances 7:5 on desktop frames */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COMPONENT: Primary Notifications Feed Timeline */}
          <div className="lg:col-span-7 relative space-y-4">
            
            {/* Vertical timeline path connector line (hidden on tiny viewports) */}
            <span className="absolute bottom-4 left-3 top-3 w-px bg-gradient-to-b from-[#8083ff]/30 via-zinc-800/50 to-transparent hidden sm:block" />
            
            {items.map((item) => {
              const Icon = toneIcon[item.tone] || Clock3
              return (
                <div key={item.id} className="relative sm:pl-9 transition-all">
                  {/* Glowing Node timeline bullet pointers */}
                  <span className="absolute left-[9px] top-6 hidden h-2 w-2 rounded-full bg-[#c0c1ff] shadow-[0_0_15px_rgba(128,131,255,0.8)] sm:block" />
                  
                  <div className="glass-card rounded-2xl p-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start bg-gradient-to-b from-white/[0.01] to-transparent shadow-xl hover:border-white/10 transition-colors">
                    <div className="flex-1 space-y-2">
                      <p className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] border ${toneStyles[item.tone] || toneStyles.muted}`}>
                        <Icon className="h-3 w-3 shrink-0" /> 
                        <span>{item.tag}</span>
                      </p>
                      <h3 className="font-display text-[15px] font-semibold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                        {item.text}
                      </p>
                    </div>

                    {/* Interactive Operational Toggles */}
                    <div className="grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-3 sm:border-t-0 sm:pt-0 shrink-0 sm:flex sm:flex-col sm:items-end sm:gap-2">
                      <div className="bg-[#0a0a0d]/40 border border-white/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-3 w-full sm:w-auto">
                        <ToggleSwitch checked={item.notify} onChange={(value) => updateToggle(item.id, 'notify', value)} label="Notify" />
                      </div>
                      <div className="bg-[#0a0a0d]/40 border border-white/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-3 w-full sm:w-auto">
                        <ToggleSwitch checked={item.auto} onChange={(value) => updateToggle(item.id, 'auto', value)} label="Auto" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* RIGHT COMPONENT: Contextual Desktop Sidebar Insights (Sticks perfectly during scrolling) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 hidden lg:block">
            <h2 className="font-display text-lg font-semibold text-white tracking-tight px-1">
              Channel Overview
            </h2>
            
            <div className="glass-card rounded-2xl p-5 space-y-4 bg-gradient-to-br from-white/[0.01] to-transparent shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-ui">Active Automations</span>
                <span className="text-xs font-bold text-[#6ffbbe] bg-[#4edea3]/10 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-ui font-light">
                saveGenie AI is actively tracking 4 critical merchant feeds. Real-time background sync is running smoothly.
              </p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-[#8083ff] to-[#4edea3] rounded-full" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-ui">
                <span>System Health</span>
                <span>85% Optimized</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default NotificationsPage
