import { useState } from 'react'

export function useCopyCoupon(timeout = 1800) {
  const [copiedId, setCopiedId] = useState(null)

  const copyCoupon = async (id, code) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    window.setTimeout(() => setCopiedId(null), timeout)
  }

  return { copiedId, copyCoupon }
}
