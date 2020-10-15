<template>
  <div>
    <section class="mb-5">
      <v-parallax src="img/ogp/home.jpg" height="600">
        <v-layout column align-center justify-center class="white--text">
          <h1 class="white--text mb-2 display-1 text-center">
            <b>Hieratische Paläographie DB</b>
          </h1>
          <v-btn large class="mt-5" :to="{ name: 'search' }" color="primary"
            >Try out</v-btn
          >
        </v-layout>
      </v-parallax>
    </section>

    <v-container>
      <v-card class="my-5">
        <v-card-text>
          <p class="display-1 text--primary text-center my-5">About</p>
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
        <v-card-text>
          <p class="display-1 text--primary text-center my-5">Members</p>

          <div class="text--primary">
            <ul>
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
                Yona TAKAHASHI, Research Associate, Research Institute for
                Languages and Cultures of Asia and Africa, Tokyo University of
                Foreign Studies.
              </li>
              <li>
                <a href="https://researchmap.jp/nakamura.satoru/?lang=english"
                  >Satoru NAKAMURA</a
                >, Assistant Professor, Information Technology Center, The
                University of Tokyo.
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="my-5">
        <v-card-text>
          <p class="display-1 text--primary text-center my-5">List of update</p>

          <div class="text--primary">
            11, Dec., 2019: Uploaded the data of Möller No.1 to 613bis,
            vols.1-3.
          </div>
        </v-card-text>
      </v-card>
      <v-card class="my-5">
        <v-card-text>
          <p class="display-1 text--primary text-center my-5">
            Contact information
          </p>

          <div class="text--primary">
            Masakatsu Nagai:
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
}
</script>
