<template>
  <nuxt-link :to="localePath(to)"><slot></slot></nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class Member extends Vue {
  @Prop()
  to: any
}
</script>
