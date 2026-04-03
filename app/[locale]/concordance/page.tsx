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
  return { title: t('concordance_title') }
}

export default async function ConcordancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ConcordanceContent />
}
