<template>
  <div>
    <template v-for="(value, index) in results">
      <ListItem :key="index" :item="value" />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import ListItem from '~/components/display/ListItem.vue'

@Component({
  components: {
    ListItem,
  },
})
export default class ListSearchResult extends Vue {
  get results() {
    return this.$store.state.result.hits.hits
  }

  get query() {
    return this.$store.state.query
  }
}
</script>
