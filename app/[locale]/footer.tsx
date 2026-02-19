'use client'

import { useLocale } from 'next-intl'

export function AppFooter() {
  const locale = useLocale()

  return (
    <footer className="bg-teal-900 text-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center my-4">
          {locale === 'ja'
            ? '永井正勝, 和氣愛仁, 高橋洋成, 中村覚'
            : 'Masakatsu NAGAI, Toshihito WAKI, Yona TAKAHASHI and Satoru NAKAMURA'}
        </p>
        <p className="text-center my-4">
          {locale === 'ja' ? (
            <>
              本研究はJSPS科研費
              <a
                href="https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-18K00525/"
                className="text-teal-300 hover:text-teal-200 underline"
              >
                18K00525
              </a>
              の助成を受けたものです．
            </>
          ) : (
            <>
              This work was supported by JSPS KAKENHI Grant Number{' '}
              <a
                href="https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-18K00525/"
                className="text-teal-300 hover:text-teal-200 underline"
              >
                18K00525
              </a>
              .
            </>
          )}
        </p>
      </div>
    </footer>
  )
}
