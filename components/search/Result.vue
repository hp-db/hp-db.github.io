<template>
  <v-row>
    <v-col
      cols="12"
      :sm="facetFlag ? 8 : 12"
      :md="facetFlag ? 9 : 12"
      order-sm="12"
    >
      <template v-if="total > 0">
        <div class="text-center my-5">
          <Pagination />
        </div>

        <SearchResult />

        <div class="text-center my-5">
          <Pagination />
        </div>
      </template>
    </v-col>

    <v-col :sm="4" :md="3" order-sm="1">
      <template v-if="total > 0">
        <h3 class="mb-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="facetFlag = !facetFlag">{{
                facetFlag
                  ? 'mdi-arrow-collapse-left'
                  : 'mdi-arrow-collapse-right'
              }}</v-icon>
            </template>
            <span>{{
              facetFlag ? $t('close_facets') : $t('open_facets')
            }}</span>
          </v-tooltip>
          {{ $t('refine_your_search') }}
        </h3>
        <FacetSearchOptions v-show="facetFlag" class="mt-5" />
      </template>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import FacetSearchOptions from '~/components/search/FacetSearchOptions.vue'
import SearchResult from '~/components/search/SearchResult.vue'
import Pagination from '~/components/search/Pagination.vue'

@Component({
  components: {
    SearchResult,
    FacetSearchOptions,
    Pagination,
  },
})
export default class Result extends Vue {
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
}
</script>
