/* eslint-disable @typescript-eslint/no-unused-vars */
import i18n from 'nuxt-i18n'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Utils } from '@/plugins/utils'

// vueインスタンス用
declare module 'vue/types/vue' {
  interface Vue {
    readonly $utils: Utils
  }
}
