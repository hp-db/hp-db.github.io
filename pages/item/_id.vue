<template>
  <div>
    <v-sheet color="grey lighten-3">
      <v-container>
        <iframe
          :src="getIframeUrl()"
          width="100%"
          height="200"
          allowfullscreen
          frameborder="0"
        ></iframe>
      </v-container>
    </v-sheet>
    <!--
    <v-sheet class="py-2" color="grey lighten-3">
      <v-container>
        <h2>{{ label }}</h2>
      </v-container>
    </v-sheet>
    -->
    <v-container class="mt-5 mb-10">
      <p class="text-center py-5">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              class="mx-1"
              icon
              target="_blank"
              :href="getCurationUrl()"
              v-on="on"
              ><img :src="baseUrl + '/img/icons/icp-logo.svg'" width="30px"
            /></v-btn>
          </template>
          <span>{{ 'IIIF Curation Viewer' }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              class="mx-1"
              icon
              target="_blank"
              :href="getUtaUrl()"
              v-on="on"
              ><img :src="baseUrl + '/img/icons/ut.ico'" width="30px"
            /></v-btn>
          </template>
          <span>{{ $t('uta') }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              icon
              class="mx-1"
              target="_blank"
              :href="
                baseUrl + '/snorql/?describe=' + prefix + '/api/items/' + id
              "
              v-on="on"
              ><img :src="baseUrl + '/img/icons/rdf-logo.svg'" width="30px"
            /></v-btn>
          </template>
          <span>{{ 'RDF' }}</span>
        </v-tooltip>

        <ResultOption
          :item="{
            label: id,
            url: url,
          }"
        />
      </p>

      <v-simple-table class="mt-10">
        <template #default>
          <tbody>
            <tr>
              <td width="30%">URL</td>
              <td style="overflow-wrap: break-word" class="py-5">
                <a :href="url">{{ url }}</a>
              </td>
            </tr>

            <tr>
              <td width="30%">ID</td>
              <td style="overflow-wrap: break-word" class="py-5">
                {{ id }}
              </td>
            </tr>

            <template v-for="(obj, key) in fields">
              <tr
                v-if="
                  metadataObj[obj.label] && metadataObj[obj.label].length > 0
                "
                :key="key"
              >
                <td width="30%">{{ $t(obj.label) }}</td>
                <td
                  style="overflow-wrap: break-word"
                  class="py-5"
                  :class="obj.label === 'Phone/Word' ? 'phone' : ''"
                >
                  <template
                    v-if="['Hieratic No', 'Hieroglyph No'].includes(obj.label)"
                  >
                    <Split
                      :data="metadataObj[obj.label]"
                      :field="`${obj.label} Mod`"
                    ></Split>
                  </template>
                  <template v-else-if="obj.text">
                    <span
                      v-for="(v, key2) in metadataObj[obj.label]"
                      :key="key2"
                    >
                      {{ v }}
                    </span>
                  </template>
                  <template v-else>
                    <nuxt-link
                      v-for="(v, key2) in metadataObj[obj.label]"
                      :key="key2"
                      :to="
                        localePath({
                          name: 'search',
                          query: getQuery(obj.label, v),
                        })
                      "
                    >
                      {{
                        ['Item Type', 'Sub Type', 'Unit'].includes(obj.label)
                          ? $t(v)
                          : v
                      }}
                    </nuxt-link>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>

      <v-sheet class="text-center mt-10">
        <small>
          <h3 class="mb-5">{{ $t('license') }}</h3>

          <template v-if="$i18n.locale == 'ja'">
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
              ><img
                alt="クリエイティブ・コモンズ・ライセンス"
                style="border-width: 0"
                src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a
            ><br />この作品は<a
              rel="license"
              href="http://creativecommons.org/licenses/by/4.0/"
              >クリエイティブ・コモンズ 表示 4.0 国際 ライセンス</a
            >の下に提供されています。
          </template>
          <template v-else>
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
              ><img
                alt="Creative Commons License"
                style="border-width: 0"
                src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a
            ><br />This work is licensed under a
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
              >Creative Commons Attribution 4.0 International License</a
            >.
          </template>
        </small>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ payload, app }) {
    if (payload) {
      return payload
    } else {
      const id = app.context.route.params.id
      const { data } = await axios.get(
        process.env.BASE_URL + `/data/curation_old.json`
      )
      const selections = data.selections
      for (let i = 0; i < selections.length; i++) {
        const selection = selections[i]
        const manifest = selection.within['@id']
        const members = selection.members
        for (let j = 0; j < members.length; j++) {
          const member = members[j]

          if (member.label === id) {
            member.manifest = manifest
            return member
          }
        }
      }
    }
  },

  data() {
    return {
      baseUrl: process.env.BASE_URL,
      prefix: 'https://w3id.org/hpdb',
      fields: [
        { label: 'Item Type' },
        { label: 'Sub Type' },
        { label: 'Unit' },
        { label: 'Vol' },
        { label: 'Page' },
        { label: 'Order' },
        { label: 'Item Label' },
        { label: 'Hieratic No' },
        { label: 'Numeral' },
        { label: 'Category Class' },
        { label: 'Hieroglyph No' },
        { label: 'Phone/Word' },
        { label: 'Note', text: true },
      ],
    }
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

  computed: {
    // 算出 getter 関数
    url() {
      return this.prefix + '/item/' + this.$route.params.id
    },
    id() {
      return this.$route.params.id
    },
    title() {
      return this.id
    },
    metadataObj() {
      const metadata = this.metadata
      const metadataObj = {}
      for (let i = 0; i < metadata.length; i++) {
        const m = metadata[i]
        const values = Array.isArray(m.value)
          ? m.value
          : m.value === ''
          ? []
          : [m.value]
        metadataObj[m.label] = values
      }
      return metadataObj
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
    getUtaUrl() {
      const memberId = this['@id']
      const memberIdSpl = memberId.split('#xywh=')
      const canvasId = memberIdSpl[0]
      const xywh = memberIdSpl[1]

      const page = canvasId.split('/canvas/p')[1]

      const id = this.manifest.split('/manifest/')[1].split('/')[0]
      const url =
        'https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/document/' +
        id +
        '#?c=0&m=0&s=0&cv=' +
        (Number(page) - 1) +
        '&xywh=' +
        xywh
      return url
    },
    getQuery(label, value) {
      const query = {}
      query['fc-' + label] = value
      return query
    },
  },
}
</script>
