import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { locales } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JsonLd } from '@/components/json-ld'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const organizationSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hieratische Paläographie DB',
  url: `${BASE_URL}/`,
  description:
    "A retrieval system for hieratic scripts using IIIF images from Georg Möller's Hieratische Paläographie (1909–36).",
  funder: {
    '@type': 'Organization',
    name: 'Japan Society for the Promotion of Science (JSPS)',
    url: 'https://www.jsps.go.jp/',
  },
  member: [
    { '@type': 'Person', name: 'Masakatsu Nagai', affiliation: 'University of Tsukuba' },
    { '@type': 'Person', name: 'Toshihito Waki', affiliation: 'University of Tsukuba' },
    { '@type': 'Person', name: 'Yona Takahashi', affiliation: 'Tokyo University of Foreign Studies' },
    { '@type': 'Person', name: 'Satoru Nakamura', affiliation: 'The University of Tokyo' },
  ],
}

const websiteSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hieratische Paläographie DB',
  url: `${BASE_URL}/`,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/en/search/?keyword={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeContent />
}

function HomeContent() {
  const t = useTranslations()
  const locale = useLocale()
  const title = 'Hieratische Paläographie DB'

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <div>
      {/* Hero */}
      <section
        className="relative h-96 md:h-[28rem] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${BASE_URL}/img/ogp/home.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/80 via-teal-900/60 to-teal-800/40" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight drop-shadow-lg">{t(title)}</h1>
          <p className="text-teal-100/90 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed drop-shadow">
            {locale === 'ja'
              ? 'ゲオルク・メラー『ヒエラティック古書体学』（1909–36）ヒエラティック字形検索システム'
              : "A retrieval system for hieratic scripts from Georg Möller's Hieratische Paläographie (1909–36)"}
          </p>
          <Button asChild size="lg" className="text-base shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/search" className="no-underline text-primary-foreground">
              {t('try_out')}
            </Link>
          </Button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* About */}
        <section className="py-8">
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>{t('about_')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              {locale === 'ja' ? (
                <>
                  <p>{t(title)}（{title}）へようこそ！</p>
                  <p>
                    このデータベースでは，Georg Möller,{' '}
                    <i>Hieratische Paläographie</i>, 1-3巻,
                    1909–12年に掲載されているヒエラティック（古代エジプト神官文字）の字形を検索することができます．
                  </p>
                  <p>
                    検索は，ヒエラティック番号，ヒエログリフ番号，音価/語などから行うことができます．検索の仕方は
                    <Link href="/about">マニュアル</Link>をご覧下さい．
                  </p>
                  <p>
                    本データベースが，ヒエラティックに関心のあるすべての人に役立つことを願っています．
                  </p>
                  <p>HDB (Hieratic Database)プロジェクトチーム</p>
                </>
              ) : (
                <>
                  <p>Welcome to our Hieratische Paläographie DB!</p>
                  <p>
                    This is a retrieval system for hieratic scripts; it uses IIIF
                    format images (owned by the Asian Research Library of the
                    University of Tokyo) of Georg Möller&apos;s{' '}
                    <i>Hieratische Paläographie</i> (1909–12).
                  </p>
                  <p>
                    We hope this platform is useful for everyone who has an interest
                    in Hieratic scripts.
                  </p>
                  <p>HDB (Hieratic Database) Project Team</p>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Members */}
        <section className="py-8">
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>{t('members')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                {locale === 'ja' ? (
                  <>
                    <li><a href="https://researchmap.jp/Masakatsu-Nagai/">永井正勝</a>, 筑波大学 図書館情報メディア系 教授</li>
                    <li><a href="https://researchmap.jp/wakit/">和氣愛仁</a>, 筑波大学 人文社会系 准教授</li>
                    <li><a href="https://researchmap.jp/takahashi.yona">高橋洋成</a>, 東京外国語大学 アジア・アフリカ言語文化研究所 研究員</li>
                    <li><a href="https://researchmap.jp/nakamura.satoru/">中村覚</a>, 東京大学 史料編纂所 准教授</li>
                  </>
                ) : (
                  <>
                    <li><a href="https://researchmap.jp/Masakatsu-Nagai/?lang=english">Masakatsu NAGAI</a>, Professor, Library, Information and Media System, University of Tsukuba.</li>
                    <li><a href="https://researchmap.jp/wakit/?lang=english">Toshihito WAKI</a>, Associate Professor, Faculty of Humanities and Social Sciences, University of Tsukuba.</li>
                    <li><a href="https://researchmap.jp/takahashi.yona?lang=en">Yona TAKAHASHI</a>, Research Associate, Research Institute for Languages and Cultures of Asia and Africa, Tokyo University of Foreign Studies.</li>
                    <li><a href="https://researchmap.jp/nakamura.satoru/?lang=english">Satoru NAKAMURA</a>, Associate Professor, Historiographical Institute, The University of Tokyo.</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Updates */}
        <section className="py-8">
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>{t('updates')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                {locale === 'ja' ? (
                  <>
                    <li>2025–2026: Next.js 16へ移行し、IDコンコーダンス表・引用ボタン・フッターナビゲーション等を追加。<Link href="/about/changelog" className="ml-1 text-primary hover:underline">→ 更新履歴</Link></li>
                    <li>2021年1月31日: システムを更新しました．（数字類と連字のコンテンツを追加．メタデータ，表示項目，RDF，UIの修正）</li>
                    <li>2020年11月9日: システムを更新しました．（日本語ページの追加，アイテム詳細ページの追加，RDFデータの追加，静的サイトジェネレータの利用）</li>
                    <li>2019年12月11日: システムを公開しました．</li>
                  </>
                ) : (
                  <>
                    <li>2025–2026: Migrated to Next.js 16; added ID Concordance table, citation buttons, footer navigation, and more. <Link href="/about/changelog" className="text-primary hover:underline">→ Full changelog</Link></li>
                    <li>31, Jan.,2021: Updated: Contents of &quot;Number part&quot; and &quot;Ligature part&quot; were added. Metatada, Display item, RDF data, and UI were modified.</li>
                    <li>9, Nov., 2020: Updated: Japanese page, Item detail page, RDF data, and SSG functionality were added.</li>
                    <li>11, Dec., 2019: Uploaded the data of Möller No.1 to 613bis, vols.1-3.</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section className="py-8">
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>{t('contact_information')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                {locale === 'ja' ? '永井正勝' : 'Masakatsu Nagai'}:{' '}
                <a href="mailto:nagai.masakatsu@mail.u-tokyo.ac.jp">
                  nagai.masakatsu [at] mail.u-tokyo.ac.jp
                </a>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
    </>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  const siteName = 'Hieratische Paläographie DB'

  const description =
    locale === 'ja'
      ? 'ゲオルク・メラー『ヒエラティック古書体学』（1909–36）のヒエラティック字形を検索できるデータベース。東京大学東洋文庫所蔵IIIFイメージを使用。'
      : "Search database for hieratic scripts from Georg Möller's Hieratische Paläographie (1909–36), with IIIF images from the University of Tokyo Asian Research Library."

  return {
    title: siteName,
    description,
    alternates: {
      canonical: `${base}/${locale}/`,
      languages: {
        'en': `${base}/en/`,
        'ja': `${base}/ja/`,
        'x-default': `${base}/en/`,
      },
    },
    openGraph: {
      title: siteName,
      description,
      type: 'website',
      images: [{ url: '/img/ogp/ogp.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
    },
  }
}
