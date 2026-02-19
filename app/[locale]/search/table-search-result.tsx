'use client'

import { useSearchStore } from '@/store/use-search-store'
import { Link } from '@/i18n/navigation'
import { formatArrayValue, truncate } from '@/lib/utils'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

export function TableSearchResult() {
  const result = useSearchStore((s) => s.result) as Record<string, unknown>
  const facetOptions = useSearchStore((s) => s.facetOptions)
  const hits = (result.hits as Record<string, unknown[]>)?.hits || []

  const fields = [
    { key: 'image', label: '' },
    { key: 'label', label: 'Title' },
    ...Object.entries(facetOptions)
      .filter(([, v]) => !v.label.startsWith('_'))
      .map(([k, v]) => ({ key: k, label: v.label })),
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fields.map((f) => (
            <TableHead key={f.key}>
              {f.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {hits.map((item: unknown, i: number) => {
          const obj = item as { _id: string; _source: Record<string, string[]> }
          const source = obj._source
          return (
            <TableRow key={i}>
              <TableCell className="p-2">
                <Link href={`/item/${obj._id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formatArrayValue(source._thumbnail)}
                    alt=""
                    className="w-20 h-20 object-contain bg-muted rounded"
                  />
                </Link>
              </TableCell>
              <TableCell className="p-2">
                <Link href={`/item/${obj._id}`}>
                  <span dangerouslySetInnerHTML={{ __html: formatArrayValue(source._label) }} />
                </Link>
              </TableCell>
              {Object.keys(facetOptions)
                .filter((k) => !facetOptions[k].label.startsWith('_'))
                .map((k) => (
                  <TableCell key={k} className="p-2">
                    {source[k] ? truncate(formatArrayValue(source[k]), 50) : ''}
                  </TableCell>
                ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
