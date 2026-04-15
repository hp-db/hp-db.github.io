import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ChangelogContent />
}

interface ChangelogEntry {
  date: string
  titleEn: string
  titleJa: string
  itemsEn: string[]
  itemsJa: string[]
}

const entries: ChangelogEntry[] = [
  {
    date: '2025–2026',
    titleEn: 'Next.js Migration & Feature Update',
    titleJa: 'Next.js 移行・機能更新',
    itemsEn: [
      'Migrated from Nuxt 2 / Vue 2 to Next.js 16 (App Router) with full static export.',
      'Rebuilt UI with shadcn/ui components and Tailwind CSS.',
      'Added ID Concordance table linking Möller numbers to Gardiner, Unicode, JSesh, TSL, AKU, DPDP, Isut, PHRP, and MdC identifiers.',
      'Added concordance panel to individual item pages with links to external sign databases.',
      'Added shareable URL state (search query and sort order) to the Concordance page.',
      'Added Chicago and BibTeX citation support on item pages.',
      'Redesigned item pages: two-column layout with metadata on the left and links, persistent URI, citation, and license on the right.',
      'Added footer navigation with project, resources, and user\'s guide links.',
      'Validated Wikipedia Gardiner sign anchors and linked only to signs with confirmed Wikipedia entries.',
      'Updated member affiliations and JSPS grant numbers (18K00525, 21K00472, 25K04084).',
      'Added concordance data sources documentation page.',
    ],
    itemsJa: [
      'Nuxt 2 / Vue 2 から Next.js 16（App Router）へ移行し、完全な静的書き出しに対応。',
      'shadcn/ui コンポーネントと Tailwind CSS による UI の刷新。',
      'メラー番号とガーディナー番号、Unicode、JSesh、TSL、AKU、DPDP、Isut、PHRP、MdCを対応付けたIDコンコーダンス表を追加。',
      'アイテム個別ページにコンコーダンスパネルを追加し、各外部サイン・データベースへのリンクを掲載。',
      'コンコーダンスページに検索語・ソート順をURLパラメータとして保存し、URLで状態を共有可能に。',
      'アイテムページにシカゴ形式およびBibTeX形式の引用ボタンを追加。',
      'アイテムページのレイアウトを2カラム化（左：メタデータ、右：各種リンク・永続URI・引用・ライセンス）。',
      'フッターにプロジェクト・リソース・ユーザーズガイドのナビゲーションリンクを追加。',
      'Wikipediaのガーディナー番号アンカーを検証し、確認済みのサインのみリンクを表示するよう修正。',
      'メンバーの所属・肩書きおよびJSPS科研費番号（18K00525、21K00472、25K04084）を更新。',
      'コンコーダンスデータソースの説明ページを追加。',
    ],
  },
  {
    date: '2021-01-31',
    titleEn: 'Data & Metadata Update',
    titleJa: 'データ・メタデータ更新',
    itemsEn: [
      'Added "Number part" (numerals 614–719) and "Ligature part" (I–LXXVII) contents.',
      'Revised metadata, display fields, RDF data, and UI.',
    ],
    itemsJa: [
      '数字類（614–719）および連字（I–LXXVII）のコンテンツを追加。',
      'メタデータ、表示項目、RDFデータ、UIを修正。',
    ],
  },
  {
    date: '2020-11-09',
    titleEn: 'Japanese Page & Item Detail',
    titleJa: '日本語ページ・アイテム詳細',
    itemsEn: [
      'Added Japanese-language pages.',
      'Added individual item detail pages.',
      'Added RDF data export.',
      'Adopted static site generator (Nuxt generate).',
    ],
    itemsJa: [
      '日本語ページを追加。',
      'アイテム詳細ページを追加。',
      'RDFデータの出力機能を追加。',
      '静的サイトジェネレータ（Nuxt generate）を採用。',
    ],
  },
  {
    date: '2019-12-11',
    titleEn: 'Initial Release',
    titleJa: '初回公開',
    itemsEn: [
      'Published data for Möller No. 1 to 613bis, vols. 1–3.',
    ],
    itemsJa: [
      'メラー番号1〜613bisの全データ（第1〜3巻）を公開。',
    ],
  },
]

function ChangelogContent() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link href="/about" className="hover:underline">{t('ユーザーズガイド')}</Link>
        <span className="mx-1">/</span>
        <span>{t('changelog_title')}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-8 tracking-tight">{t('changelog_title')}</h1>

      <div className="space-y-8">
        {entries.map((entry) => (
          <section key={entry.date} className="border rounded-lg overflow-hidden">
            <div className="bg-muted/40 px-5 py-3 border-b flex items-center gap-3">
              <span className="font-mono text-sm text-muted-foreground">{entry.date}</span>
              <h2 className="font-semibold text-base">
                {locale === 'ja' ? entry.titleJa : entry.titleEn}
              </h2>
            </div>
            <ul className="px-5 py-4 space-y-1.5 text-sm list-disc list-inside text-muted-foreground leading-relaxed">
              {(locale === 'ja' ? entry.itemsJa : entry.itemsEn).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const pageTitle = t('changelog_title')
  const siteName = 'Hieratische Paläographie DB'

  return {
    title: pageTitle,
    alternates: {
      canonical: `${base}/${locale}/about/changelog/`,
      languages: {
        'en': `${base}/en/about/changelog/`,
        'ja': `${base}/ja/about/changelog/`,
        'x-default': `${base}/en/about/changelog/`,
      },
    },
    openGraph: {
      title: `${pageTitle} - ${siteName}`,
      type: 'website',
      images: [{ url: '/img/ogp/ogp.jpg' }],
    },
  }
}
