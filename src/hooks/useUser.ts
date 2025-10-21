'use client'

import { UsuarioPayload } from '@/types/usuario'
import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState<UsuarioPayload | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user ?? null))
  }, [])

  return user
}