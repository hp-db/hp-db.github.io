/* eslint-disable @typescript-eslint/no-unused-vars */
import i18n from 'nuxt-i18n'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Utils } from '@/plugins/utils'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { SearchUtils } from '@/plugins/searchUtils'

// vueインスタンス用
declare module 'vue/types/vue' {
  interface Vue {
    readonly $utils: Utils
    readonly $searchUtils: SearchUtils
  }
}
