<template>
  <div>
    <v-select
      v-model="sort"
      :items="indices"
      :label="$t('Sort by')"
      @change="setSort"
    ></v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class SortBySelector extends Vue {
  @Prop({ default: () => [] })
  indices!: any[]

  get sort() {
    return this.$store.state.sort
  }

  set sort(value) {
    this.$store.commit('setSort', value)
  }

  setSort() {
    const query: any = Object.assign({}, this.$route.query)
    query.from = 0
    query.sort = this.sort

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }
}
</script>
