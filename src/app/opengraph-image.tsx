import {
  ogImageSize,
  ogImageContentType,
  ogImageAlt,
  renderOpengraphImage,
} from '@/lib/opengraph-image'

export const size = ogImageSize
export const contentType = ogImageContentType
export const alt = ogImageAlt
export const dynamic = 'force-static'

export default async function OpengraphImage() {
  return renderOpengraphImage('en')
}
