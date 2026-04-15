import { setRequestLocale } from 'next-intl/server'
import { facetOptions } from '@/lib/facet-options'
import { CategoryContent } from './category-content'

function slugify(key: string) {
  return key.replace(/\//g, '-').replace(/ /g, '_')
}

function unslugify(slug: string) {
  return decodeURIComponent(slug).replace(/_/g, ' ').replace(/-/g, '/')
}

export function generateStaticParams() {
  return Object.keys(facetOptions).map((key) => ({
    id: slugify(key),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params
  return { title: `Category: ${unslugify(id)}` }
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CategoryContent />
}
