import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ManualGaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ManualGaContent />
}

function ManualGaContent() {
  const t = useTranslations()

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">{t('ga_title')}</h1>

      <p>{t('ga_description')}</p>

      <ul className="list-disc pl-6 space-y-2 mt-4">
        <li>
          <a href="https://www.google.com/analytics/terms/jp.html">
            {t('ga_terms')}
          </a>
        </li>
        <li>
          <a href="https://policies.google.com/privacy">
            {t('ga_privacy')}
          </a>
        </li>
        <li>
          <a href="https://tools.google.com/dlpage/gaoptout">
            {t('ga_optout')}
          </a>
        </li>
      </ul>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale === 'ja') {
    return { title: 'Googleアナリティクスからの情報取得について' }
  }
  return { title: 'About Google Analytics Data Collection' }
}
