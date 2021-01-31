<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">
        <template v-if="$i18n.locale === 'ja'">
          {{ label.startsWith('_') ? $t(title) : title }}を一覧する
        </template>
        <template v-else>
          {{ $t('browse_by') }}
          {{ label.startsWith('_') ? $t(title) : title }}
        </template>
      </h1>
      <template v-for="(obj, index) in facetOptions">
        <!-- v-if="index !== 'Phone/Word Mod'" -->
        <v-btn
          :key="index"
          color="primary"
          text
          class="my-1 mr-4"
          :to="
            localePath({
              name: 'category-id',
              params: { id: index.replace('/', '-') },
            })
          "
        >
          {{ obj.label.startsWith('_') ? $t(obj.label) : obj.label }}
        </v-btn>
      </template>

      <v-sheet color="grey lighten-3 py-1 px-3 my-5">
        <v-row dense align="center">
          <v-col cols="12" sm="4" class="py-3"
            ><h3>
              {{ results.length.toLocaleString() }}{{ $t('hits') }}
            </h3></v-col
          >
        </v-row>
      </v-sheet>

      <v-tabs v-model="tab" class="mb-5">
        <v-tab>{{ $t('list') }}</v-tab>
        <v-tab>{{ $t('graph') }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          ><v-row class="mb-5">
            <v-col
              v-for="(obj, index) in results"
              :key="index"
              :cols="6"
              :sm="2"
              class="my-2"
              style="word-break: break-word"
            >
              <nuxt-link
                class="mr-2"
                :to="
                  localePath({
                    name: 'search',
                    query: getParams('fc-' + label, obj.key),
                  })
                "
                :class="label.includes('Phone/Word') ? 'phone' : ''"
              >
                {{
                  ['Item Type', 'Sub Type', 'Unit'].includes(label)
                    ? $t(obj.key)
                    : obj.key
                }}
              </nuxt-link>
              ({{ Number(obj.doc_count).toLocaleString() }})
            </v-col>
          </v-row></v-tab-item
        >
        <v-tab-item>
          <Chart :height="200" class="mb-10" :buckets="results"></Chart>
          <Pie :height="400" :buckets="results"></Pie>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

import Chart from '~/components/search/TestChart.vue'
import Pie from '~/components/search/PieChart.vue'

@Component({
  components: {
    Chart,
    Pie,
  },
})
export default class PageCategory extends Vue {
  @Watch('$route', { deep: true })
  watchTmp(): void {
    this.search()
  }

  tab: number = 0

  results: any[] = []

  get label(): any {
    return this.$route.params.id.replace('-', '/')
  }

  get facetOptions(): any {
    const facetOptions: any = process.env.facetOptions
    for (const key in facetOptions) {
      const obj = facetOptions[key]
      obj.label = this.$t(obj.label)
    }
    return facetOptions
  }

  // state
  mounted() {
    this.search()
  }

  async search() {
    const store = this.$store
    const routeQuery = this.$route.query

    if (store.state.index == null) {
      const index = await this.$searchUtils.loadIndex(
        process.env.BASE_URL + '/data/index.json'
      )
      this.$searchUtils.initStore(store, index)
    }

    if (Object.keys(store.state.facetOptions)) {
      store.commit('setFacetOptions', this.facetOptions)
    }

    // 検索
    const esQuery = this.$searchUtils.createQuery(
      routeQuery,
      store.state,
      false
    )
    const result = this.$searchUtils.search(
      store.state.index,
      store.state.data,
      esQuery
    )

    const results = result.aggregations[this.label].buckets
    this.results = results
  }

  get title() {
    if (this.facetOptions[this.label]) {
      return this.facetOptions[this.label].label
    } else {
      return this.label
    }
  }

  head() {
    return {
      title: this.$t('category') + ' : ' + this.$t(this.title),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('search_by_category'),
        },
      ],
    }
  }

  getParams(label: string, value: string) {
    const params: any = {}
    params[label] = value
    return params
  }
}
</script>
