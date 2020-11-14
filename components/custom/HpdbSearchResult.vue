<template>
  <div>
    <div class="my-4 text-right">
      <v-btn color="primary" class="ma-2" @click="compare">
        <template v-if="$i18n.locale == 'ja'">
          {{ selected.length }} 件のアイテムを比較
        </template>
        <template v-else> Compare {{ selected.length }} items </template>
      </v-btn>

      <v-dialog v-model="dialog" scrollable max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-2" v-on="on">{{ $t('list') }}</v-btn>
        </template>
        <v-card>
          <v-card-title>{{ $t('selected_items') }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px">
            <v-list-item-group>
              <v-list-item
                v-for="(id, index) in selected"
                :key="'selected_' + index"
              >
                <v-checkbox
                  v-model="selectedTemporary"
                  color="primary"
                  :label="getLabel(id)._source._label[0]"
                  :value="id"
                ></v-checkbox>
              </v-list-item>
            </v-list-item-group>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="primary" @click="dialog = false">{{
              $t('close')
            }}</v-btn>
            <v-btn color="error" @click="deleteSelected">{{
              $t('delete')
            }}</v-btn>
            <v-btn color="error" @click="selected = []">{{
              $t('reset')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-card v-for="(obj, index) in results" :key="index" class="mb-5">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <span>
              <b>{{ $t('label') }}</b>
              &nbsp;
              {{ obj._source._label[0] }}
            </span>

            <br />

            <span>
              <b>{{ $t('Hieratic No') }}</b>
              &nbsp;
              <template v-for="(value, index2) in obj._source['Hieratic No']">
                <nuxt-link
                  :key="index2"
                  :to="
                    localePath({
                      name: 'search',
                      query: {
                        'fc-Hieratic No': value,
                      },
                    })
                  "
                  >{{ value }}</nuxt-link
                >
                <span
                  v-show="index2 != obj._source['Hieratic No'].length - 1"
                  :key="'mno_' + index2"
                  >&nbsp;+&nbsp;</span
                >
              </template>
            </span>

            <br />
            <span>
              <b>{{ $t('Hieroglyph No') }}</b>
              &nbsp;
              <template v-for="(value, index2) in obj._source['Hieroglyph No']">
                <nuxt-link
                  :key="index2"
                  :to="
                    localePath({
                      name: 'search',
                      query: {
                        'fc-Hieroglyph No': value,
                      },
                    })
                  "
                  >{{ value }}</nuxt-link
                >
                <span
                  v-show="index2 != obj._source['Hieroglyph No'].length - 1"
                  :key="'hno_' + index2"
                  >&nbsp;+&nbsp;</span
                >
              </template>
            </span>
            <br />

            <span>
              <b>{{ $t('Phone/Word') }}</b
              >&nbsp;
              <template v-for="(value, index2) in obj._source['Phone/Word']">
                <span :key="index2">
                  <span v-if="value.split('(').length > 1">(</span>

                  <nuxt-link
                    class="phone"
                    :to="
                      localePath({
                        name: 'search',
                        query: {
                          'fc-Phone/Word Mod': value
                            .replace('(', '')
                            .replace(')', ''),
                        },
                      })
                    "
                    >{{ value.replace('(', '').replace(')', '') }}</nuxt-link
                  >
                  <span v-if="value.split(')').length > 1">)</span>
                  <span v-show="index2 != obj._source['Phone/Word'].length - 1"
                    >&nbsp;,&nbsp;</span
                  >
                </span>
              </template>
            </span>
            <br />

            <span>
              <b>{{ $t('Vol') }}</b>
              &nbsp;{{ obj._source.Vol[0] }},&nbsp;
              <b>{{ $t('Page') }}</b>
              &nbsp;{{ obj._source.Page[0] }},&nbsp;

              <b>{{ $t('Order') }}</b>
              &nbsp;{{ obj._source.Order[0] }}
            </span>
            <br />
            <template v-if="obj._source.Note[0] != ''">
              <span>
                <b>{{ $t('Note') }}</b>
                &nbsp;{{ obj._source.Note[0] }}
              </span>
              <br />
            </template>

            <v-switch
              :value="selected.includes(obj._id)"
              @change="select(obj._id)"
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="8">
            <nuxt-link
              :to="
                localePath({
                  name: 'item-id',
                  params: { id: obj._id },
                })
              "
            >
              <v-img :src="obj._source._thumbnail[0]" class="grey lighten-2" />
            </nuxt-link>

            <div class="text-right">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mt-2"
                    target="_blank"
                    :href="obj._source._relatedLink[0]"
                    v-on="on"
                    ><img
                      :src="baseUrl + '/img/icons/icp-logo.svg'"
                      width="30px"
                  /></v-btn>
                </template>
                <span>{{ 'IIIF Curation Viewer' }}</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mt-2"
                    icon
                    target="_blank"
                    :href="getUrl(obj._source)"
                    v-on="on"
                    ><img :src="baseUrl + '/img/icons/ut.ico'" width="30px"
                  /></v-btn>
                </template>
                <span>{{ $t('uta') }}</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class ListSearchResult extends Vue {
  baseUrl: string = process.env.BASE_URL || ''

  get results() {
    return this.$store.state.result.hits.hits
  }

  get query() {
    return this.$store.state.query
  }

  get selected() {
    return this.$store.state.selected
  }

  set selected(value) {
    this.$store.commit('setSelected', value)
  }

  selectedTemporary: string[] = []

  dialog: boolean = false

  get index() {
    return this.$store.state.index
  }

  get dataAll() {
    return this.$store.state.data
  }

  select(id: string) {
    const selected = JSON.parse(JSON.stringify(this.selected))
    const index = selected.indexOf(id)
    if (index === -1) {
      selected.push(id)
    } else if (index !== -1) {
      selected.splice(index, 1)
    }
    this.selected = selected
  }

  compare() {
    const param = []

    for (let i = 0; i < this.selected.length; i++) {
      const id = this.selected[i]
      const obj = this.getLabel(id)
      const related = obj._source._relatedLink[0]

      const relatedSpl = related.split('&')
      const manifest = relatedSpl[0].split('=')[1]

      const canvas =
        relatedSpl[1].split('=')[1] + '#xywh=' + relatedSpl[2].split('=')[1]

      param.push({
        manifest,
        canvas,
      })
    }

    const url =
      this.baseUrl +
      '/mirador/?params=' +
      encodeURIComponent(JSON.stringify(param)) +
      '&layout=' +
      this.selected.length +
      'x1'
    open(url, '_blank')
  }

  resetSelected() {
    this.selected = []
    const hits = this.results.hits.hits
    for (let i = 0; i < hits.length; i++) {
      const obj = hits[i]
      obj.selected = false
    }
  }

  deleteSelected() {
    const selectedTemporary = this.selectedTemporary
    const selected = JSON.parse(JSON.stringify(this.selected))
    for (let i = 0; i < selectedTemporary.length; i++) {
      const id = selectedTemporary[i]
      const index = selected.indexOf(id)
      selected.splice(index, 1)
    }

    this.selected = selected
    this.selectedTemporary = []
  }

  getLabel(id: string) {
    const seq = this.index._id[id][0]
    const obj = this.dataAll[seq]
    return obj
  }

  getUrl(obj) {
    const params = obj._relatedLink[0].split('?')[1].split('&')
    const page = params[1].split('/canvas/p')[1]
    const xywh = params[2].split('=')[1]
    const id = params[0].split('/manifest/')[1].split('/')[0]
    const url =
      'https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/document/' +
      id +
      '#?c=0&m=0&s=0&cv=' +
      (Number(page) ^ 1) +
      '&xywh=' +
      xywh
    return url
  }
}
</script>
