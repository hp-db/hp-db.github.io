<template>
  <div>
    <section class="mb-5">
      <v-parallax :src="baseUrl + '/img/ogp/home.jpg'" height="300">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-1 text-center">
            <b>{{ $t(title) }}</b>
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
      <v-card class="my-5" flat>
        <v-card-title>
          <h2>{{ $t('about_') }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="text--primary">
            <template v-if="$i18n.locale === 'ja'">
              <p>{{ $t(title) }}（{{ title }}）へようこそ！</p>
              <p>
                このデータベースでは，Georg Möller,
                <i>Hieratische Paläographie</i>
                , 1-3巻,
                1909–12年に掲載されているヒエラティック（古代エジプト神官文字）の字形を検索することができます．
              </p>
              <p>
                検索は，ヒエラティック番号，ヒエログリフ番号，音価/語などから行うことができます．検索の仕方は<nuxt-link
                  :to="localePath({ name: 'about' })"
                  >マニュアル</nuxt-link
                >をご覧下さい．
              </p>
              <p>
                本データベースが，ヒエラティックに関心のあるすべての人に役立つことを願っています．
              </p>
              <p>HDB (Hieratic Database)プロジェクトチーム</p>
            </template>
            <template v-else>
              <p>Welcome to our Hieratische Paläographie DB!</p>
              <p>
                This is a retrieval system for hieratic scripts; it uses IIIF
                format images (owned by the Asian Research Library of the
                University of Tokyo) of Georg Möller's
                <i>Hieratische Paläographie</i> (1909–12).
              </p>
              <p>
                We hope this platform is useful for everyone who has an interest
                in Hieratic scripts.
              </p>
              <p>HDB (Hieratic Database) Project Team</p>
            </template>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="my-5" flat>
        <v-card-title>
          <h2>{{ $t('members') }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="text--primary">
            <ul>
              <template v-if="$i18n.locale === 'ja'">
                <li>
                  <a href="https://researchmap.jp/Masakatsu-Nagai/">永井正勝</a
                  >, 東京大学
                  東京大学附属図書館アジア研究図書館上廣倫理財団寄付研究部門
                  特任准教授
                </li>
                <li>
                  <a href="https://researchmap.jp/wakit/">和氣愛仁</a>, 筑波大学
                  人文社会系 准教授
                </li>
                <li>
                  <a href="https://researchmap.jp/takahashi.yona">高橋洋成</a>,
                  東京外国語大学 アジア・アフリカ言語文化研究所 特任研究員
                </li>
                <li>
                  <a href="https://researchmap.jp/nakamura.satoru/">中村覚</a>,
                  東京大学 史料編纂所 助教
                </li>
              </template>
              <template v-else>
                <li>
                  <a href="https://researchmap.jp/Masakatsu-Nagai/?lang=english"
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
                  >, Assistant Professor, Historiographical Institute, The
                  University of Tokyo.
                </li>
              </template>
            </ul>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="my-5" flat>
        <v-card-title>
          <h2>{{ $t('updates') }}</h2>
        </v-card-title>
        <v-card-text>
          <template v-if="$i18n.locale === 'ja'">
            <ul>
              <li>
                2021年1月31日:
                システムを更新しました．（数字類と連字のコンテンツを追加．メタデータ，表示項目，RDF，UIの修正）
              </li>
              <li>
                2020年11月9日:
                システムを更新しました．（日本語ページの追加，アイテム詳細ページの追加，RDFデータの追加，静的サイトジェネレータの利用）
              </li>
              <li>2019年12月11日: システムを公開しました．</li>
            </ul>
          </template>
          <template v-else>
            <div class="text--primary">
              <ul>
                <li>
                  31, Jan.,2021: Updated: Contents of “Number part” and
                  “Ligature part” were added. Metatada, Display item, RDF data,
                  and UI were modified.
                </li>
                <li>
                  9, Nov., 2020: Updated: Japanese page, Item detail page, RDF
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
      <v-card class="my-5" flat>
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

    <v-container v-if="false">
      <nuxt-content :document="document" />
    </v-container>
  </div>
</template>

<script>
export default {
  /*
  async asyncData({ $content, app }) {
    const document = await $content(`${app.i18n.locale}/about`, 'index').fetch()
    return { document }
  },
  */
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      title: process.env.siteName,
    }
  },
  head() {
    const title = this.title
    return {
      titleTemplate: null,
      title,
    }
  },
}
</script>
