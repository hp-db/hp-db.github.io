'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface MiradorIframeProps {
  baseUrl: string
  title?: string
  height?: number
}

export function MiradorIframe({ baseUrl, title = 'Mirador IIIF Viewer', height = 350 }: MiradorIframeProps) {
  const { resolvedTheme } = useTheme()
  const [src, setSrc] = useState(baseUrl)

  useEffect(() => {
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.set('theme', resolvedTheme === 'dark' ? 'dark' : 'light')
    setSrc(url.toString())
  }, [baseUrl, resolvedTheme])

  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      allowFullScreen
      style={{ border: 0 }}
      title={title}
    />
  )
}
