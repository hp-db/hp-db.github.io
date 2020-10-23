<template>
  <div>
    <v-data-table :headers="headers" :items="items" hide-default-footer>
      <template v-slot:item.image="{ item }">
        <nuxt-link
          class="mb-4"
          :to="
            localePath({
              name: 'item',
              query: { id: item.id, u: $route.query.u },
            })
          "
        >
          <v-img
            :src="item.image"
            contain
            style="height: 90px; width: 90px;"
            class="grey lighten-2 my-2"
          ></v-img>
        </nuxt-link>
      </template>

      <template v-slot:item.label="{ item }">
        <nuxt-link
          class="mb-4"
          :to="
            localePath({
              name: 'item',
              query: { id: item.id, u: $route.query.u },
            })
          "
        >
          <span v-html="item.label"></span>
        </nuxt-link>
      </template>

      <template v-slot:item.icons="{ item }">
        <ResultOption
          :item="{
            label: $utils.formatArrayValue(item.raw._source._label),
            manifest: $utils.formatArrayValue(item.raw._source._manifest),
            url: encodeURIComponent(getUrl(item.raw)),
            id: item.id,
          }"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'nuxt-property-decorator'
import ResultOption from '~/components/display/ResultOption.vue'

@Component({
  components: {
    ResultOption,
  },
})
export default class TableSearchResult extends Vue {
  get results() {
    return this.$store.state.result.hits.hits
  }

  items: any[] = []
  fields!: any[]

  headers: any[] = []

  @Watch('results', { deep: true })
  watchTmp() {
    this.main()
  }

  mounted() {
    const facetLabels: any = this.$store.state.facetLabels
    const fields: any = [
      { key: 'image', label: '' },
      { key: 'label', label: this.$t('title') },
    ]
    for (const field in facetLabels) {
      fields.push({
        key: field,
        label: field,
      })
    }
    fields.push({ key: 'icons', label: '' })
    this.fields = fields

    const headers = []
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      if (field.label.startsWith('_')) {
        continue
      }
      headers.push({
        text: field.label,
        align: 'start',
        value: field.key,
      })
    }
    this.headers = headers

    this.main()
  }

  main() {
    const fields = this.fields
    const results = this.results
    const items: any[] = []
    for (let i = 0; i < results.length; i++) {
      const result: any = results[i]
      const item: any = {
        image: this.$utils.formatArrayValue(result._source._thumbnail),
        label: this.$utils.formatArrayValue(result._source._label),
        id: result._id,
        raw: result,
      }

      for (let j = 0; j < fields.length; j++) {
        const label = fields[j].key
        if (result._source[label]) {
          item[label] = this.$utils.truncate(
            this.$utils.formatArrayValue(result._source[label]),
            50
          )
        }
      }
      items.push(item)
    }
    this.items = items
  }

  getUrl(item: any) {
    return (
      process.env.BASE_URL +
      this.localePath({
        name: 'item',
        query: {
          u: this.$route.query.u,
          id: item._id,
        },
      })
    )
  }
}
</script>
