<template>
  <div>
    <v-container>
      <v-card class="my-5">
        <v-card-text>
          <v-select
            v-model="advanced_search['Vol']"
            :items="config.items_vol"
            attach
            chips
            label="Vol."
            multiple
          ></v-select>

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="advanced_search['Möller No']"
                label="Möller No."
                autocomplete="on"
                list="list_mno"
                @keyup.enter="search_move"
              ></v-text-field>
              <!-- 
              <datalist id="list_mno">
                <option :value="field" v-for="(obj, field) in index['Möller No']" :key="field" />
              </datalist>
              -->
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="advanced_search['Hieroglyph No']"
                label="Hieroglyph No."
                list="list_hno"
                @keyup.enter="search_move"
              ></v-text-field>
              <!-- 
              <datalist id="list_hno">
                <option :value="field" v-for="(obj, field) in index['Hieroglyph No']" :key="field" />
              </datalist>
              -->
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="advanced_search['Phone/Word']"
                label="Phone/Word"
                @keyup.enter="search_move"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="advanced_search['Note']"
            label="Notes"
            @keyup.enter="search_move"
          ></v-text-field>

          <v-btn color="primary" @click="search_move">Search</v-btn>
          <v-btn class="ml-4" @click="reset">Reset</v-btn>
        </v-card-text>
      </v-card>
    </v-container>

    <div style="background-color: #eeeeee" class="pb-5">
      <v-container>
        <v-row>
          <v-col>
            <h3>
              {{ ((query.page - 1) * query.size + 1).toLocaleString() }} -
              {{
                (query.page * query.size > total
                  ? total
                  : query.page * query.size
                ).toLocaleString()
              }}
              of {{ total.toLocaleString() }} results
            </h3>
          </v-col>
          <v-col>
            <v-select
              v-model="query.sort"
              :items="computed_items_sort"
              label="Sort by"
              @change="sort_move"
            ></v-select>
          </v-col>
        </v-row>

        <v-card outlined style="background-color: #eeeeee">
          <v-card-text>
            <span class="mr-2">Filtered by</span>

            <span
              v-for="(value, key) in advanced_search_display"
              :key="'a_' + key"
            >
              <!-- display重要 -->
              <v-btn
                v-if="value !== [] && value !== ''"
                color="primary"
                small
                class="mx-1 my-1"
                @click="
                  advanced_search[key] = ''
                  search(true)
                "
              >
                [Advanced] {{ key.replace('.keyword', '') }}:
                <b class="mx-2" :class="key === 'Phone/Word' ? 'phone' : ''">{{
                  value instanceof Array ? value.join(', ') : value
                }}</b>
                <span aria-hidden="true">&times;</span>
              </v-btn>
            </span>

            <span v-for="(value, key) in facet_search" :key="'f_' + key">
              <v-btn
                v-if="value !== [] && value !== ''"
                color="primary"
                small
                class="mx-1 my-1"
                @click="
                  facet_search[key] = ''
                  search(true)
                "
              >
                [Facet] {{ key.replace('.keyword', '') }}:
                <b class="mx-2" :class="key === 'Phone/Word' ? 'phone' : ''">{{
                  value instanceof Array ? value.join(', ') : value
                }}</b>
                <span aria-hidden="true">&times;</span>
              </v-btn>
            </span>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <v-container class="mt-5">
      <v-row>
        <v-col cols="12" sm="3" style="background-color: #eeeeee">
          <template v-if="total > 0">
            <h3 class="mb-5">Refine your search</h3>

            <v-card
              v-for="(obj, index) in results.aggregations"
              :key="'agg_' + index"
              class="my-5"
              outlined
            >
              <v-list subheader two-line flat>
                <v-subheader>{{ index }}</v-subheader>

                <div style="max-height: 400px; overflow-y: auto">
                  <v-list-item-group multiple>
                    <v-list-item
                      v-for="(bucket, index2) in obj.buckets"
                      :key="'bucket_' + index2"
                    >
                      <template v-if="bucket.key !== ''" v-slot:default="{}">
                        <v-list-item-action>
                          <v-checkbox
                            v-model="bucket.value"
                            color="primary"
                          ></v-checkbox>
                        </v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title
                            :class="index === 'Phone/Word' ? 'phone' : ''"
                            >{{ bucket.key }}</v-list-item-title
                          >
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-btn icon>{{ bucket.docCount }}</v-btn>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </div>
                <v-card-text>
                  <v-btn small color="primary" @click="facet_filter"
                    >Search</v-btn
                  >
                </v-card-text>
              </v-list>
            </v-card>
          </template>
        </v-col>
        <v-col cols="12" sm="9">
          <template v-if="total > 0">
            <div class="text-center">
              <v-pagination
                v-model="query.page"
                :length="pagination_length"
                :total-visible="7"
                @input="page_move()"
              ></v-pagination>
            </div>

            <div class="my-4 text-right">
              <v-btn color="primary" @click="compare"
                >Compare {{ selected.length }} items</v-btn
              >
              <v-btn class="ml-2" @click="reset_selected">Reset</v-btn>
              <v-dialog v-model="dialog" scrollable max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn class="ml-2" v-on="on">List</v-btn>
                </template>
                <v-card>
                  <v-card-title>Selected items</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px">
                    <v-list-item-group multiple>
                      <v-list-item
                        v-for="(id, index) in selected"
                        :key="'selected_' + index"
                      >
                        <template v-slot:default="{}">
                          <v-list-item-action>
                            <v-checkbox
                              v-model="selected_temporary[id]"
                              color="primary"
                            ></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title>{{
                              data_map[id].label
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue darken-1" text @click="dialog = false"
                      >Close</v-btn
                    >
                    <v-btn color="red darken-1" text @click="delete_selected"
                      >Delete</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>

            <v-card
              v-for="(obj, i) in results.hits.hits"
              :key="'result_' + i"
              class="my-5"
            >
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <span>
                      <b>Möller No.</b>
                      &nbsp;
                      <template v-for="(value, index) in obj['Möller No']">
                        <a
                          :key="index"
                          @click="
                            facet_search_move('facet_search', 'Möller No', [
                              value,
                            ])
                          "
                          >{{ value }}</a
                        >
                        <span
                          v-show="index !== obj['Möller No'].length - 1"
                          :key="'mno_' + index"
                          >&nbsp;+&nbsp;</span
                        >
                      </template>
                    </span>
                    <br />
                    <span>
                      <b>Hieroglyph No.</b>&nbsp;
                      <template v-for="(value, index) in obj['Hieroglyph No']">
                        <a
                          :key="index"
                          @click="
                            facet_search_move('facet_search', 'Hieroglyph No', [
                              value,
                            ])
                          "
                          >{{ value }}</a
                        >
                        <span
                          v-show="index !== obj['Hieroglyph No'].length - 1"
                          :key="'hno_' + index"
                          >&nbsp;+&nbsp;</span
                        >
                      </template>
                    </span>
                    <br />

                    <span>
                      <b>Phone/Word</b>&nbsp;
                      <template v-for="(value, index) in obj['Phone/Word']">
                        <div :key="index">
                          <span v-if="value.split('(').length > 1">(</span>
                          <a
                            :key="index"
                            class="phone"
                            @click="
                              facet_search_move('facet_search', 'Phone/Word', [
                                value.replace('(', '').replace(')', ''),
                              ])
                            "
                            >{{ value.replace('(', '').replace(')', '') }}</a
                          >
                          <span v-if="value.split(')').length > 1">)</span>
                          <span
                            v-show="index !== obj['Phone/Word'].length - 1"
                            :key="'ph_' + index"
                            >&nbsp;,&nbsp;</span
                          >
                        </div>
                      </template>
                    </span>
                    <br />
                    <span>
                      <b>Vol.</b>
                      &nbsp;{{ obj.Vol[0] }}
                    </span>
                    <br />
                    <template v-if="obj.Note[0] !== ''">
                      <span>
                        <b>Note</b>
                        &nbsp;{{ obj.Note[0] }}
                      </span>
                      <br />
                    </template>
                    <v-switch
                      v-model="obj.selected"
                      @change="select(obj.id, obj.selected)"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="8">
                    <a target="_blank" :href="obj.related">
                      <v-img
                        :src="obj.thumbnail[0]"
                        class="grey lighten-2"
                      ></v-img>
                    </a>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div class="text-center">
              <v-pagination
                v-model="query.page"
                :length="pagination_length"
                :total-visible="7"
                @input="page_move()"
              ></v-pagination>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

const facetSize = 50
export default {
  data: () => ({
    config: {
      items_vol: ['1', '2', '3'],
      items_sort: {
        'Möller No. Asc': {
          value: 'm_sort',
          type: 'asc',
        },
        'Möller No. Desc': {
          value: 'm_sort',
          type: 'desc',
        },
        'Hieroglyph No. Asc': {
          value: 'h_sort',
          type: 'asc',
        },
        'Hieroglyph No. Desc': {
          value: 'h_sort',
          type: 'desc',
        },
        'Vol. Asc': {
          value: 'Vol',
          type: 'asc',
        },
        'Vol. Desc': {
          value: 'Vol',
          type: 'desc',
        },
      },
    },
    query: {
      query: {},
      aggs: {},
      size: 20,
      from: 0,
      page: 1,
      sort: 'Möller No. Asc',
    },
    advanced_search: {
      Vol: [],
      Note: '',
      'Phone/Word': '',
      'Hieroglyph No': '',
      'Möller No': '',
    },
    advanced_search_display: {},
    facet_search: {
      Vol: [],
      'Hieroglyph No': [],
      'Möller No': [],
      'Phone/Word': [],
    },
    index: {}, // インデックス
    data_all: [], // 検索結果全数
    dataFiltered: [], // 検索結果数
    results: [], // ページで分けた数

    data_map: {},

    facets: {}, // ****,

    selected: [],
    selected_temporary: {},
    dialog: false,
  }),
  computed: {
    // 算出 getter 関数
    total() {
      let total = 0
      if (this.results.hits) {
        total = this.results.hits.total.value
      }
      return total
    },
    pagination_length() {
      return Math.ceil(this.total / this.query.size)
    },
    computed_items_sort() {
      const arr = []
      for (const key in this.config.items_sort) {
        arr.push(key)
      }
      return arr
    },
  },
  created() {
    const op = [
      {
        label: 'Vol',
        field: 'Vol.keyword',
      },
      {
        label: 'Möller No',
        field: 'Möller No.keyword',
      },
      {
        label: 'Hieroglyph No',
        field: 'Hieroglyph No.keyword',
      },
      {
        label: 'Phone/Word',
        field: 'Phone/Word Mod.keyword',
      },
    ]

    const aggs = {}
    for (let i = 0; i < op.length; i++) {
      const obj = op[i]
      aggs[obj.label] = {
        terms: {
          field: obj.field,
          order: {
            _count: 'desc',
          },
          size: facetSize,
        },
      }
    }
    this.query.aggs = aggs

    const param = this.$route.query

    if (param.advanced) {
      this.advanced_search = JSON.parse(param.advanced)
    }

    if (param.facet) {
      this.facet_search = JSON.parse(param.facet)
    }

    // ------------

    const jsonUrl = 'https://moeller.jinsha.tsukuba.ac.jp/data/curation.json'

    axios.get(jsonUrl).then((response) => {
      const curation = response.data

      const results = []

      const selections = curation.selections

      let pos = 1

      const index = this.index

      for (let i = 0; i < selections.length; i++) {
        const selection = selections[i]
        const members = selection.members
        for (let j = 0; j < members.length; j++) {
          const member = members[j]

          const obj = {
            thumbnail: [member.thumbnail],
            related: [member.related],
            id: member['@id'],
          }
          const metadata = member.metadata
          for (let k = 0; k < metadata.length; k++) {
            const m = metadata[k]

            // 全て配列に
            let values = m.value
            if (!Array.isArray(values)) {
              values = [values]
            }

            obj[m.label] = values
          }

          for (const key in obj) {
            if (!index[key]) {
              index[key] = {}
            }

            const values = obj[key]

            for (let j = 0; j < values.length; j++) {
              const value = values[j]

              // URIの場合は無視
              if (value.startsWith('http')) {
                continue
              }

              if (!index[key][value]) {
                index[key][value] = []
              }

              const posIndex = pos - 1

              index[key][value].push(posIndex)
            }
          }

          const tmp = member.related
            .replace('&pos=', '?curation=')
            .split('?curation=')

          obj.manifest = selection.within['@id']
          obj.curation = tmp[1]
          obj.pos = Number(tmp[2])
          obj.label =
            'Möller No.' +
            obj['Möller No'][0] +
            ', Hieroglyph No.' +
            obj['Hieroglyph No'][0] +
            ', Vol.' +
            obj.Vol[0]

          this.data_map[member['@id']] = obj

          results.push(obj)

          pos += 1
        }
      }

      this.index = index
      this.data_all = results

      this.search(true)
    })
  },
  methods: {
    search(reindexingFlg) {
      // window.scrollTo(0, 0)

      if (reindexingFlg) {
        const query = this.createQuery()
        this.query = query

        const indexes = this.filter(this.query)

        const dataFiltered = this.getDataFiltered(indexes)
        this.dataFiltered = dataFiltered

        const facets = this.createFacets(indexes, this.query.aggs)
        this.facets = facets
      }

      console.log(JSON.stringify(this.query.query))

      this.dataFiltered = this.sort_data(this.dataFiltered, this.query.sort)

      const results = this.getResult(
        this.dataFiltered,
        (this.query.page - 1) * this.query.size,
        this.query.size
      )

      const result = {
        aggregations: this.facets,
        hits: {
          hits: results,
          total: {
            relation: this.query.sort,
            value: this.dataFiltered.length,
          },
        },
      }

      // console.log(result);

      for (const key in this.advanced_search) {
        this.advanced_search_display[key] = this.advanced_search[key]
      }
      this.update_param()
      this.results = result
    },
    createQuery() {
      const query = {}
      const filterQuery = []
      const mustQuery = []
      query.bool = {
        filter: filterQuery,
        must: mustQuery,
      }

      // -------

      const valueVol = this.advanced_search.Vol
      if (valueVol.length !== 0) {
        filterQuery.push(this.createFilterQuery('Vol', valueVol))
      }

      // ----------

      let valueMno = this.advanced_search['Möller No']
      if (!Array.isArray(valueMno)) {
        valueMno = [valueMno]
      }
      if (valueMno.length !== 0) {
        for (let i = 0; i < valueMno.length; i++) {
          let value = valueMno[i]
          if (['A', 'B', 'C', 'a', 'b', 'c'].includes(value.slice(-1))) {
            value = value.slice(0, value.length - 1)
          }
          if (value !== '') {
            mustQuery.push(this.createMustQuery('Möller No Mod', [value], true))
          }
        }
      }

      // ----------

      let valueHno = this.advanced_search['Hieroglyph No']
      if (!Array.isArray(valueHno)) {
        valueHno = [valueHno]
      }
      if (valueHno.length !== 0) {
        for (let i = 0; i < valueHno.length; i++) {
          let value = valueHno[i]
          value = value.split('*').join('')
          if (value !== '') {
            mustQuery.push(
              this.createMustQuery('Hieroglyph No Mod', [value], true)
            )
          }
        }
      }

      // -----------
      let valuePh = this.advanced_search['Phone/Word']
      if (!Array.isArray(valuePh)) {
        valuePh = [valuePh]
      }
      if (valuePh.length !== 0) {
        for (let i = 0; i < valuePh.length; i++) {
          const value = valuePh[i]
          if (value !== '') {
            mustQuery.push(this.createMustQuery('Phone/Word', [value], true))
          }
        }
      }

      // -----------
      const valueNote = this.advanced_search.Note
      if (valueNote !== '') {
        mustQuery.push(this.createMustQuery('Note', [valueNote]))
      }

      // -----------
      const valueFacetVol = this.facet_search.Vol
      if (valueFacetVol.length !== 0) {
        filterQuery.push(this.createFilterQuery('Vol', valueFacetVol))
      }

      // -----------
      const valueFacetMno = this.facet_search['Möller No']
      if (valueFacetMno.length !== 0) {
        filterQuery.push(this.createFilterQuery('Möller No', valueFacetMno))
      }

      // -----------

      const valueFacetHno = this.facet_search['Hieroglyph No']
      if (valueFacetHno.length !== 0) {
        filterQuery.push(this.createFilterQuery('Hieroglyph No', valueFacetHno))
      }

      // -----------

      const valueFacetPh = this.facet_search['Phone/Word']
      if (valueFacetPh.length !== 0) {
        filterQuery.push(
          this.createFilterQuery('Phone/Word Mod', valueFacetPh) // 注意 Mod
        )
      }

      // ------------

      const q = this.query
      q.query = query

      return q
    },
    createMustQuery(field, values, keywordFlg) {
      const should = []

      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (value === '') {
          // 注意
          continue
        }
        const obj = {}
        if (keywordFlg) {
          field = field + '.keyword'
        }
        obj[field] = value
        should.push({
          match_phrase: obj,
        })
      }

      return {
        bool: {
          should,
        },
      }
    },
    createFilterQuery(field, values) {
      const should = []

      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (value === '') {
          // 注意
          continue
        }
        const obj = {}
        obj[field + '.keyword'] = value
        should.push({
          match_phrase: obj,
        })
      }

      return {
        bool: {
          should,
        },
      }
    },
    getDataFiltered(indexes) {
      const dataFiltered = []
      for (let i = 0; i < indexes.length; i++) {
        dataFiltered.push(this.data_all[indexes[i]])
      }
      return dataFiltered
    },
    sort_data(dataFiltered, type) {
      const obj = this.config.items_sort[type]

      let ascFlg = true
      if (obj.type === 'desc') {
        ascFlg = false
      }

      const field = obj.value

      let v1 = 1
      let v2 = -1
      if (!ascFlg) {
        v1 *= -1
        v2 *= -1
      }

      dataFiltered.sort(function (a, b) {
        if (a[field][0] > b[field][0]) return v1
        if (a[field][0] < b[field][0]) return v2
        if (a.Vol[0] > b.Vol[0]) return v1
        if (a.Vol[0] < b.Vol[0]) return v2
        return 0
      })
      return dataFiltered
    },
    getResult(from, size) {
      const results = []
      let to = from + size
      if (to > this.dataFiltered.length) {
        to = this.dataFiltered.length
      }
      for (let i = from; i < to; i++) {
        results.push(this.dataFiltered[i])
      }
      return results
    },
    createFacets(indexes, queryAggs) {
      const aggs = {}

      for (const label in queryAggs) {
        const obj = queryAggs[label].terms
        let size = Number(obj.size)
        const field = obj.field.replace('.keyword', '')
        const map = this.index[field]

        const mapNew = {}
        for (const value in map) {
          const intersection = new Set(
            [...new Set(indexes)].filter((e) => new Set(map[value]).has(e))
          )
          const docCount = intersection.size
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

        if (size > arr.length) {
          size = arr.length
        }

        const buckets = []
        for (let i = 0; i < size; i++) {
          const key = arr[i].key
          const bucket = {
            key,
            docCount: arr[i].value,
          }
          // 検索条件の反映
          if (!this.facet_search[field]) {
            this.facet_search[field] = []
          }
          if (this.facet_search[field].includes(key)) {
            bucket.value = true
          }
          buckets.push(bucket)
        }

        aggs[label] = {
          buckets,
        }
      }

      return aggs
    },
    filter(query) {
      const index = this.index

      const indexAll = []
      for (let i = 0; i < this.data_all.length; i++) {
        indexAll.push(i)
      }

      const filters = query.query.bool

      let intersection = new Set(indexAll)

      for (const type in filters) {
        // must or filter
        const typeAll = filters[type]

        for (let i = 0; i < typeAll.length; i++) {
          const should = typeAll[i].bool.should

          let union = new Set([])

          for (let j = 0; j < should.length; j++) {
            const obj = should[j].match_phrase

            for (let key in obj) {
              const value = obj[key]

              let indexArr = []

              if (!key.includes('.keyword')) {
                const map = index[key]
                for (const field in map) {
                  if (field.includes(value)) {
                    indexArr = indexArr.concat(map[field])
                  }
                }
              } else {
                key = key.replace('.keyword', '')
                const map = index[key]
                for (const field in map) {
                  if (field === value) {
                    indexArr = indexArr.concat(map[field])
                  }
                }
              }

              const setAdd = new Set(indexArr)
              union = new Set([...union, ...setAdd])
            }
          }

          intersection = new Set([...intersection].filter((e) => union.has(e))) // 2, 3
        }
      }

      const results = []

      for (const value of intersection) {
        results.push(value)
      }

      return results
    },
    page_move() {
      this.search()
    },
    sort_move() {
      this.search()
    },

    // 詳細検索ボタン
    search_move() {
      for (const key in this.facet_search) {
        let value = this.facet_search[key]
        if (Array.isArray(value)) {
          value = []
        } else {
          value = ''
        }
        this.facet_search[key] = value
      }

      if (this.query.page !== 1) {
        this.query.page = 1
        this.sort = 'Möller No. Asc'
      }
      this.search(true)
    },
    update_param() {
      const param = {
        advanced: JSON.stringify(this.advanced_search),
        facet: JSON.stringify(this.facet_search),
      }
      this.$router.replace(
        { name: 'search', query: param },
        () => {},
        () => {}
      )
    },
    init_param() {
      this.query.query = {}
      this.query.size = 20
      this.query.from = 0
      this.query.page = 1
      this.query.sort = 'Möller No. Asc'

      for (const key in this.advanced_search) {
        let value = this.advanced_search[key]
        if (Array.isArray(value)) {
          value = []
        } else {
          value = ''
        }
        this.advanced_search[key] = value
      }

      for (const key in this.facet_search) {
        let value = this.facet_search[key]
        if (Array.isArray(value)) {
          value = []
        } else {
          value = ''
        }
        this.facet_search[key] = value
      }

      this.update_param()
    },
    reset() {
      this.init_param()
      this.search(true)
    },

    facet_search_move(type, field, value) {
      this.init_param()
      this[type][field] = value
      this.search(true)
    },
    facet_filter() {
      // list値の初期化
      for (const key in this.facet_search) {
        let value = this.facet_search[key]
        if (Array.isArray(value)) {
          value = []
        } else {
          value = ''
        }
        this.facet_search[key] = value
      }

      const aggregations = this.results.aggregations
      for (const field in aggregations) {
        const buckets = aggregations[field].buckets
        for (let i = 0; i < buckets.length; i++) {
          const bucket = buckets[i]
          if (bucket.value) {
            if (!this.facet_search[field]) {
              this.facet_search[field] = []
            }
            this.facet_search[field].push(bucket.key)
          }
        }
      }
      this.search(true)
    },
    select(id, flg) {
      const selected = this.selected
      const index = selected.indexOf(id)
      if (index === -1 && flg) {
        selected.push(id)
      } else if (index !== -1 && !flg) {
        selected.splice(index, 1)
      }
    },
    compare() {
      const param = []
      for (let i = 0; i < this.selected.length; i++) {
        const id = this.selected[i]
        const data = this.data_map[id]
        param.push({
          manifest: data.manifest,
          canvas: id,
        })
      }
      const url =
        'mirador/?params=' +
        encodeURIComponent(JSON.stringify(param)) +
        '&layout=' +
        this.selected.length +
        'x1'
      open(url, '_blank')
    },
    reset_selected() {
      this.selected = []
      const hits = this.results.hits.hits
      for (let i = 0; i < hits.length; i++) {
        const obj = hits[i]
        obj.selected = false
      }
    },
    delete_selected() {
      for (const id in this.selected_temporary) {
        if (this.selected_temporary[id]) {
          const index = this.selected.indexOf(id)
          this.selected.splice(index, 1)
        }
      }

      const hits = this.results.hits.hits
      for (let i = 0; i < hits.length; i++) {
        const obj = hits[i]
        const id = obj.id
        if (this.selected.includes(id)) {
          obj.selected = true
        } else {
          obj.selected = false
        }
      }

      this.selected_temporary = {}
    },
  },
}
</script>
