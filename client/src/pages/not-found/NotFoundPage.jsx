import { Link } from 'react-router-dom'
import GradientButton from '../../shared/ui/GradientButton.jsx'

function NotFoundPage() {
  return (
    <div className="page-shell flex min-h-svh items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 text-center">
        <h1 className="font-display text-3xl text-white">404</h1>
        <p className="mt-2 text-sm text-slate-300">The page you requested is outside the savings universe.</p>
        <Link to="/dashboard" className="mt-5 inline-block">
          <GradientButton>Return to Dashboard</GradientButton>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
