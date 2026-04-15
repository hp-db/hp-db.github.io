'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ExternalLink, Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const SPARQL_ENDPOINT = 'https://dydra.com/ut-digital-archives/hpdb/sparql'
const SNORQL_URL = '/snorql/index.html'

const EXAMPLE_ITEM_ID = '201001'
const EXAMPLE_ITEM_URI = `https://w3id.org/hpdb/api/items/${EXAMPLE_ITEM_ID}`

const NAMESPACES = [
  { prefix: 'hpdb', uri: 'https://w3id.org/hpdb/api/' },
  { prefix: 'rdfs', uri: 'http://www.w3.org/2000/01/rdf-schema#' },
  { prefix: 'rdf', uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
  { prefix: 'schema', uri: 'http://schema.org/' },
  { prefix: 'dct', uri: 'http://purl.org/dc/terms/' },
  { prefix: 'xsd', uri: 'http://www.w3.org/2001/XMLSchema#' },
]

const EXAMPLE_QUERIES = [
  {
    label: 'List items (100)',
    labelJa: '全アイテム一覧（100件）',
    query: `PREFIX hpdb: <https://w3id.org/hpdb/api/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?item ?label WHERE {
  ?item a hpdb:classes/Item ;
        rdfs:label ?label .
}
LIMIT 100`,
  },
  {
    label: 'Signs with Unicode code points',
    labelJa: 'Unicodeコードポイント付き字形一覧',
    query: `PREFIX hpdb: <https://w3id.org/hpdb/api/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?item ?mollerNo ?hieroglyphNo WHERE {
  ?item a hpdb:classes/Item ;
        hpdb:properties/möllerNo ?mollerNo .
  OPTIONAL { ?item hpdb:properties/hieroglyphNo ?hn .
             ?hn rdfs:label ?hieroglyphNo . }
}
ORDER BY ?mollerNo
LIMIT 50`,
  },
  {
    label: 'DESCRIBE a single item',
    labelJa: '単一アイテムの詳細',
    query: `DESCRIBE <${EXAMPLE_ITEM_URI}>`,
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

export function ApiContent() {
  const t = useTranslations()

  const snorqlDescribeUrl = `${BASE_URL}${SNORQL_URL}?describe=${encodeURIComponent(EXAMPLE_ITEM_URI)}`

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="text-2xl font-bold mb-2">{t('api_title')}</h1>
      <p className="text-muted-foreground mb-10">{t('api_desc')}</p>

      {/* SPARQL Endpoint */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-1">{t('api_sparql_title')}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t('api_sparql_desc')}</p>

        <div className="rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-1">{t('api_sparql_endpoint')}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-muted px-3 py-1.5 rounded break-all">
              {SPARQL_ENDPOINT}
            </code>
            <CopyButton text={SPARQL_ENDPOINT} />
          </div>
        </div>

        <a
          href={BASE_URL + SNORQL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t('api_sparql_browser')}
        </a>
      </section>

      {/* Example Queries */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">{t('api_sparql_examples')}</h2>
        <div className="space-y-4">
          {EXAMPLE_QUERIES.map((eq) => {
            const snorqlQueryUrl = `${BASE_URL}${SNORQL_URL}?query=${encodeURIComponent(eq.query)}`
            return (
              <div key={eq.label} className="rounded-lg border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
                  <span className="text-sm font-medium">
                    {eq.label}
                    <span className="ml-2 text-xs text-muted-foreground font-normal">{eq.labelJa}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <CopyButton text={eq.query} />
                    <a
                      href={snorqlQueryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Run
                    </a>
                  </div>
                </div>
                <pre className="text-xs font-mono p-4 overflow-x-auto bg-background leading-relaxed">
                  {eq.query}
                </pre>
              </div>
            )
          })}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Linked Data */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-1">{t('api_ld_title')}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t('api_ld_desc')}</p>

        <div className="rounded-lg border bg-card p-4 mb-4 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('api_ld_item_url')}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-muted px-3 py-1.5 rounded">
                https://w3id.org/hpdb/api/items/<span className="text-muted-foreground">{'{id}'}</span>
              </code>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t('api_ld_example')} — item {EXAMPLE_ITEM_ID}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-muted px-3 py-1.5 rounded break-all">
                {EXAMPLE_ITEM_URI}
              </code>
              <CopyButton text={EXAMPLE_ITEM_URI} />
              <a
                href={`${BASE_URL}/api/items/${EXAMPLE_ITEM_ID}.json`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                JSON-LD <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <a
          href={snorqlDescribeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t('api_ld_open')} (item {EXAMPLE_ITEM_ID})
        </a>
      </section>

      <Separator className="mb-10" />

      {/* Namespaces */}
      <section>
        <h2 className="text-lg font-semibold mb-4">{t('api_ns_title')}</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('api_ns_prefix')}</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">{t('api_ns_uri')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {NAMESPACES.map((ns) => (
                <tr key={ns.prefix} className="hover:bg-muted/30">
                  <td className="px-4 py-2">
                    <Badge variant="secondary" className="font-mono text-xs">{ns.prefix}</Badge>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground break-all">{ns.uri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
