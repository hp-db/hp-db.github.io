<template>
  <div>
    <v-select
      v-model="layout_"
      :items="items"
      :label="$t('layout')"
      @change="setLayout"
    ></v-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class SortBySelector extends Vue {
  @Prop({
    default: () => [
      { value: 'grid', text: 'grid' },
      { value: 'list', text: 'list' },
      { value: 'image', text: 'thumbnail' },
      { value: 'table', text: 'table' },
      { value: 'stats', text: 'graph' },
    ],
  })
  options!: any[]

  get layout_() {
    return this.$store.state.layout
  }

  set layout_(value) {
    this.$store.commit('setLayout', value)
  }

  get items() {
    const options = this.options
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      option.text = this.$t(option.text)
    }
    return options
  }

  setLayout() {
    const query: any = Object.assign({}, this.$route.query)
    query.layout = this.layout_
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
