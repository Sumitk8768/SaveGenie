import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Bolt, TrendingUp, Verified } from 'lucide-react'
import EmptyState from '../../shared/ui/EmptyState.jsx'
import GlassCard from '../../shared/ui/GlassCard.jsx'
import { analytics, sourceBreakdown } from '../../shared/data/mockData.js'
import { currency } from '../../shared/lib/format.js'

function AnalyticsPage() {
  const [showEmpty] = useState(false)

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-4 md:py-8 space-y-6 pb-20">
      
      {/* 1. Header Layout */}
      <section className="border-b border-white/[0.04] pb-4">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">
          Financial Intelligence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-ui font-light">
          Real-time optimization of your spending and savings velocity.
        </p>
      </section>

      {showEmpty ? (
        <EmptyState
          title="No analytics yet"
          message="Once transactions sync, saveGenie will build a full savings performance timeline."
        />
      ) : (
        <>
          {/* 2. Main Analytics Dash Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
            
            {/* Chart Module Line Graph */}
            <GlassCard className="h-80 md:col-span-6 lg:col-span-8 p-5 flex flex-col justify-between">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="font-ui text-xs uppercase tracking-[0.12em] text-zinc-400">Total saved this month</p>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#c0c1ff] mt-0.5">{currency(128)}</h3>
                </div>
                <p className="font-ui inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6ffbbe]">
                  <TrendingUp className="h-3.5 w-3.5" /> +12.4%
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#131316', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      itemStyle={{ color: '#e5e2e1', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="savings" stroke="#8083ff" strokeWidth={2.5} dot={{ fill: '#8083ff', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Source Breakdown Section */}
            <GlassCard className="md:col-span-6 lg:col-span-4 p-5 flex flex-col justify-between">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.12em] text-zinc-400">Source breakdown</p>
                <div className="mt-5 space-y-3.5">
                  {sourceBreakdown.map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-zinc-400 font-light">{item.label}</span>
                        <span className="text-white font-medium">{currency(item.value)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full ${item.color || 'bg-[#8083ff]'}`} style={{ width: `${item.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-[#8083ff]/10 bg-[#8083ff]/5 p-3.5 text-xs text-[#c0c1ff] leading-relaxed font-ui font-light">
                Grocery coupon scraping improved by 14% this month.
              </div>
            </GlassCard>

            {/* Optimization Speed Module */}
            <GlassCard className="md:col-span-2 lg:col-span-4 p-5 flex flex-col justify-between">
              <p className="font-ui inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                <Bolt className="h-3.5 w-3.5 text-[#6ffbbe]" /> Optimization speed
              </p>
              <div className="my-3">
                <p className="font-display text-4xl font-bold text-white">0.4s</p>
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Average time to find and apply valid promotional codes.</p>
            </GlassCard>

            {/* Verification Rate Module */}
            <GlassCard className="md:col-span-2 lg:col-span-4 p-5 flex flex-col justify-between">
              <p className="font-ui inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
                <Verified className="h-3.5 w-3.5 text-[#c0c1ff]" /> Verification rate
              </p>
              <div className="my-3">
                <p className="font-display text-4xl font-bold text-white">98.2%</p>
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Accuracy of discount validation across 400+ retailers.</p>
            </GlassCard>

            {/* Action Monitor Queue */}
            <GlassCard className="md:col-span-2 lg:col-span-4 p-5 flex flex-col justify-between text-center sm:text-left">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.12em] text-zinc-400">Auto-vault active</p>
                <h4 className="mt-2 font-display text-lg font-semibold text-white tracking-tight">12 transactions</h4>
                <p className="mt-1.5 text-xs text-zinc-400 font-light leading-relaxed">Your AI is actively monitoring pending transactions.</p>
              </div>
              <button className="font-ui mt-4 w-full rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] py-2 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer">
                View Queue
              </button>
            </GlassCard>
          </div>

          {/* 3. Bar Chart Module Stack */}
          <GlassCard className="h-72 p-5 flex flex-col">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 font-ui">Cashback vs rewards</p>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#4b5563" fontSize={11} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131316', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    itemStyle={{ color: '#e5e2e1', fontSize: '12px' }}
                  />
                  <Bar dataKey="cashback" fill="#8083ff" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="rewards" fill="#4edea3" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}

export default AnalyticsPage
