import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { locales } from '@/i18n/config'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ManualSearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ManualSearchContent />
}

function ManualSearchContent() {
  const t = useTranslations()

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6">
        {t('manual')} : {t('検索画面')}
      </h1>

      <h2 className="text-xl font-bold my-6 border-l-4 border-primary pl-4">{t('対象データ')}</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          {t('manual_data_1')}
        </li>
        <li>
          {t('manual_data_2')}
        </li>
        <li>
          {t('manual_data_3_prefix')}
          <a href="https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/dres?sort_by=uparl%3AidentifierOfTheData&sort_order=asc">
            Digital Resources for Egyptian Studies
          </a>
          {t('manual_data_3_suffix')}
        </li>
        <li>
          {t('manual_data_4_prefix')}
          <a href="http://codh.rois.ac.jp/iiif/curation/">Curation API</a>,{' '}
          <a href="http://codh.rois.ac.jp/software/iiif-curation-viewer/">IIIF Curation Viewer</a>,{' '}
          <a href="http://codh.rois.ac.jp/iiif-curation-platform/">IIIF Curation Platform</a>
          {t('manual_data_4_suffix')}
        </li>
      </ul>

      <h2 className="text-xl font-bold my-6 border-l-4 border-primary pl-4">{t('検索画面')}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BASE_URL}/img/icons/search.png`} alt="Search screen" className="w-full" />

      <h3 className="text-lg font-bold my-5">[1] {t('メニューバー')}</h3>
      <p>{t('manual_menu')}</p>

      <h3 className="text-lg font-bold my-5">[2] {t('全文検索')}</h3>
      <p>{t('manual_fulltext')}</p>

      <h3 className="text-lg font-bold my-5">[3] {t('language')}</h3>
      <p>{t('manual_lang')}</p>

      <h3 className="text-lg font-bold my-5">[4] {t('Item Type')}</h3>
      <p>{t('manual_itemtype')}</p>

      <h3 className="text-lg font-bold my-5">[5] {t('Sub Type')}</h3>
      <p>{t('manual_subtype')}</p>

      <h3 className="text-lg font-bold my-5">[6] {t('Unit')}</h3>
      <p>{t('manual_unit')}</p>

      <h3 className="text-lg font-bold my-5">[7] {t('Item Label')}</h3>
      <p>{t('manual_itemlabel')}</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/category/Item Label Mod">{t('manual_itemlabel_list')}</Link>
        </li>
      </ul>

      <h3 className="text-lg font-bold my-5">[8] {t('Hieratic No')}</h3>
      <p>{t('manual_hieraticno')}</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/category/Hieratic No Mod">{t('manual_hieraticno_list')}</Link>
        </li>
      </ul>

      <h3 className="text-lg font-bold my-5">[9] {t('Category Class')}</h3>
      <p>{t('manual_categoryclass')}</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/category/Category Class">{t('manual_categoryclass_list')}</Link>
        </li>
      </ul>

      <h3 className="text-lg font-bold my-5">[10] {t('Hieroglyph No')}</h3>
      <p>{t('manual_hieroglyphno')}</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <a href="https://en.wikipedia.org/wiki/Gardiner%27s_sign_list">
            Gardiner&apos;s sign list._Wikipedia
          </a>
        </li>
        <li>
          <a href="https://hieroglyphes.pagesperso-orange.fr/Hieroglyphica = A.htm">
            HIEROGLYPHICA
          </a>
        </li>
      </ul>
      <p className="mt-4">{t('manual_hieroglyphno_note')}</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/category/Hieroglyph No Mod">{t('manual_hieroglyphno_list')}</Link>
        </li>
      </ul>

      <h3 className="text-lg font-bold my-5">[11] {t('Phone/Word')}</h3>
      <p>
        {t('manual_phoneword')}
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <a href="http://www.catchpenny.org/codage/#trans">Manuel de Codage (MdC)</a>
        </li>
        <li>
          <a href="http://wwwuser.gwdg.de/~lingaeg/bin/glyph_i.zip">
            True Type Font &quot;Transliteration&quot; (The Centre For Computer-aided Egyptological Research)
          </a>
        </li>
      </ul>

      <h3 className="text-lg font-bold my-5">[12] {t('Numeral')}</h3>
      <p>{t('manual_numeral')}</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link href="/category/Numeral">{t('manual_numeral_list')}</Link>
        </li>
      </ul>

      <h3 className="text-lg font-bold my-5">[13] {t('Vol')}</h3>
      <p>{t('manual_vol')}</p>

      <h3 className="text-lg font-bold my-5">[14] {t('Page')}</h3>
      <p>{t('manual_page_desc')}</p>

      <h3 className="text-lg font-bold my-5">[15] {t('Order')}</h3>
      <p>{t('manual_order')}</p>

      <h3 className="text-lg font-bold my-5">[16] {t('Note')}</h3>
      <p>{t('manual_note')}</p>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale === 'ja') {
    return { title: 'マニュアル: 検索画面' }
  }
  return { title: 'Manual: Search' }
}
