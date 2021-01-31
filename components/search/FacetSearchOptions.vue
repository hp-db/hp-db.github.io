<template>
  <div>
    <!-- facets -->
    <template v-for="(obj, index) in facetOptions">
      <FacetOption
        v-if="aggregations[index]"
        :key="index"
        :term="index"
        :label="obj.label"
        :buckets="aggregations[index].buckets"
        :query="query"
        class="mb-5"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import FacetOption from '~/components/custom/CustomFacetOption.vue'

@Component({
  components: {
    FacetOption,
  },
})
export default class FacetSearchOptions extends Vue {
  get aggregations() {
    return this.$store.state.result.aggregations
  }

  get facetOptions() {
    return this.$store.state.facetOptions
  }

  get query() {
    return this.$store.state.query
  }
}
</script>
