<template>
  <span>
    <span v-for="(value, i) in elements" :key="i">
      {{ elements[i] }}
      <nuxt-link
        :to="
          localePath({
            name: 'search',
            query: getQuery(items[i]),
          })
        "
      >
        {{ items[i] }}
      </nuxt-link>
    </span>
  </span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
// import { queryStore } from '~/store'

@Component
export default class FacetOption extends Vue {
  @Prop({
    required: true,
  })
  data!: any

  @Prop({
    required: true,
  })
  field!: string

  get items(): string[] {
    let data = this.data
    if (!data) {
      return []
    }
    data = data[0]
    const targets = ['(', ')', '=', '×3', '×2', '/', ',']
    for (let i = 0; i < targets.length; i++) {
      data = data.split(targets[i]).join('+')
    }
    return data.split('+')
  }

  getQuery(value: string) {
    const item: any = {}
    item['fc-' + this.field] = value
    return item
  }

  get elements(): string[] {
    let data = this.data
    const items = this.items

    if (!data) {
      return []
    }

    data = data[0]

    const map: any = {}

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const len = item.length
      if (!map[len]) {
        map[len] = []
      }
      map[len].push(item)
    }

    const lens = Object.keys(map).reverse()

    for (let j = 0; j < lens.length; j++) {
      const items = map[lens[j]]
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        data = data.split(item).join('$$$')
      }
    }

    return data.split('$$$')
  }
}
</script>
