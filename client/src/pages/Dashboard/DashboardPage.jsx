import { useState } from 'react';
import { 
  Sparkles, Bell, ArrowUpRight, ShieldCheck, Zap, 
  CreditCard, PiggyBank, Clock, RefreshCw, CheckSquare, 
  Scan, Copy, ChevronRight 
} from 'lucide-react';

const RECOMMENDATIONS = [
  { id: 1, type: 'card', icon: <CreditCard className="h-4 w-4 text-purple-300" />, title: 'Best Card to Use', text: 'Use HDFC Millennia for Swiggy today to get 5% additional cashback.' },
  { id: 2, type: 'cashback', icon: <PiggyBank className="h-4 w-4 text-emerald-300" />, title: 'Hidden Cashback', text: 'Unlock ₹120 by splitting your Amazon bill into two transactions.' }
];

const VAULT_COUPONS = [
  { id: 1, code: 'saveGenie150', discount: '₹150 OFF', condition: 'Min. Order ₹499 • Swiggy', tag: 'VERIFIED', icon: '🍕', accent: 'border-l-orange-500' },
  { id: 2, code: 'AMZTECH10', discount: '10% OFF', condition: 'Fashion & Apparel • Amazon', tag: 'TRENDING', icon: '🛍️', accent: 'border-l-yellow-500' }
];

const REMINDERS = [
  { id: 1, title: 'Expiring Tonight', detail: 'Flipkart SuperCoins (50)', icon: <Clock className="h-4 w-4 text-rose-400" />, bg: 'bg-rose-500/5' },
  { id: 2, title: 'Netflix Renewal', detail: 'Due in 2 days • ₹499', icon: <RefreshCw className="h-4 w-4 text-indigo-400" />, bg: 'bg-indigo-500/5' },
  { id: 3, title: 'Rent Paid', detail: 'Completed Jan 1st', icon: <CheckSquare className="h-4 w-4 text-zinc-400" />, bg: 'bg-zinc-800/20' }
];

function AnalyticsDashboard() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-4 md:py-8 space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-display text-xl font-bold tracking-tight text-white">saveGenie AI Insights</span>
        </div>
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
          <Bell className="h-5 w-5 text-zinc-400" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-purple-400" />
        </button>
      </div>

      {/* CORE TWO-COLUMN RESPONSIIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: HERO CARD & METRICS BLOCKS */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* AI OPTIMIZER HERO CONTAINER */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-indigo-950/10 via-transparent to-transparent">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-[9px] font-bold uppercase tracking-widest text-indigo-300">
              <Sparkles className="h-3 w-3" /> AI Optimizer Active
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-white mt-4 tracking-tight">
              Good evening 👋 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400">You could save ₹480 this weekend.</span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-md font-light leading-relaxed">
              We've identified 3 unused coupons for your favorite stores that expire in 48 hours.
            </p>
            
            <button className="mt-5 px-6 py-2.5 rounded-xl bg-indigo-400/20 hover:bg-indigo-400/30 text-indigo-200 border border-indigo-400/30 font-medium text-xs tracking-wide transition-all active:scale-[0.98] cursor-pointer">
              Optimize Now
            </button>
          </div>

          {/* TRI-METRIC DATAGRID CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Saved</span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">+12% <ArrowUpRight className="h-2.5 w-2.5" /></span>
                </div>
                <p className="text-xl font-bold text-white tracking-tight mt-1">₹12,450</p>
              </div>
              <p className="text-[10px] text-zinc-500 font-light">Lifetime savings via saveGenie AI</p>
            </div>

            <div className="glass-card rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active Offers</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-600" />
                </div>
                <p className="text-xl font-bold text-white tracking-tight mt-1">24</p>
              </div>
              <p className="text-[10px] text-zinc-500 font-light">Ready to use across 8 categories</p>
            </div>

            <div className="glass-card rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Pending Cashback</span>
                  <span className="text-[9px] font-semibold tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">ETA 3d</span>
                </div>
                <p className="text-xl font-bold text-white tracking-tight mt-1">₹840.00</p>
              </div>
              <p className="text-[10px] text-zinc-500 font-light">Processing from Amazon & Flipkart</p>
            </div>
          </div>

          {/* SMART SUGGESTION BLOCKS FEED */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 px-1">
              <Zap className="h-3.5 w-3.5 text-indigo-400" /> Smart Recommendations
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECOMMENDATIONS.map((item) => (
                <div key={item.id} className="glass-card rounded-xl p-4 flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-white tracking-tight">{item.title}</h4>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VAULT SWIPER, CHART, SUBSCRIPTIONS */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* HORIZONTAL COUPON VAULT HIGHLIGHTER CONTAINER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-semibold text-zinc-400">Coupon Vault</span>
              <button className="text-indigo-400 flex items-center hover:underline cursor-pointer font-medium text-[11px]">
                VIEW ALL <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {VAULT_COUPONS.map((coupon) => (
                <div key={coupon.id} className={`w-[240px] shrink-0 glass-card rounded-xl border-l-2 ${coupon.accent} p-3.5 flex flex-col justify-between space-y-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2">
                      <span className="text-lg shrink-0">{coupon.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{coupon.discount}</h4>
                        <p className="text-[10px] text-zinc-400 font-light whitespace-nowrap mt-0.5">{coupon.condition}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase">{coupon.tag}</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg p-1.5 pl-2.5">
                    <code className="text-[10px] font-mono tracking-wider text-zinc-300">{coupon.code}</code>
                    <button 
                      onClick={() => handleCopy(coupon.id, coupon.code)}
                      className="p-1.5 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === coupon.id ? (
                        <span className="text-[9px] font-bold text-emerald-400 font-ui tracking-tight px-1">Copied</span>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SPENDING BAR VISUAL & SYSTEM SUMMARY */}
          <div className="glass-card rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-ui">
              <span className="font-semibold text-white">AI Spending Insight</span>
              <span className="text-zinc-500 text-[11px]">Last 30 Days</span>
            </div>
            
            {/* HISTOGRAM BAR ARRAY */}
            <div className="h-28 flex items-end justify-between gap-1.5 px-2 relative pt-4">
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md tracking-wider uppercase border border-purple-500/20 shadow-lg">Shopping Peak</span>
              <div className="h-[55%] w-full bg-zinc-800 rounded-sm" />
              <div className="h-[75%] w-full bg-zinc-800 rounded-sm" />
              <div className="h-[40%] w-full bg-zinc-800 rounded-sm" />
              <div className="h-[90%] w-full bg-indigo-500/40 rounded-sm relative border-t border-t-indigo-400" />
              <div className="h-[60%] w-full bg-zinc-800 rounded-sm" />
              <div className="h-[100%] w-full bg-indigo-500/40 rounded-sm relative border-t border-t-indigo-400" />
              <div className="h-[25%] w-full bg-emerald-500/30 rounded-sm" />
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex gap-2.5 items-start">
              <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-1.5" />
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                "Your weekend food spends are 20% higher than average. Switching to <strong className="text-white font-medium">Zomato Gold</strong> could save you an estimated <span className="text-emerald-400 font-medium">₹1,200</span> over the next quarter."
              </p>
            </div>
          </div>

          {/* LIST BASED SYSTEM EXPIRY TRACKER */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-zinc-400 px-1">Reminders</span>
            <div className="space-y-1.5">
              {REMINDERS.map((reminder) => (
                <div key={reminder.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${reminder.bg} shrink-0`}>
                      {reminder.icon}
                    </div>
                    <div className="font-ui">
                      <h4 className="text-xs font-semibold text-white tracking-tight">{reminder.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-light">{reminder.detail}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-[10px] font-bold text-zinc-400 tracking-wider uppercase transition-colors font-ui cursor-pointer">
              Manage Subscriptions
            </button>
          </div>

          {/* OCR RECEIPT DOTTED Uploader CARD */}
          <div className="rounded-2xl border border-dashed border-white/10 p-5 flex items-center justify-between gap-4 bg-gradient-to-r from-white/[0.01] to-transparent">
            <div className="flex gap-3.5 items-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Scan className="h-5 w-5" />
              </div>
              <div className="font-ui">
                <h4 className="text-xs font-semibold text-white tracking-tight">Scan for Savings</h4>
                <p className="text-[10px] text-zinc-400 font-light leading-normal mt-0.5 max-w-[180px]">Upload physical receipts and let AI find missing cashback.</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-[10px] tracking-wider uppercase transition-all active:scale-95 cursor-pointer shrink-0 shadow-lg">
              Upload Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AnalyticsDashboard;