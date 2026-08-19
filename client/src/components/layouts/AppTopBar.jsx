import { Bell } from 'lucide-react'

function AppTopBar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <img className="h-9 w-9 rounded-xl" src="/app-logo.svg" alt="saveGenie logo" />
        <span className="font-display text-4xl text-violet-200 sm:text-3xl">saveGenie</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" type="button" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" />
        </button>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/35 bg-linear-to-br from-slate-900 to-slate-800 text-[10px] text-violet-200">
          AV
        </span>
      </div>
    </header>
  )
}

export default AppTopBar
