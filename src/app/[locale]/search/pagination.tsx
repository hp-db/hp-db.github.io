'use client'

import { useSearchStore } from '@/lib/use-search-store'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Pagination() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = useSearchStore((s) => s.currentPage)
  const size = useSearchStore((s) => s.size)
  const layout = useSearchStore((s) => s.layout)
  const result = useSearchStore((s) => s.result) as Record<string, unknown>

  if (layout === 'stats' || layout === 'map') return null

  const total = (result.hits as Record<string, unknown>)
    ? ((result.hits as Record<string, Record<string, number>>).total?.value || 0)
    : 0
  const totalPages = Math.ceil(total / size)

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('from', String((page - 1) * size))
    router.push(`/search?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      const start = Math.max(2, currentPage - 2)
      const end = Math.min(totalPages - 1, currentPage + 2)
      if (start > 2) pages.push('...')
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <nav className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 p-0"
      >
        &laquo;
      </Button>
      {getPageNumbers().map((page, i) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => goToPage(page)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 p-0"
      >
        &raquo;
      </Button>
    </nav>
  )
}
