import { NextIntlClientProvider, useMessages } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import { locales } from '@/i18n/config'
import { AppHeader } from './header'
import { AppFooter } from './footer'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://moeller.jinsha.tsukuba.ac.jp'
  return {
    alternates: {
      languages: {
        'en': `${base}/en/`,
        'ja': `${base}/ja/`,
        'x-default': `${base}/en/`,
      },
    },
  }
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return <LocaleLayoutInner params={params}>{children}</LocaleLayoutInner>
}

async function LocaleLayoutInner({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <LocaleLayoutClient locale={locale}>{children}</LocaleLayoutClient>
}

function LocaleLayoutClient({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  const messages = useMessages()

  return (
    <html lang={locale} prefix="og: http://ogp.me/ns#">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/assets/css/main.css" />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
