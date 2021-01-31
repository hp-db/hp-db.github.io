<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">{{ title }}</h1>

      <v-row>
        <v-col
          v-for="(item, key) in items"
          :key="key"
          cols="12"
          sm="4"
          class="pa-10"
          ><h2 style="color: #009688">{{ item.title }}</h2>
          <small style="color: #9e9e9e">{{ item.exp }}</small>
          <div>
            <h2>{{ item.value }}</h2>
          </div></v-col
        >
        <v-col cols="12" sm="4" class="pa-10"
          ><h2>アイテム総数</h2>
          19,234</v-col
        >
        <v-col cols="12" sm="4" class="pa-10"
          ><h2>アイテム総数</h2>
          19,234</v-col
        >
        <v-col cols="12" sm="4" class="pa-10"
          ><h2>アイテム総数</h2>
          19,234</v-col
        >
        <v-col cols="12" sm="4"></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {},
})
export default class PageCategory extends Vue {
  baseUrl: any = process.env.BASE_URL
  title: string = 'ダッシュボード'

  async asyncData({ payload }) {
    if (payload) {
      return payload
    } else {
      const { data } = await axios.get(
        process.env.BASE_URL + `/data/curation_old.json`
      )
      const manifests = []
      const members2 = []
      const selections = data.selections
      for (let i = 0; i < selections.length; i++) {
        const selection = selections[i]
        const manifest = selection.within['@id']
        manifests.push(manifest)
        const members = selection.members
        for (let j = 0; j < members.length; j++) {
          const member = members[j]
          member.manifest = manifest
          members2.push(member)
        }
      }

      return {
        members: members2,
        manifests,
      }
    }
  }

  get items(): any[] {
    return [
      {
        title: 'アイテム総数',
        value: this.members.length.toLocaleString(),
      },
      {
        title: 'IIIFマニフェスト数',
        value: this.manifests.length.toLocaleString(),
      },
    ]
  }

  head() {
    const title = this.title
    return {
      title,
    }
  }
}
</script>
