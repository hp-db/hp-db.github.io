<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">{{ $t('ユーザーズガイド') }}</h1>

      <h2 class="my-5">{{ $t('manual') }}</h2>

      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'manual-search',
              })
            "
          >
            {{ $t('検索画面') }}
          </nuxt-link>
        </li>
        <!--<li>メタデータ一覧（エクセルファイル）</li>
        
        <li>検索後の絞り込み</li>
        <li>Miradorを利用した文字の比較</li>
        <li>ヒエラティックとヒエログリフの対応表</li>
        -->
      </ul>

      <h2 class="my-5">{{ $t('lod_vocabulary') }}</h2>

      <ul>
        <li v-for="(value, key) in pathes" :key="key">
          <nuxt-link
            :to="
              localePath({
                name: 'property-id',
                params: { id: key },
              })
            "
          >
            {{ value }}
          </nuxt-link>
        </li>
      </ul>

      <h2 class="my-5">{{ $t('policy') }}</h2>

      <ul>
        <li>
          <nuxt-link
            :to="
              localePath({
                name: 'manual-ga',
              })
            "
          >
            Googleアナリティクスからの情報取得について
          </nuxt-link>
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pathes: {
        Item: this.$t('Item'),
        HieroglyphNo: this.$t('Hieroglyph No'),
        HieraticNo: this.$t('Hieratic No'),
      },
    }
  },
  head() {
    const title = 'About'
    return {
      title,
    }
  },
}
</script>
