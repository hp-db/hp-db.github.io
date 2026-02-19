import { setRequestLocale } from 'next-intl/server'
import { facetOptions } from '@/lib/facet-options'
import { CategoryContent } from './category-content'

export function generateStaticParams() {
  return Object.keys(facetOptions).map((key) => ({
    id: key.replace('/', '-'),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params
  return { title: `Category: ${decodeURIComponent(id).replace('-', '/')}` }
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CategoryContent />
}
