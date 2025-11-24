'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRoot() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to users page by default
    router.push('/dashboard/users')
  }, [router])

  return null
}
