'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import '@/styles/nprogress.css'

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  speed: 400,
  minimum: 0.15,
})

export default function NProgressClient() {
  const pathname = usePathname()

  useEffect(() => {
    console.log('[NProgress] pathname changed:', pathname)
    if (!pathname) return

    // Inicia a barra imediatamente
    NProgress.start()

    // Finaliza a barra com um pequeno atraso
    const timer = setTimeout(() => {
      NProgress.done()
    }, 600)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}