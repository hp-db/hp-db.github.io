<template>
  <div>
    <v-container class="my-5">
      <h1>
        <template v-if="$i18n.locale == 'ja'">
          {{ id }}リソースが持つプロパティ
        </template>
        <template v-else> Properties in "{{ id }}" resources </template>
      </h1>

      <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="-1"
        class="my-10"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.path="{ item }">
          <code
            style="background-color: #fbe5e1; color: #c0341d; padding: 0 0.4rem"
            >{{ getUri(item.path) }}</code
          >
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.min="{ item }">
          <template v-if="item.min === 1">
            <b>{{ $t('required') }}</b>
          </template>
          <template v-else>
            {{ $t('optional') }}
          </template>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.max="{ item }">
          <template v-if="item.max === 1">
            {{ $t('non_repeatable') }}
          </template>
          <template v-else>
            {{ $t('repeatable') }}
          </template>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.datatype="{ item }">
          <code
            style="background-color: #fbe5e1; color: #c0341d; padding: 0 0.4rem"
            >{{ getUri(item.datatype) }}</code
          >
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.example="{ item }">
          {{ getUri(item.example) }}
        </template>
      </v-data-table>

      <p class="text-center mt-5">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn icon class="mx-1" target="_blank" :href="uri" v-on="on"
              ><img :src="baseUrl + '/img/icons/rdf-logo.svg'" width="45px"
            /></v-btn>
          </template>
          <span>{{ 'RDF' }}</span>
        </v-tooltip>
      </p>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ params, payload, app }) {
    if (payload) {
      return payload
    } else {
      let baseUrl = process.env.BASE_URL
      if (baseUrl === '') {
        baseUrl = 'http://localhost:3000'
      }
      const url = baseUrl + `/api/shapes/${params.id}Shape.json`

      const { data } = await axios.get(encodeURI(url))

      const result = data[0]

      const uri = result['@id']

      const id = result['http://www.w3.org/ns/shacl#targetClass'][0][
        '@id'
      ].split('/classes/')[1]

      const ps = result['http://www.w3.org/ns/shacl#property']

      const map = {}

      for (let i = 0; i < ps.length; i++) {
        const pid = ps[i]['@id']

        for (let j = 0; j < data.length; j++) {
          const obj = data[j]
          const oid = obj['@id']
          if (oid === pid) {
            let name = ''
            const names = obj['http://www.w3.org/ns/shacl#name']
            for (let k = 0; k < names.length; k++) {
              const nobj = names[k]
              if (nobj['@language'] === app.i18n.locale) {
                name = nobj['@value']
                break
              }
            }

            const order = obj['http://www.w3.org/ns/shacl#order'][0]['@value']

            const row = {
              path: obj['http://www.w3.org/ns/shacl#path'][0]['@id'],
              name,
              example: obj['http://www.w3.org/2004/02/skos/core#example']
                ? obj['http://www.w3.org/2004/02/skos/core#example'][0][
                    '@value'
                  ]
                : '',
              min: obj['http://www.w3.org/ns/shacl#minCount']
                ? obj['http://www.w3.org/ns/shacl#minCount'][0]['@value']
                : '',
              max: obj['http://www.w3.org/ns/shacl#maxCount']
                ? obj['http://www.w3.org/ns/shacl#maxCount'][0]['@value']
                : '',

              datatype: obj['http://www.w3.org/ns/shacl#datatype']
                ? obj['http://www.w3.org/ns/shacl#datatype'][0]['@id']
                : '',
            }

            map[order] = row

            break
          }
        }
      }

      const rows = []
      for (const key in map) {
        rows.push(map[key])
      }

      return {
        id,
        uri,
        desserts: rows,
      }

      // return result
    }
  },

  data() {
    return {
      baseUrl: process.env.BASE_URL,
      prefix: 'https://w3id.org/hpdb',
      prefixes: {
        hpdb: 'https://w3id.org/hpdb/api/',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        schema: 'http://schema.org/',
        dct: 'http://purl.org/dc/terms/',
      },
      headers: [
        {
          text: this.$t('property_name'),
          value: 'path',
        },
        { text: this.$t('property_description'), value: 'name' },
        { text: this.$t('property_example'), value: 'example' },
        { text: this.$t('property_min'), value: 'min' },
        { text: this.$t('property_max'), value: 'max' },
        { text: this.$t('range'), value: 'datatype' },
      ],
    }
  },
  head() {
    const title = this.id
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

  methods: {
    getUri(data) {
      data = '' + data
      const prefixes = this.prefixes
      for (const key in prefixes) {
        data = data.replace(prefixes[key], key + ':')
      }
      const size = 60
      if (data.length > size) {
        data = data.substring(0, size) + '...'
      }
      return data
    },
  },
}
</script>
