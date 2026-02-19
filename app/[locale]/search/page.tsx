import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { SearchContent } from './search-content'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata() {
  return { title: 'Search' }
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SearchContent />
}
