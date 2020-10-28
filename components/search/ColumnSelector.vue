<template>
  <div>
    <v-select
      v-model="col"
      :items="options"
      :label="$t('col')"
      @change="setCol"
    ></v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class SortBySelector extends Vue {
  @Prop({ default: () => [1, 2, 3, 4, 6, 12] })
  options!: number[]

  get col() {
    return this.$store.state.col
  }

  set col(value) {
    this.$store.commit('setCol', value)
  }

  setCol() {
    const query: any = Object.assign({}, this.$route.query)
    query.col = this.col
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
