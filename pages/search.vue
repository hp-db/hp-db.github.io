<template>
  <div>
    <template v-if="loadingFlag">
      <div class="text-center my-10">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </template>
    <template v-else>
      <SearchForm />

      <v-sheet color="grey lighten-3">
        <SearchFilter />
      </v-sheet>

      <v-container fluid>
        <ResultHead
          :sort-options="sortOptions"
          :layout-options="layoutOptions"
        />
        <Result />
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import SearchForm from '~/components/custom/SearchForm.vue'

import SearchFilter from '~/components/custom/CustomFilter.vue'
import Result from '~/components/search/Result.vue'
import ResultHead from '~/components/search/ResultHead.vue'

@Component({
  components: {
    SearchForm,
    SearchFilter,
    Result,
    ResultHead,
  },
})
export default class search extends Vue {
  // 設定
  sortOptions: any[] = [
    /*
    {
      value: '_score:desc',
      text: this.$t('relevance'),
    },
    */
    {
      value: 'm_sort:asc',
      text: this.$t('Hieratic No') + ' ' + this.$t('asc'),
    },
    {
      value: 'm_sort:desc',
      text: this.$t('Hieratic No') + ' ' + this.$t('desc'),
    },
    {
      value: 'h_sort:asc',
      text: this.$t('Hieroglyph No') + ' ' + this.$t('asc'),
    },
    {
      value: 'h_sort:desc',
      text: this.$t('Hieroglyph No') + ' ' + this.$t('desc'),
    },
    {
      value: 'vol:asc',
      text: this.$t('Vol') + ' ' + this.$t('asc'),
    },
    {
      value: 'vol:desc',
      text: this.$t('Vol') + ' ' + this.$t('desc'),
    },
  ]

  layoutOptions: any[] = [
    { value: 'hpdb', text: 'default' },
    { value: 'grid', text: 'grid' },
    { value: 'image', text: 'thumbnail' },
    { value: 'table', text: 'table' },
    { value: 'stats', text: 'graph' },
  ]

  facetLabels: any = {
    Vol: this.$t('Vol'),
    // 'Hieratic No Mod': this.$t('Hieratic No'),
    // 'Hieroglyph No Mod': this.$t('Hieroglyph No'),
    // 'Phone/Word Mod': this.$t('Phone/Word'),
    'Hieratic No': this.$t('Hieratic No'),
    'Hieroglyph No': this.$t('Hieroglyph No'),
    'Phone/Word Mod': this.$t('Phone/Word'),
  }

  facetFlags: string[] = [
    'Vol',
    'Hieratic No Mod',
    'Hieroglyph No Mod',
    'Phone/Word Mod',
    'Hieratic No',
    'Hieroglyph No',
    'Phone/Word',
  ]

  loadingFlag: boolean = true

  // state
  mounted() {
    this.search()
  }

  @Watch('$route')
  watchRoute(): void {
    this.search()
  }

  async search() {
    const store = this.$store
    const routeQuery = this.$route.query

    // 初期化
    if (!routeQuery.sort) {
      routeQuery.sort = 'm_sort:asc'
    }
    if (!routeQuery.layout) {
      routeQuery.layout = 'hpdb'
    }
    this.loadingFlag = true
    store.commit('init', routeQuery)

    // ------ インデックス ---------

    if (store.state.index == null) {
      const index = await this.$searchUtils.loadIndex(
        process.env.BASE_URL + '/data/index.json'
      )
      this.$searchUtils.initStore(store, index)
    }

    // ------ ファセット ---------

    if (Object.keys(store.state.facetLabels)) {
      store.commit('setFacetLabels', this.facetLabels)
      store.commit('setFacetFlags', this.facetFlags)
    }

    // 検索
    const esQuery = this.$searchUtils.createQuery(routeQuery, store.state)
    const result = this.$searchUtils.search(
      store.state.index,
      store.state.data,
      esQuery
    )
    this.$store.commit('setResult', result)

    // --------------- ここまで elatic search ---------------

    this.loadingFlag = false
  }

  head() {
    return {
      title: this.$t('search'),
    }
  }
}
</script>
