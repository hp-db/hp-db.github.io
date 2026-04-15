'use client'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const twitterUrl = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  return (
    <span className="inline-flex items-center gap-2">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="X">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground hover:text-primary">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" title="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground hover:text-primary">
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z" />
        </svg>
      </a>
    </span>
  )
}
