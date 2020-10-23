<template>
  <div>
    <nuxt-link
      :to="
        localePath({
          name: 'item',
          query: { id: item._id, u: $route.query.u },
        })
      "
    >
      <v-img
        :src="$utils.formatArrayValue(item._source._thumbnail)"
        contain
        style="height: 200px;"
        width="100%"
        class="grey lighten-2"
      ></v-img>
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'

@Component
export default class ThumbItem extends Vue {
  @Prop({ required: true })
  item!: any
}
</script>
