<template>
  <v-card flat>
    <!-- 
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn icon class="ma-2" @click="copyLink()" v-on="on"
          ><v-icon>mdi-link</v-icon></v-btn
        >
      </template>
      <span>{{ 'Copy this link.' }}</span>
    </v-tooltip>
    -->
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn icon class="ma-2" target="_blank" :href="twitterUrl" v-on="on"
          ><v-icon>mdi-twitter</v-icon></v-btn
        >
      </template>
      <span>{{ 'Twitter' }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn icon class="ma-2" target="_blank" :href="facebookUrl" v-on="on"
          ><v-icon>mdi-facebook</v-icon></v-btn
        >
      </template>
      <span>{{ 'Facebook' }}</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn icon class="ma-2" target="_blank" :href="pocketUrl" v-on="on"
          ><img
            style="font-size: 24px"
            :src="baseUrl + '/img/icons/pocket.svg'"
        /></v-btn>
      </template>
      <span>{{ 'Pocket' }}</span>
    </v-tooltip>
  </v-card>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ShareButtons extends Vue {
  baseUrl: any = process.env.BASE_URL

  copyLink() {
    const str = this.url

    const listener = function (e: any) {
      e.clipboardData.setData('text/plain', str)
      // 本来のイベントをキャンセル
      e.preventDefault()
      // 終わったら一応削除
      document.removeEventListener('copy', listener)
    }

    // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
    document.addEventListener('copy', listener)

    // コピー
    document.execCommand('copy')
    // alert('Copied.')
  }

  @Prop({ required: true })
  url!: string

  @Prop({ required: true })
  title!: string

  get twitterUrl() {
    return (
      'https://twitter.com/intent/tweet?url=' + this.url + '&text=' + this.title
    )
  }

  get facebookUrl() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + this.url
  }

  get pocketUrl() {
    return 'http://getpocket.com/edit?url=' + this.url
  }
}
</script>
