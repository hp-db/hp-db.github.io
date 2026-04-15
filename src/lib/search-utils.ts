import { convert2arr } from './utils'
import { splitForFacet, getFacetField } from './facet-utils'

/**
 * Map URL-safe field names (no spaces) to actual index field names.
 * e.g. q-HieraticNo → "Hieratic No"
 */
const Q_FIELD_NAME_MAP: Record<string, string> = {
  'HieraticNo': 'Hieratic No',
  'HieroglyphNo': 'Hieroglyph No',
  'ItemLabel': 'Item Label',
  'ItemType': 'Item Type',
  'SubType': 'Sub Type',
  'CategoryClass': 'Category Class',
  'PhoneWord': 'Phone/Word',
  'ItemLabelSearch': 'Item Label Search',
  'HieraticNoSearch': 'Hieratic No Search',
  'HieroglyphNoSearch': 'Hieroglyph No Search',
}

/** Fields whose facet values may contain commas in legacy URLs. */
const MOD_FACET_FIELDS = new Set([
  getFacetField('Item Label'),
  getFacetField('Hieratic No'),
  getFacetField('Hieroglyph No'),
  getFacetField('Phone/Word'),
])

export function splitKeyword(keyword: string): { label: string; value: string }[] {
  const keywords = keyword
    .replace(/\u3000/g, ' ')
    .split(' ')
    .filter((item) => item !== '')

  return keywords.map((kw) => {
    const splitTmp = kw.split(':')
    if (splitTmp.length === 2) {
      return { label: 'q-' + splitTmp[0].trim(), value: splitTmp[1].trim() }
    }
    return { label: 'keyword', value: kw }
  })
}

export function createQuery(
  routeQuery: Record<string, string | string[] | undefined>,
  config: { facetOptions: Record<string, { orderKey?: string; orderValue?: string; size?: number }>; size?: number },
  max = true
): Record<string, unknown> {
  const fcs = Object.keys(config.facetOptions)
  const fields = ['_full_text', '_title']
  const FC_SIZE = 50

  const from = routeQuery.from ? Number(routeQuery.from) : 0
  let size = routeQuery.size ? Number(routeQuery.size) : (config.size || 24)

  const ops: Record<string, boolean> = {
    keyword: routeQuery.keywordOr === 'true',
    q: routeQuery.advancedOr === 'true',
    fc: routeQuery.facetOr === 'true',
  }

  if (size > 500) size = 500

  // Aggregation
  const aggs: Record<string, unknown> = {}
  for (const field of fcs) {
    const fcsField = 'fc-' + field
    const option = config.facetOptions[field]
    const orderKey = option.orderKey || '_count'
    const orderValue = option.orderValue || 'desc'
    const order: Record<string, string> = {}
    order[orderKey] = orderValue

    aggs[field] = {
      terms: {
        field: field + '.keyword',
        size: max ? (option.size || FC_SIZE) : -1,
        order,
      },
    }
  }

  // Query body
  const query: Record<string, unknown> = {
    bool: {
      must: [] as unknown[],
      should: [] as unknown[],
      filter: [] as unknown[],
      must_not: [] as unknown[],
    },
  }
  const bool = (query.bool as Record<string, unknown[]>)

  // Keywords
  const keyword = routeQuery.keyword ? routeQuery.keyword : []
  const keywords = Array.isArray(keyword) ? keyword : [keyword]

  for (const kw of keywords) {
    if (kw.startsWith('-')) {
      for (const f of fields) {
        const matchPhrase: Record<string, string> = {}
        matchPhrase[f] = kw.slice(1)
        bool.must_not.push({ match_phrase: matchPhrase })
      }
    } else if (ops.keyword) {
      // or search - skip
    } else {
      const shouldPhase = []
      for (const f of fields) {
        const matchPhrase: Record<string, string> = {}
        matchPhrase[f] = kw
        shouldPhase.push({ match_phrase: matchPhrase })
      }
      bool.must.push({ bool: { should: shouldPhase } })
    }
  }

  // Advanced / Facet queries
  for (const field in routeQuery) {
    if (!field.startsWith('q-') && !field.startsWith('fc-')) continue

    const prefix = field.split('-')[0]
    const type = prefix
    const mustOfFilter = prefix === 'q' ? 'must' : 'filter'
    const boolQuery = ops[prefix] ? 'should' : mustOfFilter

    const value = routeQuery[field]
    const rawValues = Array.isArray(value) ? value : [value as string]
    // Split comma-separated values for Mod facet fields (legacy URL compatibility)
    const facetName = type === 'fc' ? field.slice(3) : ''
    const values = type === 'fc' && MOD_FACET_FIELDS.has(facetName)
      ? rawValues.flatMap((v) => splitForFacet(v))
      : rawValues

    const pluses: string[] = []
    const minuses: string[] = []

    for (const v of values) {
      if (v.startsWith('-')) {
        minuses.push(v.slice(1))
      } else {
        pluses.push(v)
      }
    }

    // Resolve actual index field name for q- params (URL-safe names → spaced names)
    const rawQField = field.slice(2)
    const resolvedQField = Q_FIELD_NAME_MAP[rawQField] ?? rawQField

    // Minuses
    for (const v of minuses) {
      if (type === 'fc') {
        const termPhase: Record<string, string> = {}
        termPhase[field.slice(3) + '.keyword'] = v
        bool.must_not.push({ term: termPhase })
      } else {
        const termPhase: Record<string, string> = {}
        termPhase[resolvedQField] = v
        bool.must_not.push({ term: termPhase })
      }
    }

    if (pluses.length === 0) continue

    if (type === 'fc') {
      const shoulds: unknown[] = []
      for (const v of pluses) {
        const termPhase: Record<string, string> = {}
        termPhase[field.slice(3) + '.keyword'] = v
        shoulds.push({ term: termPhase })
      }
      bool[boolQuery].push({ bool: { should: shoulds } })
    } else {
      for (const v of pluses) {
        const termPhase: Record<string, string> = {}
        termPhase[resolvedQField] = v
        bool[boolQuery].push({ term: termPhase })
      }
    }
  }

  const sort = routeQuery.sort ? (routeQuery.sort as string) : null
  const sorts: unknown[] = []
  if (sort != null && !sort.includes('_score')) {
    const tmp = sort.split(':')
    const f = tmp[0]
    const order = tmp[1]
    const obj: Record<string, unknown> = {}
    obj[f] = { order }
    sorts.push(obj)
    sorts.push('_score')
  }

  return { query, aggs, size, from, sort: sorts }
}

export async function loadIndex(u: string): Promise<{ data: unknown[]; index: Record<string, Record<string, number[]>> }> {
  const response = await fetch(u)
  const results = await response.json()

  const data: unknown[] = []
  const index: Record<string, Record<string, number[]>> = {}

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const _source: Record<string, unknown> = {}
    let fulltext = ''

    for (const key in result) {
      if (key.startsWith('_')) continue
      let values = result[key]
      values = Array.isArray(values) ? values : [values]
      _source[key] = values

      if (!index[key]) index[key] = {}

      for (const value of values) {
        if (value && String(value).startsWith('http')) continue
        if (!index[key][value]) index[key][value] = []
        index[key][value].push(i)
        fulltext += value + ' '
      }
    }

    // ID indexing
    const _id = result._id
    if (!index._id) index._id = {}
    if (!index._id[_id]) index._id[_id] = []
    index._id[_id].push(i)

    // Full text indexing
    if (!index._full_text) index._full_text = {}
    if (!index._full_text[fulltext]) index._full_text[fulltext] = []
    index._full_text[fulltext].push(i)

    if (result._label) _source._label = [result._label]
    if (result._image) _source._thumbnail = [result._image]
    if (result._related) _source._relatedLink = [result._related]
    if (result._url) _source._url = [result._url]

    data.push({ _id, _source })
  }

  return { data, index }
}

export function initStore(
  store: { setIndex: (idx: Record<string, Record<string, number[]>> | null) => void; setData: (data: unknown[]) => void },
  indexData: { data: unknown[]; index: unknown }
) {
  store.setIndex(indexData.index as Record<string, Record<string, number[]>> | null)
  store.setData(indexData.data as unknown[])
}

export function search(
  index: Record<string, Record<string, number[]>>,
  dataAll: unknown[],
  query: Record<string, unknown>
): Record<string, unknown> {
  const indexes = filter(index, dataAll, query)
  let dataFiltered = getDataFiltered(indexes, dataAll)
  const facets = createFacets(index, indexes, query.aggs as Record<string, unknown>)
  dataFiltered = sortData(query.sort as unknown[], dataFiltered)
  const results = getResult(dataFiltered, query.from as number, query.size as number)

  return {
    aggregations: facets,
    hits: {
      hits: results,
      total: {
        relation: query.sort,
        value: dataFiltered.length,
      },
    },
  }
}

function filter(
  index: Record<string, Record<string, number[]>>,
  dataAll: unknown[],
  query: Record<string, unknown>
): number[] {
  const indexAll: number[] = []
  for (let i = 0; i < dataAll.length; i++) indexAll.push(i)

  const q = query.query as Record<string, unknown> | undefined
  if (!q) return indexAll

  const filters = (q.bool as Record<string, unknown[]>)

  let mustIndexes: Set<number> = new Set(indexAll)
  let shouldIndexes: Set<number> = new Set()

  const flags: Record<string, boolean> = {
    filter: false,
    must: false,
    must_not: false,
    should: false,
  }

  for (const type in filters) {
    const typedArray = filters[type] as Record<string, unknown>[]
    if (typedArray.length > 0) flags[type] = true

    for (const typedObj of typedArray) {
      let typedResult: Set<number>

      if (!typedObj.bool) {
        typedResult = getIds(index, indexAll, typedObj, type)
      } else {
        const shouldArray = (typedObj.bool as Record<string, unknown[]>).should
        typedResult = new Set<number>()
        for (const item of shouldArray) {
          const indexArray = getIds(index, indexAll, item as Record<string, unknown>, type)
          typedResult = new Set([...typedResult, ...indexArray])
        }
      }

      if (type !== 'should') {
        mustIndexes = new Set([...mustIndexes].filter((e) => typedResult.has(e)))
      } else {
        shouldIndexes = new Set([...shouldIndexes, ...typedResult])
      }
    }
  }

  if (flags.should && !flags.must && !flags.filter && !flags.must_not) {
    mustIndexes = new Set()
  }

  return [...new Set([...mustIndexes, ...shouldIndexes])]
}

function getIds(
  index: Record<string, Record<string, number[]>>,
  indexAll: number[],
  ph: Record<string, unknown>,
  type: string
): Set<number> {
  const phaseType = Object.keys(ph)[0]
  const obj = ph[phaseType] as Record<string, string>
  let term = Object.keys(obj)[0]
  let value = obj[term]

  const lowerFlag = term !== 'Phone/Word.keyword'
  value = lowerFlag ? value.toLowerCase() : value

  let result: number[] = type === 'must_not' ? [...indexAll] : []

  if (!term.includes('.keyword')) {
    const map = index[term]
    if (map) {
      for (const field in map) {
        const fieldMod = lowerFlag ? field.toLowerCase() : field
        if (fieldMod.includes(value)) {
          const ids = map[field]
          if (type !== 'must_not') {
            result = result.concat(ids)
          } else {
            result = result.filter((x) => !ids.includes(x))
          }
        }
      }
    }
  } else {
    term = term.replace('.keyword', '')
    const map = index[term]
    if (map) {
      for (const field in map) {
        const fieldMod = lowerFlag ? field.toLowerCase() : field
        if (fieldMod === value) {
          const ids = map[field]
          if (type !== 'must_not') {
            result = result.concat(ids)
          } else {
            result = result.filter((x) => !ids.includes(x))
          }
        }
      }
    }
  }

  return new Set(result)
}

function getDataFiltered(indexes: number[], dataAll: unknown[]): unknown[] {
  return indexes.map((i) => dataAll[i])
}

function createFacets(
  index: Record<string, Record<string, number[]>>,
  indexes: number[],
  queryAggs: Record<string, unknown>
): Record<string, unknown> {
  const aggs: Record<string, unknown> = {}

  for (const label in queryAggs) {
    const aggDef = queryAggs[label] as Record<string, unknown>
    const obj = aggDef.terms as Record<string, unknown>

    let size = obj.size ? Number(obj.size) : -1
    const field = (obj.field as string).replace('.keyword', '')
    const map = index[field]

    const mapNew: Record<string, number> = {}
    if (map) {
      for (const value in map) {
        const values = map[value]
        let docCount = 0
        for (const v of values) {
          if (indexes.includes(v)) docCount++
        }
        if (docCount > 0) mapNew[value] = docCount
      }
    }

    const arr = Object.keys(mapNew).map((e) => ({
      key: e,
      value: mapNew[e],
    }))

    const order = obj.order as Record<string, string>
    const queryKey = Object.keys(order)[0]
    const sortKey = queryKey === '_term' ? 'key' : 'value'
    const orderDir = order[queryKey] === 'asc' ? -1 : 1

    arr.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return orderDir
      if (a[sortKey] > b[sortKey]) return -1 * orderDir
      return 0
    })

    if (size === -1 || size > arr.length) size = arr.length

    const buckets = []
    for (let i = 0; i < size; i++) {
      buckets.push({ key: arr[i].key, doc_count: arr[i].value })
    }

    aggs[label] = { buckets }
  }

  return aggs
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function sortData(sort: unknown[], dataFiltered: unknown[]): unknown[] {
  const sortArr = Array.isArray(sort) ? sort : [sort]
  const sortObj = sortArr[0] as Record<string, unknown> | undefined
  if (!sortObj) return dataFiltered

  let field = Object.keys(sortObj)[0]
  if (field === '_random') return shuffle(dataFiltered)

  const sortDef = sortObj[field] as Record<string, string>
  const type = sortDef.order
  field = field.replace('.keyword', '')

  const ascFlg = type !== 'desc'
  let v1 = ascFlg ? 1 : -1
  let v2 = ascFlg ? -1 : 1

  const sorted = [...dataFiltered]
  sorted.sort((a: unknown, b: unknown) => {
    const aSource = (a as Record<string, unknown>)._source as Record<string, string[]>
    const bSource = (b as Record<string, unknown>)._source as Record<string, string[]>
    if (!aSource[field]) return v1
    if (!bSource[field]) return v2
    if (aSource[field][0] > bSource[field][0]) return v1
    if (aSource[field][0] < bSource[field][0]) return v2
    return 0
  })

  return sorted
}

function getResult(dataFiltered: unknown[], from: number, size: number): unknown[] {
  let to = from + size
  if (to > dataFiltered.length) to = dataFiltered.length
  return dataFiltered.slice(from, to)
}

export function getSearchQueryFromQueryStore(
  state: {
    sort: string
    size: number
    currentPage: number
    col: number
    layout: string
    keyword: string[]
    advanced: { q: Record<string, { '+': string[]; '-': string[] }>; fc: Record<string, { '+': string[]; '-': string[] }> }
  },
  u?: string | string[]
): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {
    sort: state.sort,
    size: String(state.size),
    from: String((state.currentPage - 1) * state.size),
    col: String(state.col),
    layout: state.layout,
  }

  if (state.keyword.length > 0) {
    params.keyword = state.keyword
  }

  const advanced = state.advanced
  const types = ['fc', 'q'] as const
  for (const type of types) {
    for (const label in advanced[type]) {
      const values: string[] = []
      const obj = advanced[type][label]
      for (const method in obj) {
        const arr = obj[method as keyof typeof obj]
        for (const value of arr) {
          values.push(method === '+' ? value : '-' + value)
        }
      }
      if (values.length > 0) {
        params[label] = values
      }
    }
  }

  if (u) {
    params.u = Array.isArray(u) ? u[0] : u
  }

  return params
}
