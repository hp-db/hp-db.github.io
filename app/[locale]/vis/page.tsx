import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import fs from 'fs'
import path from 'path'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface CurationMember {
  label: string
  '@id': string
  manifest?: string
  metadata: { label: string; value: string | string[] }[]
}

interface CurationSelection {
  within: { '@id': string }
  members: CurationMember[]
}

interface CurationData {
  selections: CurationSelection[]
}

function computeStats() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'curation_old.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data: CurationData = JSON.parse(raw)

  const manifests: string[] = []
  const members: CurationMember[] = []
  const hieratics: Record<string, number> = {}
  const hieroglyphs: Record<string, number> = {}

  for (const selection of data.selections) {
    const manifest = selection.within['@id']
    manifests.push(manifest)

    for (const member of selection.members) {
      member.manifest = manifest
      members.push(member)

      const metadataObj: Record<string, string[]> = {}
      for (const m of member.metadata) {
        const values = Array.isArray(m.value)
          ? m.value
          : m.value === ''
            ? []
            : [m.value]
        metadataObj[m.label] = values
      }

      const hVals = metadataObj['Hieratic No Mod'] || []
      for (const v of hVals) {
        hieratics[v] = (hieratics[v] || 0) + 1
      }

      const gVals = metadataObj['Hieroglyph No Mod'] || []
      for (const v of gVals) {
        hieroglyphs[v] = (hieroglyphs[v] || 0) + 1
      }
    }
  }

  return {
    membersCount: members.length,
    manifestsCount: manifests.length,
    hieraticsCount: Object.keys(hieratics).length,
    hieroglyphsCount: Object.keys(hieroglyphs).length,
  }
}

export default async function VisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const stats = computeStats()
  return <VisContent stats={stats} />
}

function VisContent({ stats }: { stats: ReturnType<typeof computeStats> }) {
  const t = useTranslations()

  const items = [
    { title: t('total_items'), value: stats.membersCount.toLocaleString() },
    { title: t('total_volumes'), value: stats.manifestsCount.toLocaleString() },
    { title: t('hieratic_types'), value: stats.hieraticsCount.toLocaleString() },
    { title: t('hieroglyph_types'), value: stats.hieroglyphsCount.toLocaleString() },
    { title: t('total_contributors'), value: '4' },
    { title: t('total_updates'), value: '3' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale === 'ja') {
    return { title: 'ダッシュボード' }
  }
  return { title: 'Dashboard' }
}
