import { Link } from 'react-router-dom'
import { cn } from '../../utils/format.js'

function BrandLogo({ className = '' }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2', className)}>
      <img className="h-10 w-10 rounded-xl" src="/app-logo.svg" alt="saveGenie logo" />
      <span className="font-display text-5xl tracking-tight text-violet-200 sm:text-3xl">saveGenie</span>
    </Link>
  )
}

export default BrandLogo
