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
    if (!pathname) return
    NProgress.done()
  }, [pathname])

  return null
}