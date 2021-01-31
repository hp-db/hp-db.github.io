<template>
  <div v-show="filterShowFlag">
    <v-container fluid>
      <b style="vertical-align: middle">{{ $t('search_query') }}</b>
      <template v-if="keyword">
        <v-chip
          v-for="(value, index) in keyword"
          :key="index"
          style="white-space: normal; word-wrap: break-word"
          class="ma-1"
          close
          color="primary"
          label
          text-color="white"
          @click:close="removeKey(value, 'keyword')"
        >
          {{ $t('keyword') }}: {{ value }}
        </v-chip>
      </template>

      <template v-for="(type, t) in ['fc', 'q']">
        <template v-for="(agg, label) in advanced[type]">
          <span :key="t + '-' + label">
            <template v-for="method in ['+', '-']">
              <v-chip
                v-for="(value, m) in agg[method]"
                :key="m"
                style="white-space: normal; word-wrap: break-word"
                class="ma-1"
                close
                :color="method === '+' ? 'primary' : 'grey'"
                label
                text-color="white"
                @click:close="
                  removeAdvanced(
                    label,
                    [method === '+' ? value : '-' + value],
                    type
                  )
                "
              >
                <v-icon v-if="method !== '+'" class="mr-1"
                  >mdi-minus-box</v-icon
                >
                {{ getLabel(label) }}:
                <span
                  class="ml-1"
                  :class="label.includes('fc-Phone/Word') ? 'phone' : ''"
                  >{{ value }}</span
                >
              </v-chip>
            </template>
          </span>
        </template>
      </template>

      <v-btn
        small
        text
        :to="localePath({ name: 'search', query: { u: $route.query.u } })"
        class="error--text ma-1"
      >
        <v-icon>mdi-close</v-icon> {{ $t('clear') }}
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class CustomFilter extends Vue {
  get keyword() {
    const keyword = this.$store.state.keyword
    return Array.isArray(keyword) ? keyword : [keyword]
  }

  get advanced() {
    return this.$store.state.advanced
  }

  removeKey(value: string, label: string) {
    const data: any = {
      label,
      value: [value],
    }
    this.$store.commit('removeKey', data)
    this.$router.push(
      this.localePath({
        name: 'search',
        query: this.$searchUtils.getSearchQueryFromQueryStore(
          this.$store.state,
          this.$route.query.u
        ),
      }),
      () => {},
      () => {}
    )
  }

  removeAdvanced(label: string, values: string[], type: string) {
    this.$store.commit('removeAdvanced', {
      label,
      values,
      type,
    })

    // push 処理
    const query: any = this.$searchUtils.getSearchQueryFromQueryStore(
      this.$store.state,
      this.$route.query.u
    )

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  get filterShowFlag(): boolean {
    let flag = false
    if (
      this.keyword.length > 0 ||
      Object.keys(this.advanced.fc).length > 0 ||
      Object.keys(this.advanced.q).length > 0
    ) {
      flag = true
    }
    return flag
  }

  getLabel(term: string): string {
    const termLabels = null
    const types: any = {
      'fc-': this.$t('facet'),
      'q-': this.$t('advanced'),
    }

    let result: string = ''

    for (const type in types) {
      if (term.startsWith(type)) {
        const label = term.replace(type, '')

        console.log(label, termLabels)

        result =
          '[' +
          types[type] +
          '] ' +
          this.$t((termLabels && termLabels[label] ? termLabels[label] : label))

        break
      }
    }

    return result
  }
}
</script>
