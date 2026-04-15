'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ExternalLink } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export function AppFooter() {
  const t = useTranslations()
  const locale = useLocale()

  const cols = [
    {
      heading: t('search'),
      links: [
        { href: '/search',        label: t('search') },
        { href: '/category/Vol',  label: t('category') },
        { href: '/concordance',   label: t('concordance') },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { href: '/datasets',      label: t('datasets_title') },
        { href: '/api',           label: t('api_title') },
        { href: BASE_URL + '/snorql', label: 'SPARQL Endpoint', external: true },
      ],
    },
    {
      heading: t('ユーザーズガイド'),
      links: [
        { href: '/about',                       label: t('ユーザーズガイド') },
        { href: '/manual/search',               label: t('検索画面') },
        { href: '/about/concordance-sources',   label: t('csources_link') },
        { href: '/about/changelog',             label: t('changelog_link') },
      ],
    },
  ]

  return (
    <footer className="bg-gradient-to-b from-teal-900 to-teal-950 text-white mt-12">
      <div className="h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ナビグリッド */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3 pb-2 border-b border-teal-800">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-teal-200/70 hover:text-teal-100 transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <Link
                        href={link.href as '/'}
                        className="text-sm text-teal-200/70 hover:text-teal-100 transition-colors duration-200 no-underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 区切り */}
        <div className="border-t border-teal-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-teal-400/80">
          <p>
            {locale === 'ja'
              ? '永井正勝, 和氣愛仁, 高橋洋成, 中村覚'
              : 'Masakatsu NAGAI, Toshihito WAKI, Yona TAKAHASHI and Satoru NAKAMURA'}
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {[
              { no: '18K00525', url: 'https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-18K00525/' },
              { no: '21K00472', url: 'https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-21K00472/' },
              { no: '25K04084', url: 'https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-25K04084/' },
            ].map(({ no, url }, i) => (
              <span key={no} className="inline-flex items-center gap-3">
                {i > 0 && <span className="text-teal-700/60">·</span>}
                <a href={url} target="_blank" rel="noopener noreferrer"
                   className="text-teal-300/80 hover:text-white underline transition-colors">
                  JSPS {no}
                </a>
              </span>
            ))}
            <span className="text-teal-700/60">·</span>
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer"
               className="text-teal-300/80 hover:text-white underline transition-colors">
              CC BY 4.0
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
