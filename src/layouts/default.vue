<template>
  <v-app>
    <div>
      <v-navigation-drawer v-model="drawer" app :temporary="true">
        <v-list>
          <v-list-item link :to="{ name: 'index' }">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{ name: 'search' }">
            <v-list-item-action>
              <v-icon>mdi-magnify</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Search</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            href="https://wdb.jinsha.tsukuba.ac.jp/hdb/"
            target="_blank"
          >
            <v-list-item-action>
              <v-icon>mdi-database</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                >Hieratic Database<br />Project</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            href="https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/item?search=6+W%3A800+X%3Amol&amp;sort_by=uparl%3AidentifierOfTheData&amp;sort_order=asc"
            target="_blank"
          >
            <v-list-item-action>
              <v-icon>mdi-image</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                >Digital Resources for<br />Egyptian Studies</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            href="http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation=https://moeller.jinsha.tsukuba.ac.jp/data/curation.json&mode=annotation&lang=ja"
            target="_blank"
          >
            <v-list-item-action>
              <v-icon>mdi-image</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>IIIF Curation Platfrom</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :href="'snorql'" target="_blank">
            <v-list-item-action>
              <v-icon>mdi-image</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>SPARQL Endpoint</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Hieratische Paläographie DB</v-toolbar-title>
      </v-app-bar>
    </div>

    <v-main>
      <nuxt />
    </v-main>

    <v-footer :dark="true" class="mt-5">
      <v-container>
        <p class="text-center my-5">
          Masakatsu NAGAI, Toshihito WAKI, Yona TAKAHASHI and Satoru NAKAMURA
        </p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    // baseUrl: process.env.BASE_URL,
  }),
}
</script>
