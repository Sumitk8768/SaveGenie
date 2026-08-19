import { Bot } from 'lucide-react'

function FloatingAssistant() {
  return (
    <button
      className="fixed bottom-24 right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-xl backdrop-blur"
      type="button"
    >
      <Bot className="h-5 w-5" />
    </button>
  )
}

export default FloatingAssistant
