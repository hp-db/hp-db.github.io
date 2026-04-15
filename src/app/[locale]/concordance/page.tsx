import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { ConcordanceContent } from './concordance-content'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const pageTitle = t('concordance_title')
  const siteName = 'Hieratische Paläographie DB'

  const description =
    locale === 'ja'
      ? 'メラー番号とガーディナー記号一覧、Unicode、JSesh、MdC、TSLなどエジプト学データベースとの対照表。'
      : 'Cross-reference table mapping Möller hieratic numbers to Gardiner Sign List, Unicode, JSesh, MdC, TSL, and other Egyptological databases.'

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `${base}/${locale}/concordance/`,
      languages: {
        'en': `${base}/en/concordance/`,
        'ja': `${base}/ja/concordance/`,
        'x-default': `${base}/en/concordance/`,
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

export default async function ConcordancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense>
      <ConcordanceContent />
    </Suspense>
  )
}
