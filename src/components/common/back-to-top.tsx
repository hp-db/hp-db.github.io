'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BackToTop({ threshold = 400 }: { threshold?: number }) {
  const t = useTranslations()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const label = t('back_to_top')

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full',
        'bg-primary text-primary-foreground shadow-lg',
        'transition-all duration-200 hover:bg-primary/90 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2',
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
