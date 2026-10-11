'use client'

import { useEffect, useState } from 'react'

export default function RegisterSW() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    const updateOnline = () => setIsOffline(!navigator.onLine)
    updateOnline()
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)

    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    }
  }, [])

  return isOffline ? (
    <div className="fixed top-3 right-3 z-[100] flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-md border border-amber-300">
      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      Mode Offline
    </div>
  ) : null
}
