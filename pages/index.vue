<template>
  <div>
    <section class="mb-5">
      <v-parallax src="img/ogp/home.jpg" height="600">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-1 text-center">
            <b>Hieratische Paläographie DB</b>
          </h1>
          <v-btn
            large
            class="mt-5"
            :to="localePath({ name: 'search' })"
            color="primary"
            >{{ $t('try_out') }}</v-btn
          >
        </v-layout>
      </v-parallax>
    </section>

    <v-container>
      <v-card class="my-5">
        <v-card-title>
          <h2>{{ $t('about_') }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="text--primary">
            <p>Welcome to our Hieratische Paläographie DB!</p>
            <p>
              This is a retrieval system for hieratic scripts; it uses IIIF
              format images (owned by the Asian Research Library of the
              University of Tokyo) of Georg Möller's
              <i>Hieratische Paläographie</i> (1909–36).
            </p>
            <p>
              We hope this platform is useful for everyone who has an interest
              in Hieratic scripts.
            </p>
            <p>HDB (Hieratic Database) Project Team</p>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="my-5">
        <v-card-title>
          <h2>{{ $t('members') }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="text--primary">
            <ul>
              <template v-if="$i18n.locale === 'ja'">
                <li>
                  <a href="https://researchmap.jp/read0105397/">永井正勝</a>,
                  Associate Professor, Uehiro Project for the Asian Research
                  Library, The University of Tokyo.
                </li>
                <li>
                  <a href="https://researchmap.jp/wakit/">和氣愛仁</a>,
                  Associate Professor, Faculty of Humanities and Social
                  Sciences, University of Tsukuba.
                </li>
                <li>
                  <a href="https://researchmap.jp/takahashi.yona">高橋洋成</a>,
                  Research Associate, Research Institute for Languages and
                  Cultures of Asia and Africa, Tokyo University of Foreign
                  Studies.
                </li>
                <li>
                  <a href="https://researchmap.jp/nakamura.satoru/">中村覚</a>,
                  Assistant Professor, Information Technology Center, The
                  University of Tokyo.
                </li>
              </template>
              <template v-else>
                <li>
                  <a href="https://researchmap.jp/read0105397/?lang=english"
                    >Masakatsu NAGAI</a
                  >, Associate Professor, Uehiro Project for the Asian Research
                  Library, The University of Tokyo.
                </li>
                <li>
                  <a href="https://researchmap.jp/wakit/?lang=english"
                    >Toshihito WAKI</a
                  >, Associate Professor, Faculty of Humanities and Social
                  Sciences, University of Tsukuba.
                </li>
                <li>
                  <a href="https://researchmap.jp/takahashi.yona?lang=en"
                    >Yona TAKAHASHI</a
                  >, Research Associate, Research Institute for Languages and
                  Cultures of Asia and Africa, Tokyo University of Foreign
                  Studies.
                </li>
                <li>
                  <a href="https://researchmap.jp/nakamura.satoru/?lang=english"
                    >Satoru NAKAMURA</a
                  >, Assistant Professor, Information Technology Center, The
                  University of Tokyo.
                </li>
              </template>
            </ul>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="my-5">
        <v-card-title>
          <h2>{{ $t('updates') }}</h2>
        </v-card-title>
        <v-card-text>
          <template v-if="$i18n.locale === 'ja'">
            <ul>
              <li>
                2020年12月XX日:
                システムを更新しました。（日本語ページの追加、アイテム詳細ページの追加、RDFデータの追加、静的サイトジェネレータの利用）
              </li>
              <li>2019年12月11日: システムを公開しました。</li>
            </ul>
          </template>
          <template v-else>
            <div class="text--primary">
              <ul>
                <li>
                  XX, Dec., 2020: Updated: Japanese page, Item detail page, RDF
                  data, and SSG functionality were added.
                </li>
                <li>
                  11, Dec., 2019: Uploaded the data of Möller No.1 to 613bis,
                  vols.1-3.
                </li>
              </ul>
            </div>
          </template>
        </v-card-text>
      </v-card>
      <v-card class="my-5">
        <v-card-title>
          <h2>{{ $t('contact_information') }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="text--primary">
            <template v-if="$i18n.locale === 'ja'"> 永井正勝 </template>
            <template v-else>Masakatsu Nagai </template>
            :
            <a href="mailto:nagai.masakatsu@mail.u-tokyo.ac.jp"
              >nagai.masakatsu [at] mail.u-tokyo.ac.jp</a
            >
          </div>
        </v-card-text>
      </v-card>

      <br />
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
    const title = 'Hieratische Paläographie DB'
    return {
      titleTemplate: null,
      title,
    }
  },
}
</script>
