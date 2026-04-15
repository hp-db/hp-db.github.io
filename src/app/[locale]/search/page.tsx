import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { SearchContent } from './search-content'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const pageTitle = t('search')
  const siteName = 'Hieratische Paläographie DB'

  const description =
    locale === 'ja'
      ? 'メラー番号、ガーディナーコード、音価・語で字形を検索。巻・カテゴリ・種別による絞り込みも可能。'
      : 'Search hieratic signs by Möller number, Gardiner code, phonetic value, or keyword. Browse by category, volume, and type.'

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `${base}/${locale}/search/`,
      languages: {
        'en': `${base}/en/search/`,
        'ja': `${base}/ja/search/`,
        'x-default': `${base}/en/search/`,
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

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SearchContent />
}
