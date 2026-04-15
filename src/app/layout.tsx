import type { Metadata } from 'next'
import './globals.css'

const siteName = 'Hieratische Paläographie DB'
const siteDesc =
  "This is a retrieval system for hieratic scripts; it uses IIIF format images (owned by the Asian Research Library of the University of Tokyo) of Georg Möller's Hieratische Paläographie (1909–36)."
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description: siteDesc,
  keywords: 'IIIF, Hieratic, Hieroglyph',
  openGraph: {
    siteName,
    type: 'website',
    title: siteName,
    description: siteDesc,
    url: `${baseUrl}/`,
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: [
    { rel: 'icon', sizes: '16x16', type: 'image/png', url: '/img/icons/favicon-16.png' },
    { rel: 'icon', sizes: '32x32', type: 'image/png', url: '/img/icons/favicon-32.png' },
    { rel: 'icon', sizes: '48x48', type: 'image/png', url: '/img/icons/favicon-48.png' },
    { rel: 'icon', sizes: '72x72', type: 'image/png', url: '/img/icons/favicon-72.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/img/icons/apple-touch-icon.png' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
