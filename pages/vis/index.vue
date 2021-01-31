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
          class="my-2"
        >
          <v-card flat outlined class="pa-5">
            <h2 style="color: #009688">{{ item.title }}</h2>
            <small style="color: #9e9e9e">{{ item.exp }}</small>
            <div>
              <h2>{{ item.value }}</h2>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {},
})
export default class PageCategory extends Vue {
  baseUrl: any = process.env.BASE_URL
  title: string = 'ダッシュボード'

  asyncData({ payload }: any) {
    if (payload) {
      return payload
    } else {
      const data: any = process.env.curation
      const manifests = []
      const members2 = []
      const selections = data.selections
      const hieratics: any = {}
      const hieroglyphs: any = {}
      for (let i = 0; i < selections.length; i++) {
        const selection = selections[i]
        const manifest = selection.within['@id']
        manifests.push(manifest)
        const members = selection.members
        for (let j = 0; j < members.length; j++) {
          const member = members[j]
          member.manifest = manifest
          members2.push(member)

          const metadata = member.metadata
          const metadataObj: any = {}
          for (let i = 0; i < metadata.length; i++) {
            const m = metadata[i]
            const values = Array.isArray(m.value)
              ? m.value
              : m.value === ''
              ? []
              : [m.value]
            metadataObj[m.label] = values
          }

          let values = metadataObj['Hieratic No Mod']
          for (let i = 0; i < values.length; i++) {
            const v = values[i]
            if (!hieratics[v]) {
              hieratics[v] = 0
            }
            hieratics[v] += 1
          }

          values = metadataObj['Hieroglyph No Mod']
          for (let i = 0; i < values.length; i++) {
            const v = values[i]
            if (!hieroglyphs[v]) {
              hieroglyphs[v] = 0
            }
            hieroglyphs[v] += 1
          }
        }
      }

      return {
        members: members2,
        manifests,
        hieratics,
        hieroglyphs,
      }
    }
  }

  get items(): any[] {
    return [
      {
        title: 'アイテム総数',
        value: (this as any).members.length.toLocaleString(),
      },
      {
        title: '巻（IIIFマニフェスト）数',
        value: (this as any).manifests.length.toLocaleString(),
      },
      {
        title: 'ヒエラティック番号の種類数',
        value: Object.keys((this as any).hieratics).length.toLocaleString(),
      },
      {
        title: 'ヒエログリフ番号の種類数',
        value: Object.keys((this as any).hieroglyphs).length.toLocaleString(),
      },
      {
        title: 'コントリビュータ数',
        value: 4,
      },
      {
        title: 'ウェブサイト更新数',
        value: 3,
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
