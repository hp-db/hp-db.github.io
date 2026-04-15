'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useEffect, Suspense } from 'react'

function RedirectInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const p = searchParams?.get('p')
    if (!p) {
      router.push('/')
    } else {
      const redirectPath = '/' + p.replace(/^\//, '')
      router.push(redirectPath)
    }
  }, [searchParams, router])

  return null
}

export function RedirectContent() {
  return (
    <Suspense>
      <RedirectInner />
    </Suspense>
  )
}
