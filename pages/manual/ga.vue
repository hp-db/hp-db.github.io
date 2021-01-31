<template>
  <div>
    <v-container class="my-5">
      <h1 class="mb-5">Googleアナリティクスからの情報取得について</h1>

      <p>
        当データベースでは，アクセス状況を把握するために，Google社の提供するGoogle
        アナリティクスを利用しています．Google
        アナリティクスはアクセス情報の収集のためにCookieを使用しています．アクセス情報は匿名で収集されており，個人を特定するものではありません．Googleアナリティクスによる情報収集は「Googleアナリティクス
        オプトアウト アドオン」を利用することにより無効化させることができます．
      </p>

      <ul>
        <li>
          <a href="https://www.google.com/analytics/terms/jp.html"
            >Googleアナリティクス利用規約</a
          >
        </li>

        <li>
          <a href="https://policies.google.com/privacy?hl=ja"
            >Googleプライバシーポリシー</a
          >
        </li>

        <li>
          <a href="https://tools.google.com/dlpage/gaoptout?hl=ja"
            >Googleアナリティクス オプトアウトアドオン</a
          >
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL,
    }
  },
  head() {
    const title = 'Googleアナリティクスからの情報取得について'
    return {
      title,
    }
  },
}
</script>
