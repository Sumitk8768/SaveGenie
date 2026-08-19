import { Link, useNavigate } from 'react-router-dom'
import GradientButton from '../../components/ui/GradientButton.jsx'

function SignupPage() {
  const navigate = useNavigate()

  return (
    <div className="starfield relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0d] font-ui text-[#e5e2e1] antialiased flex flex-col justify-between items-center p-6 md:p-12">
      
      {/* Background Ambient AI Orb Glow */}
      <div className="ai-orb top-[15%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-gradient-to-tr from-[#8083ff]/15 to-[#4edea3]/5 pointer-events-none" />

      {/* 1. Header/Logo Section */}
      <header className="relative z-10 w-full flex justify-center items-center gap-2 pt-4">
        <img className="h-8 w-8 rounded-lg" src="/app-logo.svg" alt="saveGenie logo" />
        <span className="text-[17px] font-medium tracking-tight text-white font-display">
          saveGenie
        </span>
      </header>

      {/* 2. Main Signup Card Container */}
      <main className="relative z-10 w-full max-w-[420px] flex flex-col items-center mt-8 mb-auto">
        <div className="glass-card w-full rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
            Create saveGenie account
          </h1>
          <p className="mt-2 text-sm text-[#c7c4d7] opacity-90">
            Start syncing your coupons, rewards, and cashback feeds.
          </p>

          {/* Form Controls */}
          <form className="mt-6 space-y-3.5" onSubmit={(event) => event.preventDefault()}>
            <input 
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8083ff]/40 transition-colors" 
              placeholder="Full name" 
              type="text"
            />
            <input 
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8083ff]/40 transition-colors" 
              placeholder="Email" 
              type="email"
            />
            <input 
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8083ff]/40 transition-colors" 
              placeholder="Password" 
              type="password" 
            />
            
            <GradientButton 
              className="w-full mt-2 cursor-pointer" 
              onClick={() => navigate('/otp')}
            >
              Continue
            </GradientButton>
          </form>

          {/* Bottom redirection hook */}
          <p className="mt-6 text-center text-xs text-[#c7c4d7]">
            Already registered?{' '}
            <Link className="text-[#6ffbbe] hover:underline font-medium ml-1" to="/login">
              Login
            </Link>
          </p>

        </div>
      </main>

      {/* 3. Integrated Footer Links */}
      <footer className="relative z-10 w-full max-w-md flex justify-center gap-8 pt-12 pb-4 text-[9px] font-bold tracking-[0.14em] uppercase text-zinc-600">
        <Link to="/" className="hover:text-[#e5e2e1] transition-colors">Privacy Protocol</Link>
        <Link to="/" className="hover:text-[#e5e2e1] transition-colors">Neural Security</Link>
        <Link to="/" className="hover:text-[#e5e2e1] transition-colors">Terms of Service</Link>
      </footer>

    </div>
  )
}

export default SignupPage
