<template>
  <div>
    <template v-for="(obj, index) in facetOptions">
      <v-card
        v-if="
          aggregations[index] &&
          aggregations[index].buckets &&
          aggregations[index].buckets.length > 0
        "
        :key="index"
        no-body
        class="mb-10"
      >
        <v-card-title class="grey lighten-2">{{
          obj.label.startsWith('_') ? $t(obj.label.slice(1)) : $t(obj.label)
        }}</v-card-title>

        <div class="pa-5">
          <Chart
            :height="200"
            class="mb-4"
            :buckets="aggregations[index].buckets"
          ></Chart>
        </div>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import Chart from '~/components/search/TestChart.vue'

@Component({
  components: {
    Chart,
  },
})
export default class StatsSearchResult extends Vue {
  get aggregations() {
    return this.$store.state.result.aggregations
  }

  get facetOptions() {
    return this.$store.state.facetOptions
  }
}
</script>
