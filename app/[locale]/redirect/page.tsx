import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { RedirectContent } from './redirect-content'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RedirectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <RedirectContent />
}
