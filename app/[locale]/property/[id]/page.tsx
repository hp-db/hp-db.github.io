import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

interface PropertyRow {
  path: string
  name: string
  example: string
  min: number | string
  max: number | string
  datatype: string
}

const PREFIXES: Record<string, string> = {
  hpdb: 'https://w3id.org/hpdb/api/',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  schema: 'http://schema.org/',
  dct: 'http://purl.org/dc/terms/',
}

function getUri(data: string): string {
  let str = '' + data
  for (const [key, val] of Object.entries(PREFIXES)) {
    str = str.replace(val, key + ':')
  }
  if (str.length > 60) {
    str = str.substring(0, 60) + '...'
  }
  return str
}

function loadShapeData(id: string, locale: string): { id: string; uri: string; rows: PropertyRow[] } | null {
  const filePath = path.join(process.cwd(), 'public', 'api', 'shapes', `${id}Shape.json`)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    const result = data[0]
    const uri = result['@id']
    const targetId = result['http://www.w3.org/ns/shacl#targetClass'][0]['@id'].split('/classes/')[1]
    const ps = result['http://www.w3.org/ns/shacl#property']

    const map: Record<number, PropertyRow> = {}

    for (const p of ps) {
      const pid = p['@id']
      for (const obj of data) {
        if (obj['@id'] === pid) {
          let name = ''
          const names = obj['http://www.w3.org/ns/shacl#name'] || []
          for (const nobj of names) {
            if (nobj['@language'] === locale) {
              name = nobj['@value']
              break
            }
          }

          const order = obj['http://www.w3.org/ns/shacl#order'][0]['@value']

          const row: PropertyRow = {
            path: obj['http://www.w3.org/ns/shacl#path'][0]['@id'],
            name,
            example: obj['http://www.w3.org/2004/02/skos/core#example']
              ? obj['http://www.w3.org/2004/02/skos/core#example'][0]['@value']
              : '',
            min: obj['http://www.w3.org/ns/shacl#minCount']
              ? obj['http://www.w3.org/ns/shacl#minCount'][0]['@value']
              : '',
            max: obj['http://www.w3.org/ns/shacl#maxCount']
              ? obj['http://www.w3.org/ns/shacl#maxCount'][0]['@value']
              : '',
            datatype: obj['http://www.w3.org/ns/shacl#datatype']
              ? obj['http://www.w3.org/ns/shacl#datatype'][0]['@id']
              : '',
          }

          map[order] = row
          break
        }
      }
    }

    const rows: PropertyRow[] = []
    for (const key of Object.keys(map).sort((a, b) => Number(a) - Number(b))) {
      rows.push(map[Number(key)])
    }

    return { id: targetId, uri, rows }
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  return [
    { id: 'Item' },
    { id: 'HieroglyphNo' },
    { id: 'HieraticNo' },
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: id }
}

export default async function PropertyPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const shapeData = loadShapeData(id, locale)
  if (!shapeData) {
    return <div className="max-w-4xl mx-auto px-4 my-8">Property not found: {id}</div>
  }
  return <PropertyContent data={shapeData} />
}

function PropertyContent({ data }: { data: { id: string; uri: string; rows: PropertyRow[] } }) {
  const t = useTranslations()

  const headers = [
    { text: t('property_name'), key: 'path' },
    { text: t('property_description'), key: 'name' },
    { text: t('property_example'), key: 'example' },
    { text: t('property_min'), key: 'min' },
    { text: t('property_max'), key: 'max' },
    { text: t('range'), key: 'datatype' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      <h1 className="text-2xl font-bold mb-6">
        {t('resource_properties', { id: data.id })}
      </h1>

      <div className="overflow-x-auto my-10">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead key={h.key}>
                  {h.text}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                  <code className="bg-muted text-foreground px-1 rounded text-xs">
                    {getUri(row.path)}
                  </code>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{getUri(row.example)}</TableCell>
                <TableCell>
                  {row.min === 1 ? (
                    <b>{t('required')}</b>
                  ) : (
                    t('optional')
                  )}
                </TableCell>
                <TableCell>
                  {row.max === 1 ? t('non_repeatable') : t('repeatable')}
                </TableCell>
                <TableCell>
                  <code className="bg-muted text-foreground px-1 rounded text-xs">
                    {getUri(row.datatype)}
                  </code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-center mt-5">
        <a href={data.uri} target="_blank" rel="noopener noreferrer" title="RDF">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_URL}/img/icons/rdf-logo.svg`}
            width={45}
            alt="RDF"
            className="inline"
          />
        </a>
      </p>
    </div>
  )
}
