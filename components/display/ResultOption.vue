<template>
  <span>
    <v-btn depressed icon @click="view">
      <!-- {{ $t('view') }} color="primary" -->
      <v-icon>mdi-eye</v-icon>
    </v-btn>
    <v-btn
      v-if="item.manifest"
      depressed
      icon
      :href="item.manifest"
      target="_blank"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <img
            height="24px"
            :src="baseUrl + $utils.getManifestIcon(manifest)"
            v-on="on"
          />
        </template>
        <span>{{ $t('manifest') }}</span>
      </v-tooltip>
    </v-btn>

    <!--

    <template v-if="advanced">
      <v-btn
        v-if="item.manifest"
        depressed
        icon
        :href="
          'http://www.kanzaki.com/works/2016/pub/image-annotator?u=' +
          encodeURIComponent(item.manifest)
        "
        target="_blank"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn depressed icon v-on="on">
              <v-icon>mdi-monitor-eye</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('Image Annotatorで見る') }}</span>
        </v-tooltip>
      </v-btn>
    </template>

    -->

    <!-- 
    <v-menu open-on-hover top offset-y>
      <template v-slot:activator="{ on }">
        <v-btn depressed icon v-on="on">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </template>

      <ShareButtons
        :url="url"
        :title="title"
        :manifest="item.manifest ? item.manifest : ''"
      />
    </v-menu>
    -->
    <v-menu top offset-y>
      <template v-slot:activator="{ on }">
        <v-btn depressed icon v-on="on">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </template>

      <ShareButtons
        :url="url"
        :title="title"
        :manifest="item.manifest ? item.manifest : ''"
      />
    </v-menu>
  </span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
import ShareButtons from '~/components/common/ShareButtons.vue'

@Component({
  components: {
    ShareButtons,
  },
})
export default class resultoption extends Vue {
  baseUrl: any = process.env.BASE_URL

  SIMILAR_IMAGES_FLAG: boolean = process.env.SIMILAR_IMAGES_FLAG === 'true'

  get advanced() {
    if (this.$store.state.mode === 'all') {
      return true
    } else {
      return false
    }
  }

  /*
  @Prop({ required: true })
  manifest!: string

  @Prop({ required: true })
  id!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  path!: any
  */

  @Prop({ required: true })
  item!: any

  /*
  :id="item.id" :path="item.path" :title="item.label"
  */

  get manifest() {
    return this.item.manifest
  }

  get id() {
    return this.item.id
  }

  get title() {
    return this.item.label
  }

  get path() {
    return this.item.path
  }

  get url() {
    // return process.env.BASE_URL + '/item/' + this.id
    return this.item.url
  }

  view() {
    this.$store.commit('setCurrentManifest', this.item.manifest)
    this.$store.commit('setCurrentMember', this.item.id)
  }
}
</script>
