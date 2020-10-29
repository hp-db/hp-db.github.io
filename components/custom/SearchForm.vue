<template>
  <v-container class="pt-5">
    <v-card class="my-5" flat outlined>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="3">
            <v-select
              v-model="vol"
              :items="vols"
              :label="$t('Vol')"
              multiple
            ></v-select>
          </v-col>

          <v-col cols="12" sm="3">
            <v-text-field
              v-model="hieraticNo"
              :label="$t('Hieratic No')"
              autocomplete="on"
              list="list_mno"
              @keyup.enter="search"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3">
            <v-text-field
              v-model="hieroglyphNo"
              :label="$t('Hieroglyph No')"
              list="list_hno"
              @keyup.enter="search"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3">
            <v-text-field
              v-model="phonetic"
              :label="$t('Phone/Word')"
              @keyup.enter="search"
            ></v-text-field>
            <!-- class="phone" -->
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="note"
              :label="$t('Note')"
              @keyup.enter="search"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn class="ma-2" color="primary" @click="search">{{
              $t('search')
            }}</v-btn>
            <v-btn class="ma-2" @click="reset">{{ $t('reset') }}</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'

@Component({})
export default class SearchForm extends Vue {
  vols: string[] = ['1', '2', '3']

  mounted() {
    this.init()
  }

  @Watch('$route')
  watchRoute(): void {
    this.init()
  }

  init() {
    const advanced = this.$route.query

    if (advanced['fc-Vol']) {
      this.vol = advanced['fc-Vol']
    } else {
      this.vol = []
    }

    if (advanced['fc-Hieratic No Mod']) {
      this.hieraticNo = advanced['fc-Hieratic No Mod']
    } else {
      this.hieraticNo = ''
    }

    if (advanced['fc-Hieroglyph No Mod']) {
      this.hieroglyphNo = advanced['fc-Hieroglyph No Mod']
    } else {
      this.hieroglyphNo = ''
    }

    if (advanced['fc-Phone/Word']) {
      this.phonetic = advanced['fc-Phone/Word']
    } else {
      this.phonetic = ''
    }

    if (advanced['q-Note']) {
      this.note = advanced['q-Note']
    } else {
      this.note = ''
    }
  }

  vol: string[] = []

  hieraticNo: string = ''

  hieroglyphNo: string = ''

  phonetic: string = ''

  note: string = ''

  get advanced() {
    return this.$store.state.advanced
  }

  search() {
    const query: any = {}

    // --------

    const vol = this.vol

    if (vol.length !== 0) {
      query['fc-Vol'] = vol
    }

    // --------

    let hieraticNo = this.hieraticNo

    if (['A', 'B', 'C', 'a', 'b', 'c'].includes(hieraticNo.slice(-1))) {
      hieraticNo = hieraticNo.slice(0, hieraticNo.length - 1)
    }

    hieraticNo = hieraticNo.replace('bis', '')

    if (hieraticNo !== '') {
      query['fc-Hieratic No Mod'] = hieraticNo
    }

    // --------

    let hieroglyphNo = this.hieroglyphNo

    hieroglyphNo = hieroglyphNo.split('*').join('')

    if (hieroglyphNo !== '') {
      query['fc-Hieroglyph No Mod'] = hieroglyphNo
    }

    // --------

    const phonetic = this.phonetic

    if (phonetic !== '') {
      query['fc-Phone/Word'] = phonetic
    }

    // --------

    const note = this.note

    if (note !== '') {
      query['q-Note'] = note
    }

    // --------

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  reset() {
    this.$router.push(
      this.localePath({
        name: 'search',
      }),
      () => {},
      () => {}
    )
  }
}
</script>
