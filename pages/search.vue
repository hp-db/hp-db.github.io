<template>
  <div>
    <v-container>
      {{ id }}
      <div v-for="(item, key) in data" :key="key">
        {{ item.label }}
        <!--
        <nuxt-link
          :to="localePath({ name: 'item-id', params: { id: item.value } })"
        >
          {{ item.label }}
        </nuxt-link>
        -->
      </div>
      <v-btn :to="localePath({ name: 'search', query: { ccc: 'bbb' } })"
        >検索</v-btn
      >
      <v-btn :to="localePath({ name: 'search' })">検索2</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class search extends Vue {
  head() {
    return {
      title: this.$t('search'),
    }
  }

  data: any = []

  get id() {
    return this.$store.state.id
  }

  set id(value) {
    this.$store.commit('setId', value)
  }

  mounted() {
    this.search()
  }

  @Watch('$route')
  watchRoute(): void {
    this.search()
  }

  async search() {
    const store = this.$store
    if (store.state.index == null) {
      const index = await this.$searchUtils.createIndexFromIIIFCurationList(
        'https://moeller.jinsha.tsukuba.ac.jp/data/curation.json'
      )
      store.commit('setIndex', index.index)
      store.commit('setData', index.data)
    }

    const routeQuery = this.$route.query
    const esQuery = this.$searchUtils.createQuery(routeQuery, store.state)
    store.commit('setQuery', esQuery)

    const result = this.$searchUtils.search(
      store.state.index,
      store.state.data,
      store.state.query
    )

    store.commit('setResult', result)

    console.log(result.hits.hits.length)

    // --------------- ここまで elatic search ---------------
  }
}
</script>
