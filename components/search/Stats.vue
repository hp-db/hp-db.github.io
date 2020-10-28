<template>
  <span>
    {{ $t('search_result') }}:
    {{ result.hits ? result.hits.total.value.toLocaleString() : 0
    }}{{ $t('hits') }}
  </span>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class searchfilter extends Vue {
  get result() {
    return this.$store.state.result
  }
}
</script>
