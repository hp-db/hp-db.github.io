import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Database, Network, FileText, History } from 'lucide-react'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AboutContent />
}

function AboutContent() {
  const t = useTranslations()

  const pathes: Record<string, string> = {
    Item: t('Item'),
    HieroglyphNo: t('Hieroglyph No'),
    HieraticNo: t('Hieratic No'),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 tracking-tight">{t('ユーザーズガイド')}</h1>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* Manual */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="w-4 h-4 text-primary" />
              {t('manual')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/manual/search" className="text-primary hover:underline">
                  {t('検索画面')}
                </Link>
              </li>
              <li>
                <Link href="/about/concordance-sources" className="text-primary hover:underline">
                  {t('csources_link')}
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Datasets & API */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="w-4 h-4 text-primary" />
              {t('datasets_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/datasets" className="text-primary hover:underline">
                  {t('datasets_title')}
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-primary hover:underline">
                  {t('api_title')}
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* LOD Vocabulary */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Network className="w-4 h-4 text-primary" />
              {t('lod_vocabulary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {Object.entries(pathes).map(([key, value]) => (
                <li key={key}>
                  <Link href={`/property/${key}`} className="text-primary hover:underline">
                    {value}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Policy */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-primary" />
              {t('policy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/manual/ga" className="text-primary hover:underline">
                  {t('ga_title')}
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Changelog */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="w-4 h-4 text-primary" />
              {t('changelog_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about/changelog" className="text-primary hover:underline">
                  {t('changelog_link')}
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const pageTitle = t('ユーザーズガイド')
  const siteName = 'Hieratische Paläographie DB'

  const description =
    locale === 'ja'
      ? 'ヒエラティック古書体学データベースの利用マニュアル。検索・絞り込み・IIIFビューアの使い方。'
      : 'User guide for the Hieratische Paläographie Database — how to search, filter, and use IIIF viewers.'

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `${base}/${locale}/about/`,
      languages: {
        'en': `${base}/en/about/`,
        'ja': `${base}/ja/about/`,
        'x-default': `${base}/en/about/`,
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
