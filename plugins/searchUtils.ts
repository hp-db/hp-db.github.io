import axios from 'axios'

function convert2arr(value: any): string[] {
  let values: string[] = []
  if (!Array.isArray(value)) {
    values = [value]
  } else {
    values = value
  }
  return values
}
// /plugins/logger.ts
export class SearchUtils {
  splitKeyword(keyword: string): string[] {
    // 全角を半角に変換
    // 空の配列を削除
    // eslint-disable-next-line
    const keywords: string[] = keyword.replace(/　/g, ' ').split(' ').filter(item => item !== "")

    const keywords2: any[] = []
    for (let i = 0; i < keywords.length; i++) {
      const keyword: string = keywords[i]
      const splitTmp = keyword.split(':')
      if (splitTmp.length === 2) {
        keywords2.push({
          label: 'q-' + splitTmp[0].trim(),
          value: splitTmp[1].trim(),
        })
      } else {
        keywords2.push({
          label: 'keyword',
          value: keyword,
        })
      }
    }

    return keywords2
  }

  createFacetQuery(arr: any[]): { [key: string]: string } {
    const result: { [key: string]: string } = {}
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i]
      result[obj.field] = obj.value
    }
    return result
  }

  createQuery(routeQuery: any, config: any, max = true): any {
    const fcs = Object.keys(config.facetOptions) // JSON.parse(process.env.FACETS_LABELS)

    // const qs = Object.keys(config.termLabels)

    // 検索対象メタデータ
    const fields = ['_full_text', '_title'] // JSON.parse(process.env.SEARCH_LABELS)

    const FC_SIZE = 50

    const from = routeQuery.from ? Number(routeQuery.from) : 0
    let size = routeQuery.size ? Number(routeQuery.size) : config.size

    const ops: any = {
      keyword: routeQuery.keywordOr === 'true',
      q: routeQuery.advancedOr === 'true',
      fc: routeQuery.facetOr === 'true',
    }

    // const advancedOr: boolean = routeQuery.advancedOr === 'true'

    if (size > 500) {
      size = 500
    }

    // -------------------------

    // Aggregation

    const aggs: any = {}

    const fcsMap: any = {}
    for (let i = 0; i < fcs.length; i++) {
      const field = fcs[i]
      const fcsField = 'fc-' + field
      if (routeQuery[fcsField]) {
        const value = routeQuery[fcsField]
        let values = []
        if (!Array.isArray(value)) {
          values = [value]
        } else {
          values = value
        }
        fcsMap[fcsField] = values
      }

      const option = config.facetOptions[field]

      let orderKey = option.orderKey || "_count"
      let orderValue = option.orderValue || "desc"

      const order: any = {}
      order[orderKey] = orderValue

      // aggs
      aggs[field] = {
        terms: {
          field: field + '.keyword',
          size: max ? (option.size || FC_SIZE) : -1,
          order
        },
      }
    }

    // クエリ本体

    const query: any = {
      bool: {
        must: [],
        should: [],
        filter: [],
        must_not: [],
      },
    }

    // キーワード
    const keyword = routeQuery.keyword ? routeQuery.keyword : []
    let keywords = []
    if (!Array.isArray(keyword)) {
      keywords = [keyword]
    } else {
      keywords = keyword
    }

    // const kerwordPhase = []
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i]

      // キーワード NOT
      if (keyword.startsWith('-')) {
        // const mustNotPhase = []

        for (let j = 0; j < fields.length; j++) {
          const matchPhrase: any = {}
          matchPhrase[fields[j]] = keyword.slice(1)

          query.bool.must_not.push({
            match_phrase: matchPhrase,
          })
        }
      } else if (ops.keyword) {
        // or 検索
      } else {
        const shouldPhase = []

        for (let j = 0; j < fields.length; j++) {
          const matchPhrase: any = {}
          matchPhrase[fields[j]] = keyword
          shouldPhase.push({
            match_phrase: matchPhrase,
          })
        }

        query.bool.must.push({
          bool: {
            should: shouldPhase,
          },
        })
      }

      /*
        const shouldPhase = []

        for (let j = 0; j < fields.length; j++) {
          const matchPhrase: any = {}
          matchPhrase[fields[j]] = keyword
          shouldPhase.push({
            match_phrase: matchPhrase,
          })
        }

        query.bool[ops.keyword ? 'should' : 'must'].push({
          bool: {
            should: shouldPhase,
          },
        })
        */
    }

    // ---------------------

    for (const field in routeQuery) {
      if (field.startsWith('q-') || field.startsWith('fc-')) {
        const qsField = field

        const type: string = qsField.split('-')[0]

        const prefix: string = qsField.split('-')[0]

        const mustOfFilter: string = prefix === 'q' ? 'must' : 'filter' // fc-の場合はfilter

        const boolQuery = ops[prefix] ? 'should' : mustOfFilter // OR条件

        const value = routeQuery[qsField]
        let values = []
        if (!Array.isArray(value)) {
          values = [value]
        } else {
          values = value
        }

        const pluses: string[] = []
        const minuses: string[] = []

        for (let j = 0; j < values.length; j++) {
          const value = values[j]
          if (value.startsWith('-')) {
            minuses.push(value.slice(1))
          } else {
            pluses.push(value)
          }
        }

        // minuses
        for (let j = 0; j < minuses.length; j++) {
          const value = minuses[j]
          if (type === 'fc') {
            const termPhase: any = {}
            termPhase[field.slice(3) + '.keyword'] = value // "fc-"の除外

            query.bool.must_not.push({
              term: termPhase,
            })
          } else {
            const termPhase: any = {}
            termPhase[field.slice(2)] = value // "-"の除外 // "q-"の除外

            query.bool.must_not.push({
              term: termPhase,
            })
          }
        }

        if (pluses.length === 0) {
          continue
        }
        // ファセット か 否か
        if (type === 'fc') {
          const shoulds: any[] = []
          for (let j = 0; j < pluses.length; j++) {
            const value = values[j]
            const termPhase: any = {}
            termPhase[field.slice(3) + '.keyword'] = value // "q-"の除外

            shoulds.push({
              term: termPhase,
            })
          }
          query.bool[boolQuery].push({
            bool: {
              should: shoulds,
            },
          })
        } else {
          // plus
          for (let j = 0; j < pluses.length; j++) {
            const value = values[j]
            const termPhase: any = {}
            termPhase[field.slice(2)] = value // "q-"の除外

            query.bool[boolQuery].push({
              term: termPhase,
            })
          }
        }

        /*
        for (let j = 0; j < values.length; j++) {
          const value = values[j]

          // ファセット
          if (type === 'fc') {
            if (value.startsWith('-')) {
              // 除外
              const termPhase: any = {}
              termPhase[field.slice(3) + '.keyword'] = value.slice(1) // "fc-"の除外

              query.bool.must_not.push({
                term: termPhase,
              })
            } else {
              const termPhase: any = {}
              termPhase[field.slice(3) + '.keyword'] = value // "fc-"の除外

              query.bool[boolQuery].push({
                term: termPhase,
              })
            }
          }
          // 詳細検索
          else if (type === 'q') {
            // 除外
            if (value.startsWith('-')) {
              const termPhase: any = {}
              termPhase[field.slice(2)] = value.slice(1) // "-"の除外 // "q-"の除外

              query.bool.must_not.push({
                term: termPhase,
              })
            } else {
              const termPhase: any = {}
              termPhase[field.slice(2)] = value // "q-"の除外

              query.bool[boolQuery].push({
                term: termPhase,
              })
            }
          }
        }
        */
      }
    }

    const sort = routeQuery.sort ? routeQuery.sort : null
    const sorts = []
    if (sort != null && !sort.includes('_score')) {
      const tmp = sort.split(':')
      const field = tmp[0] // tmp[0].includes('_') ? tmp[0] + '.keyword' : tmp[0]
      const order = tmp[1]
      const obj: any = {}
      obj[field] = {
        order,
      }
      sorts.push(obj)
      sorts.push('_score')
    }

    const body = {
      query,
      aggs,
      size,
      from,
      sort: sorts,
    }

    return body
  }

  initStore(store: any, index: any) {
    store.commit('setIndex', index.index)
    store.commit('setData', index.data)
  }

  async loadIndex(u: string): Promise<any> {
    const result = await axios.get(u).then((response) => {
      const results = response.data

      const data: any[] = []
      const index: any = {}

      for (let i = 0; i < results.length; i++) {
        const result = results[i]

        // _source
        const _source: any = {}

        let fulltext: string = ''

        for (const key in result) {
          if (key.startsWith('_')) {
            continue
          }

          let values = result[key]
          values = Array.isArray(values) ? values : [values]
          _source[key] = values

          // インデックス開始

          if (!index[key]) {
            index[key] = {}
          }

          for (let j = 0; j < values.length; j++) {
            const value = values[j]

            // URIの場合は無視
            if (value && String(value).startsWith('http')) {
              continue
            }

            if (!index[key][value]) {
              index[key][value] = []
            }

            index[key][value].push(i)

            fulltext += value + ' '
          }

          // インデックス終了
        }

        // ID開始

        let key = '_id'

        const _id = result._id

        if (!index[key]) {
          index[key] = {}
        }

        if (!index[key][_id]) {
          index[key][_id] = []
        }

        index[key][_id].push(i)

        // フルテキスト開始

        key = '_full_text'

        if (!index[key]) {
          index[key] = {}
        }

        if (!index[key][fulltext]) {
          index[key][fulltext] = []
        }

        index[key][fulltext].push(i)

        // フルテキスト終了

        if (result._label) {
          _source._label = [result._label]
        }

        if (result._image) {
          _source._thumbnail = [result._image]
        }

        if (result._related) {
          _source._relatedLink = [result._related]
        }

        if (result._url) {
          _source._url = [result._url]
        }

        const item: any = {
          _id,
          _source,
        }

        data.push(item)
      }

      return {
        data,
        index,
      }
    })

    return result
  }

  async createIndex(u: string): Promise<any> {
    const data = await axios.get(u).then((response) => {
      const result = response.data

      if (result['@type'] === 'cr:Curation') {
        return this.createIndexFromIIIFCurationList(result)
      } else {
        return {}
      }
    })

    return data
  }

  async createIndexFromIIIFCurationList(curation: any): Promise<any> {
    const title: string = curation.label
    let thumbnail = ''
    const curationUri: string = curation['@id']

    if (curation.thumbnail) {
      thumbnail = curation.thumbnail
    }

    const data = []

    const selections = curation.selections

    let pos = 1

    const index: any = {} // this.index

    const pendings: any = {}

    const entities: any = {}

    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i]
      const members = selection.members

      const manifest = selection.within['@id']

      for (let j = 0; j < members.length; j++) {
        const member = members[j]

        let fulltext = ''

        if (i === 0 && j === 0 && thumbnail === '') {
          thumbnail = member.thumbnail
        }

        let label = member.label
        if (label['@value']) {
          label = label['@value']
        }

        const obj: any = {
          // _id: [member['@id']],
          _label: [label],
        }

        if (member.related) {
          obj._related = [member.related]
        }

        if (member.thumbnail) {
          obj._thumbnail = [member.thumbnail]
        } else {
          if (!pendings[manifest]) {
            pendings[manifest] = {}
          }
          pendings[manifest][pos - 1] = member['@id']
        }

        const entity: any = {}
        const metadata = member.metadata
        if (metadata) {
          for (let k = 0; k < metadata.length; k++) {
            const m = metadata[k]

            // 全て配列に
            let values = m.value
            if (!Array.isArray(values)) {
              values = [values]
            }

            const value = values[0]
            if (value && value['@type'] === 'oa:Annotation') {
              const chars = value.resource.chars.replace(/<[^>]*>?/gm, '')
              obj._label = [chars]
              continue
            }

            if (!obj[m.label]) {
              obj[m.label] = []
            }

            for (let l = 0; l < values.length; l++) {
              const value = values[l]
              if (!obj[m.label].includes(value)) {
                obj[m.label].push(value)
              }
            }

            // entity
            if (m.property) {
              const propertyUri = m.property
              if (!entity[propertyUri]) {
                entity[propertyUri] = {}
              }

              if (m.uri) {
                if (!entity[propertyUri][m.uri]) {
                  entity[propertyUri][m.uri] = {
                    label: m.value,
                  }
                }
              } else if (!entity[propertyUri][m.value]) {
                entity[propertyUri][m.valu] = {
                  label: m.value,
                }
              }
            }

            // entity
            if (m.property) {
              const property = m.property

              if (!entities[property]) {
                entities[property] = {}
              }

              const uri = m.uri
              const label = m.value

              if (!entities[property][uri]) {
                entities[property][uri] = {
                  label,
                  count: 0,
                }
              }

              const count = entities[property][uri].count + 1
              entities[property][uri].count = count
            }
          }
        }

        obj._manifest = [manifest]

        // インデクシング
        for (const key in obj) {
          if (!index[key]) {
            index[key] = {}
          }

          const values = obj[key]

          for (let j = 0; j < values.length; j++) {
            const value = values[j]

            if (Array.isArray(value)) {
              continue
            }

            if (value && value['@id']) {
              continue
            }

            // URIの場合は無視
            if (
              value &&
              String(value).startsWith('http') &&
              key !== '_manifest'
            ) {
              continue
            }

            if (!index[key][value]) {
              index[key][value] = []
            }

            const posIndex = pos - 1

            index[key][value].push(posIndex)

            fulltext += value + ' '
          }
        }

        const key = '_full_text'

        if (!index[key]) {
          index[key] = {}
        }

        if (!index[key][fulltext]) {
          index[key][fulltext] = []
        }

        index[key][fulltext].push(pos - 1)

        obj._curation = [curationUri]
        obj._pos = [pos]

        const item: any = {
          _id: obj.m_sort[0],
          _source: obj,
          entity,
        }

        if (member.images) {
          item.images = member.images
        }

        if (member.texts) {
          item.texts = member.texts
        }

        data.push(item)

        pos += 1
      }
    }

    for (const manifest in pendings) {
      const canvasImgMap = await axios
        .get(manifest)
        .then((response) => {
          const canvasImgMap: any = {}
          const canvases = response.data.sequences[0].canvases
          for (let i = 0; i < canvases.length; i++) {
            const canvas = canvases[i]
            if (canvas.images[0].resource.service) {
              canvasImgMap[canvas['@id']] =
                canvas.images[0].resource.service['@id'] + '/info.json'
            } else {
              canvasImgMap[canvas['@id']] = canvas.images[0].resource['@id']
            }
          }
          return canvasImgMap
        })
        .catch(() => {
          return null
        })
      if (!canvasImgMap) {
        continue
      }
      const poses = pendings[manifest]
      for (const i in poses) {
        const memberId = poses[i].split('#xywh=')
        const canvasUri = memberId[0]
        const area = memberId[1]
        let image = canvasImgMap[canvasUri]
        if (image) {
          if (image.includes('info.json')) {
            image = image.replace('info.json', area + '/256,/0/default.jpg')
          }

          data[Number(i)]._source._thumbnail = [image]
        }
      }
    }

    let layout = 'list'
    if (curation.viewingHint === 'annotation') {
      layout = 'table'
    } else if (curation.viewingHint) {
      layout = curation.viewingHint
    }

    return {
      data,
      index,
      title,
      thumbnail,
      json: curation,
      entity: entities,
      api: curation.api,
      layout,
      description: curation.description,
    }
  }

  search(index: any, dataAll: any[], query: any): any {
    const indexes = this.filter(index, dataAll, query)
    let dataFiltered = this.getDataFiltered(indexes, dataAll)
    const facets = this.createFacets(index, indexes, query.aggs)
    dataFiltered = this.sortData(query.sort, dataFiltered)
    const results = this.getResult(dataFiltered, query.from, query.size)
    const result: any = {
      aggregations: facets,
      hits: {
        hits: results,
        total: {
          relation: query.sort,
          value: dataFiltered.length,
        },
      },
    }

    return result
  }

  filter(index: any, dataAll: any[], query: any) {
    const indexAll = []
    for (let i = 0; i < dataAll.length; i++) {
      indexAll.push(i)
    }

    // const methods: string[] = ['should', 'must', 'must_not']

    if (!query.query) {
      return indexAll
    }

    const filters: any[] = query.query.bool

    let mustIndexes: any = new Set(indexAll)
    let shouldIndexes: any = new Set()

    const flags: any = {
      filter: false,
      must: false,
      must_not: false,
      should: false,
    }

    for (const type in filters) {
      const typedArray = filters[type]

      if (typedArray.length > 0) {
        flags[type] = true
      }

      for (let i = 0; i < typedArray.length; i++) {
        const typedObj = typedArray[i]

        let typedResult: any = new Set()

        if (!typedObj.bool) {
          // キーワード検索以外
          typedResult = this.getIds(index, indexAll, typedObj, type)
        } else {
          const shouldArray = typedObj.bool.should
          typedResult = new Set([])
          for (let j = 0; j < shouldArray.length; j++) {
            const indexArray = this.getIds(
              index,
              indexAll,
              shouldArray[j],
              type
            )
            typedResult = new Set([...typedResult, ...indexArray])
          }
        }

        if (type !== 'should') {
          mustIndexes = new Set(
            [...mustIndexes].filter((e) => typedResult.has(e))
          )
        } else {
          shouldIndexes = new Set([...shouldIndexes, ...typedResult])
        }
      }
    }

    // OR検索のみの場合はmustIndexesを初期化
    if (flags.should && !flags.must && !flags.filter && !flags.must_not) {
      mustIndexes = new Set([])
    }

    const intersection = new Set([...mustIndexes, ...shouldIndexes])

    const results = []

    for (const value of intersection) {
      results.push(value)
    }

    return results
  }

  getIds(index: any, indexAll: number[], ph: any, type: string): any {
    const phaseType = Object.keys(ph)[0] // match_phase or term

    const obj: any = ph[phaseType]

    let term = Object.keys(obj)[0]

    let value = obj[term]

    const lowerFlag = term !== 'Phone/Word.keyword'

    // 大文字小文字を区別しない
    value = lowerFlag ? value.toLowerCase() : value

    let result: number[] = []

    if (type === 'must_not') {
      result = indexAll
    }

    // const union: number[] = [] // must_not用

    if (!term.includes('.keyword')) {
      // 部分一致
      const map = index[term]
      for (const field in map) {
        const fieldMod = lowerFlag ? field.toLowerCase() : field
        if (fieldMod.includes(value)) {
          const ids = map[field]
          if (type !== 'must_not') {
            result = result.concat(ids) // 結合
          } else {
            // 含まない場合
            result = result.filter(function (x) {
              return !ids.includes(x)
            })
          }
        }
      }
    } else {
      term = term.replace('.keyword', '') // 完全一致
      const map = index[term]
      for (const field in map) {
        const fieldMod = lowerFlag ? field.toLowerCase() : field
        if (fieldMod === value) {
          const ids = map[field]
          if (type !== 'must_not') {
            result = result.concat(ids)
          } else {
            // 含まない場合
            result = result.filter(function (x) {
              return !ids.includes(x)
            })
          }
        }
      }
    }

    return new Set(result)
  }

  getDataFiltered(indexes: any[], dataAll: any[]) {
    const dataFiltered = []
    for (let i = 0; i < indexes.length; i++) {
      dataFiltered.push(dataAll[indexes[i]])
    }
    return dataFiltered
  }

  createFacets(
    index: any,
    /* facetLabels: string[], */
    indexes: any,
    queryAggs: any
  ) {
    const aggs: any = {}

    for (const label in queryAggs) {
      const obj = queryAggs[label].terms

      let size = obj.size ? Number(obj.size) : -1
      const field = obj.field.replace('.keyword', '')
      const map = index[field]

      const mapNew: any = {}
      for (const value in map) {
        const intersection = []
        const values = map[value]

        for (let i = 0; i < values.length; i++) {
          if (indexes.includes(values[i])) {
            intersection.push(values[i])
          }
        }

        const docCount = intersection.length

        if (docCount > 0) {
          mapNew[value] = docCount
        }
      }

      // ---- 以下、ソート ----

      // オブジェクトに変換
      const arr = Object.keys(mapNew).map((e) => ({
        key: e,
        value: mapNew[e],
      }))

      const queryKey = Object.keys(obj.order)[0]
      
      let sortKey = "value"
      if(queryKey == "_term"){
        sortKey = "key"
      }

      let order = 1
      if(obj.order[queryKey] == "asc"){
        order = -1
      }

      arr.sort(function (a: any, b: any) {
        if (a[sortKey] < b[sortKey]) return order
        if (a[sortKey] > b[sortKey]) return -1 * order
        return 0
      })

      //---------
      
      if (size === -1 || size > arr.length) {
        size = arr.length
      }

      const buckets: any[] = []
      for (let i = 0; i < size; i++) {
        const key = arr[i].key
        const bucket: any = {
          key,
          doc_count: arr[i].value,
        }
        buckets.push(bucket)
      }

      aggs[label] = {
        buckets,
      }
    }

    return aggs
  }

  shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  sortData(sort: any, dataFiltered: any): any {
    const sortObj: any = convert2arr(sort)[0]

    if (!sortObj) {
      return dataFiltered
    }
    let field = Object.keys(sortObj)[0]

    if (field === '_random') {
      return this.shuffle(dataFiltered)
    }

    const type: string = sortObj[field].order

    field = field.replace('.keyword', '')

    let ascFlg = true
    if (type === 'desc') {
      ascFlg = false
    }

    let v1 = 1
    let v2 = -1
    if (!ascFlg) {
      v1 *= -1
      v2 *= -1
    }

    dataFiltered.sort(function (a: any, b: any) {
      /*
      if (!a._source[field] || !b._source[field]) {
        return 0
      }
      */
      // console.log(a._source[field], b._source[field])
      if (!a._source[field]) return v1
      if (!b._source[field]) return v2
      if (a._source[field][0] > b._source[field][0]) return v1
      if (a._source[field][0] < b._source[field][0]) return v2
      return 0
    })

    return dataFiltered
  }

  getResult(dataFiltered: any, from: number, size: number): any {
    const results = []
    let to = from + size
    if (to > dataFiltered.length) {
      to = dataFiltered.length
    }
    for (let i = from; i < to; i++) {
      results.push(dataFiltered[i])
    }
    return results
  }

  getSearchQueryFromQueryStore(query: any, u: any): any {
    const params: any = {
      sort: query.sort,
      size: query.size,
      from: (query.currentPage - 1) * query.size,
      col: query.col,
      layout: query.layout,
    }

    if (query.keyword.length > 0) {
      params.keyword = query.keyword
    }

    const advanced = query.advanced
    const types = ['fc', 'q']
    for (let t = 0; t < types.length; t++) {
      const type = types[t]
      for (const label in advanced[type]) {
        const values = []
        const obj = advanced[type][label]
        for (const method in obj) {
          const arr = obj[method]
          for (let i = 0; i < arr.length; i++) {
            const value = arr[i]
            values.push(method === '+' ? value : '-' + value)
          }
        }
        params[label] = values
      }
    }

    if (u) {
      params.u = u
    }

    return params
  }

  getTopMessage(size: number, top: number, lang: string) {
    let prefix: string = ''
    const suffix: string = lang === 'ja' ? '件' : ''
    if (size === top) {
      prefix = lang === 'ja' ? '上位' : 'Top '
    }
    return prefix + size.toLocaleString() + suffix
  }
}

export default (_: any, inject: any) => {
  inject('searchUtils', new SearchUtils())
}
