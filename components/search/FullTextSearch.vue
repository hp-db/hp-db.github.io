<template>
  <div>
    <v-text-field
      v-model="keywordStr"
      single-line
      background-color="grey lighten-2"
      filled
      rounded
      dense
      hide-details
      :label="$t('search')"
      clearable
      clear-icon="mdi-close-circle"
      append-icon="mdi-magnify"
      @click:append="search"
      @keydown.enter="trigger"
    ></v-text-field>
  </div>
  <!-- class="mr-2" -->
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class FullTextSearch extends Vue {
  queryKeyword: string = ''
  keywords: string[] = []

  get keywordStr() {
    const value = this.$store.state.keyword
    if (Array.isArray(value)) {
      return value.join(' ')
    } else {
      return value
    }
  }

  set keywordStr(value) {
    this.queryKeyword = value
  }

  trigger(event: any) {
    // 日本語入力中のEnterキー操作は無効にする
    if (event.keyCode !== 13) return
    this.search()
  }

  search() {
    let keywordStr = this.queryKeyword

    if (!keywordStr) {
      keywordStr = ''
    }

    const keywords = this.$searchUtils.splitKeyword(keywordStr)

    // push 処理
    const query: any = Object.assign({}, this.$route.query)
    const values: string[] = []
    for (let i = 0; i < keywords.length; i++) {
      const keyword: any = keywords[i]
      if (keyword.label === 'keyword') {
        values.push(keyword.value)
      }
    }
    query.keyword = values
    query.from = 0

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }
}
</script>
