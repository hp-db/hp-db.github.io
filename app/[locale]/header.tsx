'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import {
  Menu,
  Search,
  List,
  Info,
  ExternalLink,
  Image,
  Database,
  Languages,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export function AppHeader() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  const navItems = [
    { href: '/search', label: t('search'), icon: Search },
    { href: '/category/Vol', label: t('category'), icon: List },
    { href: '/about', label: t('ユーザーズガイド'), icon: Info },
    {
      href: BASE_URL + '/snorql',
      label: 'SPARQL Endpoint',
      icon: Search,
      external: true,
    },
    {
      href: 'https://wdb.jinsha.tsukuba.ac.jp/hdb/',
      label: 'Hieratic Database Project',
      icon: Database,
      external: true,
    },
    {
      href: 'https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/item?search=6+W%3A800+X%3Amol&sort_by=uparl%3AidentifierOfTheData&sort_order=asc',
      label: 'Digital Resources for Egyptian Studies',
      icon: Image,
      external: true,
    },
    {
      href: 'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation=https://moeller.jinsha.tsukuba.ac.jp/data/curation.json&mode=annotation&lang=ja',
      label: 'IIIF Curation Platform',
      icon: Image,
      external: true,
    },
    {
      href: 'https://self-museum.cultural.jp/?collection=https://moeller.jinsha.tsukuba.ac.jp/data/curation.json&build=1',
      label: 'Self Museum',
      icon: Image,
      external: true,
    },
  ]

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'ja' })
  }

  return (
    <>
      <header className="bg-background sticky top-0 z-40 border-b border-primary/20">
        <div className="flex items-center h-16 px-4 max-w-7xl mx-auto">
          {/* Mobile menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 lg:hidden" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                {navItems.map((item, i) => {
                  const Icon = item.icon
                  if (item.external) {
                    return (
                      <a
                        key={i}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2.5 rounded-md hover:bg-accent text-foreground no-underline text-sm"
                        onClick={() => setSheetOpen(false)}
                      >
                        <Icon className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="flex-1">{item.label}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      className="flex items-center px-3 py-2.5 rounded-md hover:bg-accent text-foreground no-underline text-sm"
                      onClick={() => setSheetOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-3 text-muted-foreground" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold text-foreground no-underline hover:no-underline truncate"
          >
            {t('Hieratische Paläographie DB')}
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center ml-8 gap-1">
            {navItems.slice(0, 3).map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent no-underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <div className="hidden sm:flex flex-1 justify-end mx-4">
            <FullTextSearchBar />
          </div>

          <div className="flex-1 sm:hidden" />

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Languages className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">
                  {locale === 'ja' ? '日本語' : 'EN'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('ja')}>
                日本語
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}

function FullTextSearchBar() {
  const t = useTranslations()
  const router = useRouter()
  const [value, setValue] = useState('')

  const handleSearch = () => {
    const keywords = value
      .replace(/\u3000/g, ' ')
      .split(' ')
      .filter((s) => s !== '')
    const params = new URLSearchParams()
    keywords.forEach((kw) => params.append('keyword', kw))
    router.push(`/search?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch()
    }
  }

  return (
    <div className="flex items-center gap-2 max-w-md w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('search')}
        className="h-9"
        aria-label={t('search')}
      />
      <Button variant="ghost" size="icon" onClick={handleSearch} className="shrink-0 h-9 w-9" aria-label={t('search')}>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  )
}
