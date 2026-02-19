import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { locales } from '@/i18n/config'
import { Separator } from '@/components/ui/separator'

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
    <div className="max-w-4xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6">{t('ユーザーズガイド')}</h1>

      <h2 className="text-xl font-bold my-6">{t('manual')}</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/manual/search">{t('検索画面')}</Link>
        </li>
      </ul>

      <Separator className="my-8" />

      <h2 className="text-xl font-bold my-6">{t('lod_vocabulary')}</h2>
      <ul className="list-disc pl-6 space-y-1">
        {Object.entries(pathes).map(([key, value]) => (
          <li key={key}>
            <Link href={`/property/${key}`}>{value}</Link>
          </li>
        ))}
      </ul>

      <Separator className="my-8" />

      <h2 className="text-xl font-bold my-6">{t('policy')}</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/manual/ga">
            {t('ga_title')}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export async function generateMetadata() {
  return { title: 'About' }
}
