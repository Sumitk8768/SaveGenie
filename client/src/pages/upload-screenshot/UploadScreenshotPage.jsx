import { Flashlight, ImagePlus, Scan, X } from 'lucide-react'
import { useMemo, useState } from 'react'

function UploadScreenshotPage() {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  const onSelectFile = (event) => {
    const nextFile = event.target.files?.[0]
    if (!nextFile) return
    setFile(nextFile)
    setIsProcessing(true)
  }

  const defaultPreview =
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="relative min-h-svh overflow-hidden pb-8">
      <header className="font-ui fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-black/45 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button aria-label="Close" className="text-slate-300">
            <X className="h-6 w-6" />
          </button>
          <img className="h-10 w-10 rounded-xl" src="/app-logo.svg" alt="saveGenie logo" />
          <h1 className="font-display text-5xl text-violet-200">saveGenie</h1>
        </div>
        <p className="font-ui inline-flex items-center gap-2 text-[1.7rem] text-emerald-300">
          <Flashlight className="h-5 w-5" /> AI READY
        </p>
      </header>

      <div className="fixed left-0 right-0 top-16 h-1 bg-white/10">
        <div className="h-full w-[65%] bg-violet-200 shadow-[0_0_20px_rgba(192,193,255,0.6)]" />
      </div>

      <main className="mx-auto px-6 pt-24 md:max-w-md md:pt-26">
        <label className="relative mx-auto block aspect-3/4 w-full max-w-md overflow-hidden rounded-[44px] border border-violet-300/25 bg-black/40">
          <img src={preview || defaultPreview} alt="Receipt scan" className="h-full w-full object-cover opacity-55 blur-[1px]" />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/40" />

          <div className="absolute inset-7 rounded-[28px] border border-violet-300/45" />
          <div className="absolute left-8 top-8 h-10 w-10 border-l-2 border-t-2 border-violet-200" />
          <div className="absolute right-8 top-8 h-10 w-10 border-r-2 border-t-2 border-violet-200" />
          <div className="absolute bottom-8 left-8 h-10 w-10 border-b-2 border-l-2 border-violet-200" />
          <div className="absolute bottom-8 right-8 h-10 w-10 border-b-2 border-r-2 border-violet-200" />

          {isProcessing ? (
            <>
              <span className="absolute left-0 top-[26%] h-0.5 w-full animate-pulse bg-linear-to-r from-transparent via-violet-300 to-transparent" />
              <span className="absolute left-[18%] top-[32%] h-10 w-[64%] border border-emerald-300/70 bg-emerald-300/10" />
              <span className="absolute left-[24%] top-[61%] h-12 w-[52%] border border-emerald-300/70 bg-emerald-300/10" />
            </>
          ) : null}

          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/45 bg-white/5 p-7">
            <Scan className="h-8 w-8 text-violet-200" />
          </div>

          <div className="absolute bottom-10 left-0 right-0 px-8 text-center">
            <p className="font-display text-[3rem] text-slate-100">Analyzing savings...</p>
            <p className="mt-2 text-[1.9rem] leading-tight text-slate-300">
              Snap a receipt or coupon screenshot. Our AI is extracting discounts and verifying price drops in real-time.
            </p>
          </div>

          <input className="hidden" type="file" accept="image/*" onChange={onSelectFile} />
        </label>
      </main>

      <div className="fixed bottom-8 left-1/2 z-40 flex w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 items-center justify-between">
        <label className="inline-flex h-18 w-18 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300">
          <ImagePlus className="h-7 w-7" />
          <input className="hidden" type="file" accept="image/*" onChange={onSelectFile} />
        </label>

        <button className="relative inline-flex h-26 w-26 items-center justify-center rounded-full border-4 border-violet-200 bg-white">
          <span className="h-20 w-20 rounded-full border-2 border-slate-900" />
        </button>

        <button className="inline-flex h-18 w-18 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300">
          <Flashlight className="h-7 w-7" />
        </button>
      </div>
    </div>
  )
}

export default UploadScreenshotPage
