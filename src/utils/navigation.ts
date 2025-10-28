'use client'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'

export function useNavigate() {
  const router = useRouter()

  const push = (url: string) => {
    NProgress.start()
    router.push(url)
  }

  const replace = (url: string) => {
    NProgress.start()
    router.replace(url)
  }

  return { push, replace }
}