import { locales } from '@/i18n/config'
import {
  ogImageSize,
  ogImageContentType,
  ogImageAlt,
  renderOpengraphImage,
} from '@/lib/opengraph-image'

export const size = ogImageSize
export const contentType = ogImageContentType
export const alt = ogImageAlt

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return renderOpengraphImage(locale === 'ja' ? 'ja' : 'en')
}
