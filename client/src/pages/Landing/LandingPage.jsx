import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="starfield relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0d] font-ui text-[#e5e2e1] antialiased flex flex-col justify-between items-center p-6 md:p-12">
      
      {/* Background Ambient AI Orb Glow - Derived from your CSS values */}
      <div className="ai-orb top-[10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[#8083ff]/20 to-[#4edea3]/10 pointer-events-none" />

      {/* 1. Header/Logo Section */}
      <header className="relative z-10 w-full flex justify-center items-center gap-2 pt-4">
        <img className="h-8 w-8 rounded-lg" src="/app-logo.svg" alt="saveGenie logo" />
        <span className="text-[17px] font-medium tracking-tight text-white font-display">
          saveGenie
        </span>
      </header>

      {/* 2. Floating Cards Visual Section */}
      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center mt-12 md:mt-20">
        <div className="relative w-full max-w-[550px] h-[140px] sm:h-[120px] flex items-start justify-center gap-4 px-4">
          
          {/* Active Scraping Card */}
          <motion.div
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="glass-card w-[175px] shrink-0 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {/* Custom 4-Point Star/Crosshair SVG Icon */}
              <svg className="h-4 w-4 text-[#c7c4d7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeLinecap="round"/>
              </svg>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#c7c4d7]">
                Active Scraping
              </p>
            </div>
            {/* Infinite Scanning/Loading Bar matching your brand colors */}
            <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/5 relative">
              <motion.div 
                className="absolute top-0 bottom-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-[#c0c1ff] to-transparent"
                animate={{
                  left: ["-100%", "100%"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>

          {/* Savings Outcome Card (Employs Mint Glow Styling) */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="glass-card mint-glow flex-1 max-w-[345px] rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#4edea3]/10 border border-[#4edea3]/30">
                <svg className="h-3 w-3 text-[#6ffbbe]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[14px] font-semibold text-[#6ffbbe] tracking-tight font-display">
                +$124.50
              </span>
            </div>
            <p className="mt-3 text-[11.5px] font-normal leading-[1.55] text-[#c7c4d7] tracking-normal">
              AI successfully applied 3 coupons at Checkout. Cashback pending verification.
            </p>
          </motion.div>
        </div>

        {/* 3. Hero Copy & Call To Action */}
        <div className="mt-14 text-center max-w-[540px] px-4">
          <h2 className="text-[36px] sm:text-[42px] font-semibold tracking-tight text-white leading-[1.12] font-display">
            Your AI <span className="font-[Cormorant_Garamond] italic font-medium text-[#c0c1ff]">Savings Sentinel.</span>
          </h2>

          <p className="mt-4 text-[14px] leading-relaxed text-[#c7c4d7] max-w-[450px] mx-auto opacity-95">
            saveGenie tracks coupons, cashback, and rewards across all your apps automatically. Experience financial optimization without the effort.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4.5">
            <Link to="/signup">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e5e2e1] px-7 py-3 text-[13px] font-semibold text-[#0a0a0d] transition-all active:scale-[0.97] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer">
                Get Started
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </Link>
            
            <p className="text-[11px] text-zinc-500 tracking-wide font-normal">
              Join 50,000+ users saving effortlessly
            </p>
          </div>
        </div>
      </main>

      {/* 4. Footer Links Section */}
      <footer className="relative z-10 w-full max-w-md flex justify-center gap-8 pt-16 pb-4 text-[9px] font-bold tracking-[0.14em] uppercase text-zinc-600">
        <Link to="/" className="hover:text-[#e5e2e1] transition-colors">Privacy Protocol</Link>
        <Link to="/" className="hover:text-[#e5e2e1] transition-colors">Neural Security</Link>
        <Link to="/" className="hover:text-[#e5e2e1] transition-colors">Terms of Service</Link>
      </footer>
    </div>
  );
}

export default LandingPage;
