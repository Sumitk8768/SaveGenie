import { useNavigate } from 'react-router-dom'
import GradientButton from '../../shared/ui/GradientButton.jsx'

function OtpVerificationPage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="font-display text-2xl text-white">Verify your account</h1>
      <p className="mt-2 text-sm text-slate-300">Enter the 6-digit OTP sent to your inbox.</p>
      <div className="mt-6 flex items-center justify-between gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            className="h-12 w-full rounded-xl border border-white/15 bg-white/5 text-center text-lg"
            maxLength={1}
          />
        ))}
      </div>
      <GradientButton className="mt-6 w-full" onClick={() => navigate('/dashboard')}>
        Verify and Enter
      </GradientButton>
    </div>
  )
}

export default OtpVerificationPage
