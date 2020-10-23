<template>
  <v-container class="pt-5">
    <v-row align="center">
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="keywordStr"
          class="mr-2"
          filled
          background-color="grey lighten-2"
          rounded
          dense
          hide-details
          :label="$t('キーワード検索')"
          clearable
          clear-icon="mdi-close-circle"
          append-icon="search"
          @click:append="search"
          @keydown.enter="trigger"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn color="primary" class="mr-2" @click="search">
          {{ $t('search') }}
        </v-btn>
        <!-- 
        <v-btn @click="dialog = !dialog">
          {{ $t('advanced_search') }}
        </v-btn>
        -->
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" scrollable>
      <v-card>
        <v-card-title class="grey lighten-2">
          {{ $t('advanced_search') }}
        </v-card-title>
        <v-card-text :style="'height: ' + height * 0.6 + ';'">
          <v-container>
            <h3>経典番号</h3>

            <v-row>
              <v-col>
                <v-combobox
                  v-model="from"
                  :loading="loadingFrom"
                  :search-input.sync="termFrom"
                  filled
                  rounded
                  :items="items"
                  :label="$t('From')"
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-combobox>
              </v-col>
              <v-col>
                <v-combobox
                  v-model="to"
                  :loading="loadingTo"
                  :search-input.sync="termTo"
                  filled
                  rounded
                  :items="items"
                  :label="$t('To')"
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-combobox>
              </v-col>
            </v-row>

            <h3>検索文字列</h3>

            <v-row>
              <v-col cols="12" :sm="7">
                <v-text-field
                  v-model="from"
                  :loading="loadingFrom"
                  :search-input.sync="termFrom"
                  filled
                  rounded
                  :label="$t('検索文字列を入力してください。')"
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-text-field>
              </v-col>
              <v-col cols="12" :sm="5">
                <v-radio-group v-model="radios" row>
                  <v-radio label="and" value="and"></v-radio>
                  <v-radio label="or" value="or"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <h3>検索対象</h3>

            <v-row>
              <v-col cols="12" :sm="2">
                <v-row>
                  <v-col>
                    <v-checkbox
                      v-model="selected2"
                      label="すべて"
                      value="すべて"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" :sm="10">
                <v-row>
                  <v-col
                    ><v-checkbox
                      v-model="selected3"
                      label="勘同目録・脚注"
                      value="勘同目録・脚注"
                    ></v-checkbox
                  ></v-col>
                  <v-col>
                    <v-checkbox
                      v-model="selected3"
                      label="テキスト"
                      value="テキスト"
                    ></v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="selected3"
                      label="所蔵者"
                      value="所蔵者"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    ><v-checkbox
                      v-model="selected3"
                      label="底本"
                      value="底本"
                    ></v-checkbox
                  ></v-col>
                  <v-col>
                    <v-checkbox
                      v-model="selected3"
                      label="校本"
                      value="校本"
                    ></v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="selected3"
                      label="校本なし"
                      value="校本なし"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <h3>ソート</h3>

            <v-radio-group v-model="sort" row>
              <span class="mr-5">経典番号順</span>
              <v-radio label="昇順" value="aaa:asc"></v-radio>
              <v-radio label="降順" value="aaa:desc"></v-radio>

              <span class="ml-10 mr-5">配本順</span>
              <v-radio label="昇順" value="bbb:asc"></v-radio>
              <v-radio label="降順" value="bbb:desc"></v-radio>
            </v-radio-group>

            <!-- -->
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" btn @click="advancedSearch()">{{
            $t('search')
          }}</v-btn>
          <v-btn btn @click="dialog = false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class SearchForm extends Vue {
  sort: string = 'aaa:asc'

  from: string = ''
  to: string = ''
  termFrom: string = ''
  loadingFrom: string = ''

  termTo: string = ''
  loadingTo: string = ''

  items: any[] = ['T0001', 'T0002', 'T0003']

  radios: string = 'and'

  dialogFlag: boolean = false

  selected2: string = 'すべて'
  selected3: string[] = []

  trigger(event: any) {
    // 日本語入力中のEnterキー操作は無効にする
    if (event.keyCode !== 13) return

    this.search()
  }

  keywordStr: string = ''
  keywords: string[] = []

  dialog: boolean = false

  search() {
    let keywordStr = this.keywordStr

    if (!keywordStr) {
      keywordStr = ''
    }

    const keywords = this.$utils.splitKeyword(keywordStr)

    // push 処理
    const query: any = Object.assign({}, this.$route.query)
    query.keyword = keywords
    query.from = 0

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  width: number = 100 // window.innerWidth
  height: number = 100 // window.innerHeight

  handleResize() {
    // resizeのたびにこいつが発火するので、ここでやりたいことをやる
    // this.width = window.innerWidth
    // this.height = window.innerHeight
  }

  mounted() {
    // window.addEventListener('resize', this.handleResize)
  }

  beforeDestroy() {
    // window.removeEventListener('resize', this.handleResize)
  }

  // dialog: boolean = false

  advanced: any = {}

  creators: any = [
    {
      value: '',
      text: 'All',
    },
    {
      value: 'Giovanni Battista Piranesi',
      text: 'Giovanni Battista Piranesi',
    },
    {
      value: 'Francesco Piranesi',
      text: 'Francesco Piranesi',
    },
  ] // 'All', 'Giovanni Battista Piranesi', 'Francesco Piranesi'

  advancedSearch() {
    const advanced = this.advanced
    const query: any = Object.assign({}, this.$route.query)
    for (const term in advanced) {
      const value: string = advanced[term].trim()
      if (value === '') {
        if (query[term]) {
          delete query[term]
        }
      } else {
        query[term] = value
      }
    }

    const keywordStr = this.keywordStr

    // const keywords = this.$utils.splitKeyword(keywordStr)
    query.keyword = keywordStr // keywords
    query.from = 0

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )

    this.dialog = false
  }
}
</script>
