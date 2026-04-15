import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { ExternalLink } from 'lucide-react'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale === 'ja') return { title: '対照表データソース' }
  return { title: 'Concordance Data Sources' }
}

export default async function ConcordanceSourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ConcordanceSourcesContent />
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
    >
      {children}
      <ExternalLink className="w-3 h-3 shrink-0" />
    </a>
  )
}

const SOURCES = [
  {
    col: 'Möller No',
    db: 'Hieratische Paläographie (Möller, 1909–36)',
    url: 'https://mjn.host.cs.st-andrews.ac.uk/egyptian/unicode/tablehieratic.html',
    idFormat: 'integer (1–570+)',
    entries: 937,
    entriesNote: 'all',
    method: 'Base data. Primary key of this project. Sourced from the St Andrews hieratic concordance table.',
  },
  {
    col: 'Gardiner No',
    db: "Gardiner's Sign List",
    url: 'https://en.wikipedia.org/wiki/List_of_Egyptian_hieroglyphs',
    idFormat: 'letter + number (e.g. A1, D21, Aa1)',
    entries: null,
    entriesNote: 'most signs',
    method: 'Cross-referenced from the St Andrews concordance table. Simple codes link directly to the Wikipedia section for that sign.',
  },
  {
    col: 'Glyph',
    db: 'Unicode Egyptian Hieroglyphs (rendered)',
    url: null,
    idFormat: 'Unicode character',
    entries: null,
    entriesNote: 'rendered from unicode_cp',
    method: 'Displayed directly from the Unicode code point stored in the data.',
  },
  {
    col: 'JSesh',
    db: 'JSesh Hieroglyphic Editor (Rosmorduc)',
    url: 'https://jsesh.qenherkhopeshef.org/',
    idFormat: 'Gardiner code (e.g. A1)',
    entries: null,
    entriesNote: 'same as Gardiner',
    method: 'JSesh uses the same Gardiner codes internally. Links to the JSesh SVG glyph image served from qenherkhopeshef.org.',
  },
  {
    col: 'HG (Hieroglyphica)',
    db: 'Hieroglyphica',
    url: 'https://hieroglyphes.pagesperso-orange.fr/',
    idFormat: 'numeric code',
    entries: null,
    entriesNote: 'partial',
    method: 'Legacy sign encoding. Cross-referenced from existing data; no dedicated scrape or API.',
  },
  {
    col: 'MdC (Manuel de Codage)',
    db: 'Manuel de Codage — standard transliteration',
    url: 'http://www.catchpenny.org/codage/',
    idFormat: 'same as Gardiner (e.g. A1, D21)',
    entries: null,
    entriesNote: 'same as Gardiner',
    method: 'Standard notation derived directly from the Gardiner No field. No separate scrape required.',
  },
  {
    col: 'TSL',
    db: 'Thot Sign List — thotsignlist.org',
    url: 'https://thotsignlist.org/',
    idFormat: 'integer (e.g. 396)',
    entries: null,
    entriesNote: '~396',
    method: 'IDs taken directly from the St Andrews concordance table, which already includes TSL cross-references.',
  },
  {
    col: 'AKU',
    db: 'AKU-PAL — Akademie Kuratorium Universität, Mainz',
    url: 'https://aku-pal.uni-mainz.de/',
    idFormat: '"A0890" (letter + 4 digits)',
    entries: 249,
    entriesNote: null,
    method: 'Fetched via the public REST API GET /api/graphemes (971 entries, ~10 MB JSON). Matched to this dataset by comparing the MdC field in each AKU grapheme record.',
  },
  {
    col: 'DPDP',
    db: 'Demotic Palaeography Database Project',
    url: 'http://129.206.5.162/beta/palaeography/',
    idFormat: 'Unicode code point (e.g. U+1301E)',
    entries: 412,
    entriesNote: null,
    method: 'DPDP has no public API. The JavaScript SPA bundle (demoticSigns.js) was fetched and parsed. Hieroglyphs enclosed in 《》 brackets were extracted as a set of Unicode characters (340 unique). These were cross-referenced against the unicode_char field in this dataset.',
  },
  {
    col: 'Isut',
    db: 'Isut — Université de Liège',
    url: 'https://isut.uliege.be/',
    idFormat: 'Gardiner code (e.g. A26)',
    entries: 360,
    entriesNote: null,
    method: 'No public API. The signs/overview HTML page was fetched and all signname= URL parameters were extracted via regex. Only signs whose Gardiner code appears in the scraped list are linked.',
  },
  {
    col: 'PHRP',
    db: 'Polychrome Hieroglyph Research Project — ULB Brussels',
    url: 'https://www.phrp.be/',
    idFormat: 'SignKey integer (e.g. 35)',
    entries: 556,
    entriesNote: null,
    method: 'No public API. The ListAllSigns.php HTML page was fetched and all SignKey=N&Gard=XX patterns were extracted via regex (~780 signs). Matched by Gardiner code. The URL requires only SignKey — the Gard parameter is not needed.',
  },
  {
    col: 'Unicode',
    db: 'Unicode Egyptian Hieroglyphs (U+13000–U+1342F)',
    url: 'https://www.unicode.org/charts/PDF/U13000.pdf',
    idFormat: 'U+XXXXX (e.g. U+13000)',
    entries: 521,
    entriesNote: null,
    method: 'Matched via the ORAEC MdC-to-Unicode conversion table. Code points link to the Unicode character inspector at util.unicode.org.',
  },
]

function ConcordanceSourcesContent() {
  const t = useTranslations()

  return (
    <div className="max-w-5xl mx-auto px-4 my-8">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/about" className="hover:underline">{t('ユーザーズガイド')}</Link>
        {' / '}
        {t('csources_title')}
      </div>

      <h1 className="text-2xl font-bold mb-3">{t('csources_title')}</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-3xl">{t('csources_desc')}</p>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-24">{t('csources_col_column')}</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">{t('csources_col_database')}</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-40">{t('csources_col_id_format')}</th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground w-20">{t('csources_col_entries')}</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">{t('csources_col_method')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {SOURCES.map((s) => (
              <tr key={s.col} className="hover:bg-muted/20 align-top">
                <td className="px-4 py-3 font-mono text-xs font-medium whitespace-nowrap">{s.col}</td>
                <td className="px-4 py-3">
                  {s.url ? (
                    <ExtLink href={s.url}>{s.db}</ExtLink>
                  ) : (
                    <span>{s.db}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.idFormat}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {s.entries != null ? (
                    <span className="font-medium">{s.entries.toLocaleString()}</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">{s.entriesNote}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground leading-relaxed">{s.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Source data:{' '}
        <Link href="/concordance" className="text-blue-600 hover:underline">
          ID Concordance Table
        </Link>
        {' — '}
        <Link href="/datasets" className="text-blue-600 hover:underline">
          Datasets
        </Link>
      </p>
    </div>
  )
}
