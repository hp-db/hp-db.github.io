<template>
  <div>
    <v-container class="py-5">
      <iframe
        :src="getIframeUrl()"
        width="100%"
        height="500"
        allowfullscreen
        frameborder="0"
      ></iframe>
    </v-container>
    <!--
    <v-sheet class="py-2" color="grey lighten-3">
      <v-container>
        <h2>{{ label }}</h2>
      </v-container>
    </v-sheet>
    -->
    <v-container>
      <p class="text-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mx-1"
              icon
              target="_blank"
              :href="getCurationUrl()"
              v-on="on"
              ><img
                src="https://cultural.jp/img/icons/icp-logo.svg"
                width="30px"
            /></v-btn>
          </template>
          <span>{{ 'IIIF Curation Viewer' }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              class="mx-1"
              target="_blank"
              :href="
                baseUrl + '/snorql/?describe=' + prefix + '/api/items/' + id
              "
              v-on="on"
              ><img
                src="https://jpsearch.go.jp/assets/img/icon/rdf-logo.svg"
                width="30px"
            /></v-btn>
          </template>
          <span>{{ 'RDF' }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mx-1"
              icon
              target="_blank"
              :href="'https://twitter.com/intent/tweet?url=' + url"
              v-on="on"
              ><v-icon>mdi-twitter</v-icon></v-btn
            >
          </template>
          <span>{{ 'Twitter' }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mx-1"
              icon
              target="_blank"
              :href="'https://www.facebook.com/sharer/sharer.php?u=' + url"
              v-on="on"
              ><v-icon>mdi-facebook</v-icon></v-btn
            >
          </template>
          <span>{{ 'Facebook' }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mx-1"
              icon
              target="_blank"
              :href="'http://getpocket.com/edit?url=' + url"
              v-on="on"
              ><img
                style="font-size: 30px"
                src="https://cultural.jp/img/icons/pocket.svg"
            /></v-btn>
          </template>
          <span>{{ 'Pocket' }}</span>
        </v-tooltip>
      </p>
      <dl class="row">
        <dt class="col-sm-3 text-muted"><b>URL</b></dt>
        <dd class="col-sm-9">
          <a :href="prefix + '/item/' + $route.params.id">{{
            prefix + '/item/' + $route.params.id
          }}</a>
        </dd>
      </dl>

      <dl class="row">
        <dt class="col-sm-3 text-muted"><b>Label</b></dt>
        <dd class="col-sm-9">
          {{ title }}
        </dd>
      </dl>

      <dl v-for="(obj, key) in metadata" :key="key" class="row">
        <template
          v-if="
            !obj.label.includes('sort') &&
            !obj.label.includes('Mod') &&
            obj.value != ''
          "
        >
          <dt class="col-sm-3 text-muted">
            <b>{{ obj.label }}</b>
          </dt>
          <dd class="col-sm-9">
            {{ Array.isArray(obj.value) ? obj.value.join(', ') : obj.value }}
          </dd>
        </template>
      </dl>

      <dl class="row">
        <dt class="col-sm-3 text-muted"><b>License</b></dt>
        <dd class="col-sm-9">
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
            ><img
              alt="Creative Commons License"
              style="border-width: 0"
              src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a
          ><br />This work is licensed under a
          <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
            >Creative Commons Attribution 4.0 International License</a
          >.
        </dd>
      </dl>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ payload }) {
    if (payload) {
      return payload
    } else {
      const { data } = await axios.get(
        `https://moeller.jinsha.tsukuba.ac.jp/data/curation.json`
      )
      const result = data.selections[0].members[0]
      result.manifest = data.selections[0].within['@id']
      return result
    }
  },

  data() {
    return {
      baseUrl: process.env.BASE_URL,
      prefix: 'https://w3id.org/hpdb',
    }
  },

  computed: {
    // 算出 getter 関数
    url() {
      // `this` は vm インスタンスを指します
      return this.baseUrl + '/item/' + this.$route.params.id
    },
    id() {
      return this.$route.params.id
    },
    title() {
      const metadata = this.metadata
      const metadataObj = {}
      for (let i = 0; i < metadata.length; i++) {
        const obj = metadata[i]
        metadataObj[obj.label] = obj.value
      }
      return (
        metadataObj['Möller No Mod'][0] +
        '(' +
        metadataObj['Hieroglyph No Mod'][0] +
        ')'
      )
    },
  },

  methods: {
    getIframeUrl() {
      const url =
        this.baseUrl +
        '/curation/?manifest=' +
        this.manifest +
        '&canvas=' +
        encodeURIComponent(this['@id'])
      return url
    },

    getCurationUrl() {
      const memberId = this['@id']
      const memberIdSpl = memberId.split('#xywh=')
      const canvasId = memberIdSpl[0]
      const xywh = memberIdSpl[1]
      const url =
        'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=' +
        this.manifest +
        '&canvas=' +
        encodeURIComponent(canvasId) +
        '&xywh=' +
        xywh +
        '&xywh_highlight=border'
      return url
    },
  },

  head() {
    const title = this.title
    return {
      title,
      meta: [
        /*
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        */
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        /*
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        */
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.url,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.thumbnail,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    }
  },
}
</script>
