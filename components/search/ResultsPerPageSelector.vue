<template>
  <div>
    <v-select
      v-model="size"
      :items="options"
      :label="$t('items_per_page')"
      @change="setSize"
    ></v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class SortBySelector extends Vue {
  @Prop({ default: () => [24, 60, 120, 512] })
  options!: number[]

  get size() {
    return this.$store.state.size
  }

  set size(value) {
    this.$store.commit('setSize', value)
  }

  setSize() {
    const query: any = Object.assign({}, this.$route.query)
    query.from = 0
    query.size = this.size

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
