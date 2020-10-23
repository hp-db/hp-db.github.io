<template>
  <v-card>
    <v-row class="pa-4 mb-5">
      <v-col cols="12" sm="3" class="mb-4">
        <nuxt-link
          :to="
            localePath({
              name: 'item-id',
              params: { id: item._id },
            })
          "
        >
          <v-img
            :src="$utils.formatArrayValue(item._source._thumbnail)"
            contain
            style="height: 150px"
            width="100%"
            class="grey lighten-2"
          ></v-img>
        </nuxt-link>
      </v-col>
      <v-col cols="12" sm="9">
        <h3 class="mb-4">
          <nuxt-link
            :to="
              localePath({
                name: 'item-id',
                params: { id: item._id },
              })
            "
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="$utils.formatArrayValue(item._source._label)"></span>
          </nuxt-link>
        </h3>

        <template v-for="(obj, field) in item._source">
          <!-- sorted -->
          <template v-if="!field.startsWith('_')">
            <dl :key="field" class="row my-0 py-0">
              <dt class="col-sm-3 my-0 py-0">
                <span class="text-muted">{{ field }}</span>
              </dt>
              <dd class="col-sm-9 my-0 py-0">
                <template>
                  <span v-for="(value, index) in obj" :key="index" class="mr-4">
                    {{ $utils.truncate(value, 100) }}
                  </span>
                </template>
              </dd>
            </dl>
            <v-divider :key="'v-divider-' + field" />
          </template>
        </template>

        <div class="text-right mt-4">
          <a
            v-if="item._source._related"
            class="mr-2 primary--text"
            :href="$utils.formatArrayValue(item._source._related)"
            target="_blank"
          >
            {{ $t('view_full_item') }}
            <v-icon>mdi-open-in-new</v-icon>
          </a>

          <ResultOption
            v-if="!item.share_hide"
            :item="{
              label: $utils.formatArrayValue(item._source._label),
              manifest: $utils.formatArrayValue(item._source._manifest),
              url: encodeURIComponent(getUrl(item)),
              id: item._id,
            }"
          />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
import ResultOption from '~/components/display/ResultOption.vue'

@Component({
  components: {
    ResultOption,
  },
})
export default class ListItem extends Vue {
  @Prop()
  item!: any

  sorted(source: any) {
    const obj: any = {}
    const keys = Object.keys(source).sort()
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      obj[key] = source[key]
    }
    return obj
  }

  getUrl(item: any) {
    return (
      process.env.BASE_URL +
      this.localePath({
        name: 'item',
        query: {
          u: this.$route.query.u,
          id: item._id,
        },
      })
    )
  }
}
</script>
