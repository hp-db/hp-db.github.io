import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { ApiContent } from './api-content'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const pageTitle = t('api_title')
  const siteName = 'Hieratische Paläographie DB'

  const description =
    locale === 'ja'
      ? 'ヒエラティック古書体学データベースのSPARQLエンドポイントとLinked Data API。w3id.org/hpdb URIでJSON-LDとして取得可能。'
      : 'SPARQL endpoint and Linked Data API for the Hieratische Paläographie Database. All items available as JSON-LD via w3id.org/hpdb URIs.'

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `${base}/${locale}/api/`,
      languages: {
        'en': `${base}/en/api/`,
        'ja': `${base}/ja/api/`,
        'x-default': `${base}/en/api/`,
      },
    },
    openGraph: {
      title: `${pageTitle} - ${siteName}`,
      description,
      type: 'website',
      images: [{ url: '/img/ogp/ogp.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} - ${siteName}`,
      description,
    },
  }
}

export default async function ApiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ApiContent />
}
