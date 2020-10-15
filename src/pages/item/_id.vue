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
      <b>{{ url }}</b>
      <p class="text-center">
        <a :href="baseUrl + '/snorql/?describe=' + prefix + '/api/items/' + id">
          <v-img
            src="https://jpsearch.go.jp/assets/img/icon/rdf-logo.svg"
            width="45px"
          />
        </a>
      </p>
      <dl class="row">
        <dt class="col-sm-3 text-muted">URL</dt>
        <dd class="col-sm-9">
          <a :href="prefix + '/item/' + $route.params.id">{{
            prefix + '/item/' + $route.params.id
          }}</a>
        </dd>
      </dl>
      <dl v-for="(obj, key) in metadata" :key="key" class="row">
        <dt class="col-sm-3 text-muted">{{ obj.label }}</dt>
        <dd class="col-sm-9">
          {{ Array.isArray(obj.value) ? obj.value.join(', ') : obj.value }}
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
  },

  head() {
    const title = this.label
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
          content: this.related,
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
