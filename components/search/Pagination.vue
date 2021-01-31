<template>
  <v-pagination
    v-show="layout_ !== 'stats' && layout_ !== 'map'"
    v-model="currentPage"
    :length="paginationLength"
    :total-visible="7"
    @input="setCurrentPage"
  ></v-pagination>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Pagination extends Vue {
  get currentPage() {
    return this.$store.state.currentPage
  }

  set currentPage(value) {
    this.$store.commit('setCurrentPage', value)
  }

  get size() {
    return this.$store.state.size
  }

  get layout_() {
    return this.$store.state.layout
  }

  get paginationLength() {
    const result = this.$store.state.result
    const total = result.hits ? result.hits.total.value : 0
    return Math.ceil(total / this.size)
  }

  setCurrentPage() {
    // if (this.currentPage > 0) {
    const query: any = Object.assign({}, this.$route.query)
    query.from = (this.currentPage - 1) * this.size

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
    // }
  }
}
</script>
