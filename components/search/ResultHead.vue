<template>
  <v-row dense>
    <v-col class="py-0 my-0" cols="12" sm="6" lg="8">
      <h2 class="my-2" style="vertical-align: middle">
        <Stats />
      </h2>
    </v-col>
    <v-col class="py-0 my-0" cols="12" sm="6" lg="4">
      <v-row dense>
        <template v-if="layout_ !== 'stats'">
          <v-col class="py-0 my-0" cols="12" sm="3">
            <SortBySelector :indices="sortOptions" />
          </v-col>
          <v-col class="py-0 my-0" cols="12" sm="3">
            <ResultsPerPageSelector />
          </v-col>
        </template>
        <v-col class="py-0 my-0" cols="12" sm="3">
          <LayoutSelector :options="layoutOptions" />
        </v-col>
        <v-col
          v-show="
            (layout_ === 'grid' || layout_ === 'image') &&
            $vuetify.breakpoint.name != 'xs'
          "
          cols="12"
          sm="3"
          class="py-0 my-0"
        >
          <ColumnSelector />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Stats from '~/components/search/Stats.vue'
import SortBySelector from '~/components/search/SortBySelector.vue'
import ResultsPerPageSelector from '~/components/search/ResultsPerPageSelector.vue'
import LayoutSelector from '~/components/search/LayoutSelector.vue'
import ColumnSelector from '~/components/search/ColumnSelector.vue'

@Component({
  components: {
    Stats,
    SortBySelector,
    ResultsPerPageSelector,
    LayoutSelector,
    ColumnSelector,
  },
})
export default class Result extends Vue {
  @Prop({ default: () => [] })
  sortOptions!: any[]

  @Prop()
  layoutOptions!: string[]

  get facetFlag() {
    return this.$store.state.facetFlag
  }

  set facetFlag(value) {
    this.$store.commit('setFacetFlag', value)
  }

  get total(): number {
    const result = this.$store.state.result
    if (result.hits) {
      return result.hits.total.value
    } else {
      return 0
    }
  }

  get layout_() {
    return this.$store.state.layout
  }
}
</script>
