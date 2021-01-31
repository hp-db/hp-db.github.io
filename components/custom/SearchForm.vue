<template>
  <v-container fluid class="pt-5">
    <v-card class="my-5" flat outlined>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="1"> </v-col>
          <v-col cols="12" sm="4" lg="2">
            <v-select
              v-model="fields.itemType.value"
              :items="convert2items(fields.itemType.arr)"
              item-text="text"
              item-value="value"
              :label="$t(fields.itemType.label)"
              multiple
            ></v-select>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-select
              v-model="fields.subType.value"
              :items="convert2items(fields.subType.arr)"
              item-text="text"
              item-value="value"
              :label="$t(fields.subType.label)"
              multiple
            ></v-select>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-select
              v-model="fields.unit.value"
              :items="convert2items(fields.unit.arr)"
              item-text="text"
              item-value="value"
              :label="$t(fields.unit.label)"
              multiple
            ></v-select>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="item"
              :label="$t('Item Label')"
              @keyup.enter="search"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="hieraticNo"
              :label="$t('Hieratic No')"
              @keyup.enter="search"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="1"> </v-col>
          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="fields.category.value"
              :label="$t(fields.category.label)"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="hieroglyphNo"
              :label="$t('Hieroglyph No')"
              @keyup.enter="search"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="phonetic"
              :label="$t('Phone/Word')"
              @keyup.enter="search"
            ></v-text-field>
            <!-- class="phone" -->
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="fields.numeral.value"
              :label="$t(fields.numeral.label)"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-select
              v-model="fields.vol.value"
              :items="fields.vol.arr"
              :label="$t(fields.vol.label)"
              multiple
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="1"> </v-col>
          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="fields.page.value"
              :label="$t(fields.page.label)"
              @keyup.enter="search"
            ></v-text-field>
            <!-- class="phone" -->
          </v-col>

          <v-col cols="12" sm="4" lg="2">
            <v-text-field
              v-model="fields.order.value"
              :label="$t(fields.order.label)"
              @keyup.enter="search"
            ></v-text-field>
            <!-- class="phone" -->
          </v-col>

          <v-col cols="12" sm="4" lg="2">
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
  fields: any = {
    itemType: {
      label: 'Item Type',
      arr: ['Main', 'Ligature', 'Number'],
      value: [],
    },
    subType: {
      label: 'Sub Type',
      arr: ['Numeral', 'Date', 'Fraction', 'Length', 'Area', 'Volume'],
      value: [],
    },
    unit: {
      label: 'Unit',
      arr: ['Single', 'Continuous'],
      value: [],
    },

    
    category: {
      label: 'Category Class',
      value: '',
    },
    numeral: {
      label: 'Numeral',
      value: '',
    },
    vol: {
      label: 'Vol',
      arr: ['1', '2', '3'],
      value: [],
    },
    page: {
      label: 'Page',
      value: '',
    },
    order: {
      label: 'Order',
      value: '',
    },
  }

  mounted() {
    this.init()
  }

  @Watch('$route')
  watchRoute(): void {
    this.init()
  }

  init() {
    const advanced = this.$route.query

    const fields = this.fields
    for (const field in fields) {
      const obj = fields[field]
      const label = obj.label
      if (advanced['fc-' + label]) {
        const values = advanced['fc-' + label]
        if (obj.arr) {
          obj.value = Array.isArray(values) ? values : [values]
        } else {
          obj.value = values
        }
      } else if (obj.arr) {
        obj.value = []
      } else {
        obj.value = ''
      }
    }

    /*
    if (advanced['fc-Vol']) {
      const vols = advanced['fc-Vol']
      this.vol = Array.isArray(vols) ? vols : [vols]
    } else {
      this.vol = []
    }
    */

    if (advanced['fc-Hieratic No Search']) {
      this.hieraticNo = advanced['fc-Hieratic No Search']
    } else {
      this.hieraticNo = ''
    }

    if (advanced['fc-Hieroglyph No Search']) {
      this.hieroglyphNo = advanced['fc-Hieroglyph No Search']
    } else {
      this.hieroglyphNo = ''
    }

    if (advanced['fc-Item Label Search']) {
      this.item = advanced['fc-Item Label Search']
    } else {
      this.item = ''
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

  hieraticNo: any = ''

  item: any = ""

  hieroglyphNo: any = ''

  phonetic: any = ''

  note: any = ''

  get advanced() {
    return this.$store.state.advanced
  }

  search() {
    const query: any = {}

    // --------

    let hieraticNo = this.hieraticNo

    if (['A', 'B', 'C', 'a', 'b', 'c'].includes(hieraticNo.slice(-1))) {
      hieraticNo = hieraticNo.slice(0, hieraticNo.length - 1)
    }

    hieraticNo = hieraticNo.replace('bis', '')

    if (hieraticNo !== '') {
      query['fc-Hieratic No Search'] = hieraticNo
    }

    // --------

    let item = this.item

    if (['A', 'B', 'C', 'a', 'b', 'c'].includes(item.slice(-1))) {
      item = item.slice(0, item.length - 1)
    }

    item = item.replace('bis', '')

    if (item !== '') {
      query['fc-Item Label Search'] = item
    }

    // ----------

    let hieroglyphNo = this.hieroglyphNo

    hieroglyphNo = hieroglyphNo.split('*').join('')

    if (hieroglyphNo !== '') {
      query['fc-Hieroglyph No Search'] = hieroglyphNo
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

    /*
    const page = this.page

    if (page !== '') {
      query['fc-Page'] = page
    }

    // --------

    const order = this.order

    if (order !== '') {
      query['fc-Order'] = order
    }

    // --------

    const category = this.category

    if (category.length !== 0) {
      query['fc-Category'] = category
    }

    // --------

    const compound = this.compound

    if (compound.length !== 0) {
      query['fc-Compound'] = compound
    }

    // --------

    const categoryClass = this.categoryClass

    if (categoryClass !== '') {
      query['fc-Class'] = categoryClass
    }
    */

    // --------

    const fields = this.fields

    for (const field in fields) {
      const obj = fields[field]
      const values = obj.value

      if (values.length !== 0) {
        query['fc-' + obj.label] = values
      }
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

  convert2items(arr: any[]) {
    const items = []
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i]
      items.push({
        value,
        text: this.$t(value),
      })
    }
    return items
  }
}
</script>
