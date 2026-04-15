import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'
import { locales } from '@/i18n/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Hieratische Paläographie DB'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
  // Omit User-Agent so Google Fonts returns TTF (satori cannot parse woff2).
  const cssRes = await fetch(url)
  const css = await cssRes.text()
  const match = css.match(/src:\s*url\(([^)]+)\)(?:\s*format\('(?:opentype|truetype)'\))?/)
  if (!match) throw new Error(`Failed to parse font CSS for ${family} @ ${weight}`)
  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error(`Failed to fetch font for ${family} @ ${weight}`)
  return fontRes.arrayBuffer()
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const title = 'Hieratische Paläographie DB'
  const subtitle =
    locale === 'ja'
      ? 'ゲオルク・メラー『ヒエラティック古書体学』（1909–36）ヒエラティック字形検索システム'
      : "A Retrieval System for Hieratic Scripts from Georg Möller's Hieratische Paläographie (1909–36)"
  const siteUrl = 'moeller.jinsha.tsukuba.ac.jp'

  const allText = title + subtitle + siteUrl
  const [bold, regular] = await Promise.all([
    loadGoogleFont('Noto Sans JP', 700, allText),
    loadGoogleFont('Noto Sans JP', 400, allText),
  ])

  const imgPath = path.join(process.cwd(), 'public/img/ogp/home.jpg')
  const bgSrc = `data:image/jpeg;base64,${readFileSync(imgPath).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'NotoSansJP',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          alt=""
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(4,47,46,0.92) 0%, rgba(17,94,89,0.82) 55%, rgba(15,118,110,0.65) 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            color: 'white',
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 28,
              textShadow: '0 2px 12px rgba(0,0,0,0.35)',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: locale === 'ja' ? 30 : 32,
              fontWeight: 400,
              color: 'rgba(204,251,241,0.95)',
              maxWidth: 980,
              lineHeight: 1.45,
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              marginTop: 56,
              fontSize: 24,
              color: 'rgba(204,251,241,0.85)',
              letterSpacing: '0.02em',
            }}
          >
            {siteUrl}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'NotoSansJP', data: bold, weight: 700, style: 'normal' },
        { name: 'NotoSansJP', data: regular, weight: 400, style: 'normal' },
      ],
    },
  )
}
