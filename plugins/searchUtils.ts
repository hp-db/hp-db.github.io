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
  createQuery(routeQuery: any, config: any): any {
    const fcs = Object.keys(config.facetLabels) // JSON.parse(process.env.FACETS_LABELS)

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

      // aggs
      aggs[field] = {
        terms: {
          field: field + '.keyword',
          size: FC_SIZE,
          order: {
            _count: 'desc',
          },
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

  handleManifests(manifests: any[]) {
    const results: any[] = []
    for (let i = 0; i < manifests.length; i++) {
      const manifest: any = manifests[i]

      const obj: any = {
        _id: manifest['@id'],

        _source: {
          _label: [manifest.label],

          _manifest: [manifest['@id']],
        },
      }

      if (manifest.thumbnail) {
        obj._source._thumbnail = [manifest.thumbnail]
      }

      if (manifest.texts) {
        obj.texts = manifest.texts
      }

      if (manifest.images) {
        obj.images = manifest.images
      }

      if (manifest.attribution) {
        let values = manifest.attribution
        if (!Array.isArray(values)) {
          values = [values]
        }
        const values2 = []
        for (let j = 0; j < values.length; j++) {
          let value2 = values[j]
          if (value2['@value']) {
            value2 = value2['@value']
          }
          values2.push(value2)
        }
        obj._source.Attribution = values2
      }

      let related
      if (manifest.related) {
        related = manifest.related
      } else {
        related =
          'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=' +
          encodeURIComponent(manifest['@id'])
      }
      obj._source._related = [related]

      if (manifest.description) {
        obj._source.Description = [manifest.description]
      }

      const entity: any = {}

      const metadata = manifest.metadata
      if (metadata) {
        for (let k = 0; k < metadata.length; k++) {
          const m = metadata[k]
          // 全て配列に
          let values = m.value
          if (!Array.isArray(values)) {
            values = [values]
          }

          if (!obj._source[m.label]) {
            obj._source[m.label] = []
          }
          for (let l = 0; l < values.length; l++) {
            const value = values[l]
            if (!obj._source[m.label].includes(value)) {
              obj._source[m.label].push(value)
            }
            // obj._source[m.label] = values
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
        }
      }

      obj.entity = entity

      results.push(obj)
    }

    return results
  }

  handleCollections(collections: any[], hie: number) {
    const manifests: any[] = []

    for (let i = 0; i < collections.length; i++) {
      const collection: any = collections[i]
      let results = []
      if (collection.manifests) {
        results = this.handleManifests(collection.manifests)
      } else {
        results = this.handleCollections(collection.collections, hie + 1)
      }

      for (let j = 0; j < results.length; j++) {
        const manifest = results[j]
        if (collection.label) {
          manifest._source[('0000000000' + hie).slice(-2) + ' Collection'] = [
            collection.label,
          ]
        }
        manifests.push(manifest)
      }
    }
    return manifests
  }

  initStore(store: any, index: any) {
    store.commit('setIndex', index.index)
    store.commit('setData', index.data)
    store.commit('setTitle', index.title)
    store.commit('setThumbnail', index.thumbnail)
    store.commit('setDescription', index.description)
    store.commit('setAttribution', index.attribution)
    store.commit('setJson', index.json)
    store.commit('setEntity', index.entity)
    store.commit('setApi', index.api)
    if (index.layout) {
      store.commit('setLayout', index.layout)
    }
  }

  async createIndex(u: string): Promise<any> {
    const data = await axios.get(u).then((response) => {
      const result = response.data

      if (result['@type'] === 'sc:Collection') {
        return this.createIndexFromIIIFCollection(result)
      } else if (result['@type'] === 'cr:Curation') {
        return this.createIndexFromIIIFCurationList(result)
      } else {
        return {}
      }
    })

    return data
  }

  createIndexFromIIIFCollection(collection: any): any {
    let manifests = []
    if (collection.manifests) {
      manifests = this.handleManifests(collection.manifests)
    } else if (collection.collections) {
      manifests = this.handleCollections(collection.collections, 1)
    }

    let pos = 1

    const index: any = {}

    const data = []

    const entities: any = {}

    for (let i = 0; i < manifests.length; i++) {
      const obj = manifests[i]

      let fulltext = ''
      const posIndex: number = pos - 1

      // Indexに登録

      for (const key in obj._source) {
        if (!index[key]) {
          index[key] = {}
        }

        const values = obj._source[key]

        for (let j = 0; j < values.length; j++) {
          let value = values[j]

          let values2: string[] = []
          if (Array.isArray(value)) {
            for (let k = 0; k < value.length; k++) {
              let value3 = value[k]
              if (value3['@value']) {
                value3 = value3['@value']
              }

              if (!values2.includes(value3)) {
                values2.push(value3)
              }
            }
          } else {
            if (value['@value']) {
              value = value['@value']
            }
            values2 = [value]
          }

          for (let l = 0; l < values2.length; l++) {
            const value2 = values2[l]

            // URIの場合は無視
            if (value2 == null || String(value2).startsWith('http')) {
              continue
            }

            if (!index[key][value2]) {
              index[key][value2] = []
            }

            index[key][value2].push(posIndex)

            fulltext += value2 + ' '
          }
        }
      }

      const key = '_full_text'

      if (!index[key]) {
        index[key] = {}
      }

      if (!index[key][fulltext]) {
        index[key][fulltext] = []
      }

      index[key][fulltext].push(posIndex)

      data.push(obj)

      pos += 1

      // Entity

      const currentEntities = obj.entity
      // console.log({ entities })
      for (const property in currentEntities) {
        if (!entities[property]) {
          entities[property] = {}
        }

        const entity = currentEntities[property]
        for (const uri in entity) {
          const label: string = entity[uri].label

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

    let layout = 'list'
    if (collection.viewingHint === 'grid') {
      layout = 'grid'
    }

    return {
      data,
      index,
      title: collection.label,
      thumbnail: collection.thumbnail,
      description: collection.description,
      attribution: collection.attribution,
      json: collection,
      entity: entities,
      api: collection.api,
      layout,
    }
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

    // 大文字小文字を区別しない
    value = value.toLowerCase()

    let result: number[] = []

    if (type === 'must_not') {
      result = indexAll
    }

    // const union: number[] = [] // must_not用

    if (!term.includes('.keyword')) {
      // 部分一致
      const map = index[term]
      for (const field in map) {
        if (field.toLowerCase().includes(value)) {
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
        if (field.toLowerCase() === value) {
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

      // オブジェクトに変換
      const arr = Object.keys(mapNew).map((e) => ({
        key: e,
        value: mapNew[e],
      }))

      // 値でそーと
      arr.sort(function (a, b) {
        if (a.value < b.value) return 1
        if (a.value > b.value) return -1
        return 0
      })

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
}

export default (_: any, inject: any) => {
  inject('searchUtils', new SearchUtils())
}
