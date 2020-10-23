import colors from 'vuetify/es5/util/colors'
import axios from 'axios'

import md5 from 'crypto-js/md5'

const environment = process.env.NODE_ENV || 'local'
const env = require(`./env/${environment}.ts`)

// `DEPLOY_ENV` が `GH_PAGES` の場合のみ `router.base = '/<repository-name>/'` を追加する
const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: '/hpdb4/',
        },
      }
    : {}

const GOOGLE_ANALYTICS_ID = 'abc'

// path
const baseUrl = env.BASE_URL || ''
const baseDir = env.BASE_DIR || '/'
const basePath = baseUrl + baseDir

// meta
const lang = 'en'
const siteName = 'Hieratische Paläographie DB'
const siteDesc =
  "This is a retrieval system for hieratic scripts; it uses IIIF format images (owned by the Asian Research Library of the University of Tokyo) of Georg Möller's Hieratische Paläographie (1909–36)."
const siteKeywords = 'IIIF, Hieratic, Hieroglyph'

// images
const iconImages = baseDir + 'img/icons/'
const ogpImages = basePath + 'img/ogp/' // cdnPath + 'img/ogp/'

// pwa
const shortName = 'HPDB'
const manifestIcon = 'img/icons/icon-512.png'
// const splashscreens = cdnPath + 'img/splashscreens/'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',
  // srcDir: 'src/',

  env,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
      lang,
    },
    titleTemplate: `%s - ${siteName}`,
    title: 'hpdb',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'format-detection',
        content: 'telephone=no, email=no, address=no',
      },
      // SEO関連
      { hid: 'description', name: 'description', content: siteDesc },
      { hid: 'keywords', name: 'keywords', content: siteKeywords },
      // ogp関連
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: siteName,
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: basePath },
      { hid: 'og:title', property: 'og:title', content: siteName },
      {
        hid: 'og:description',
        property: 'og:description',
        content: siteDesc,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${ogpImages}home.jpg`,
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      // pwa iOS
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ],
    link: [
      {
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
        href: iconImages + 'favicon-16.png',
      },
      {
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
        href: iconImages + 'favicon-32.png',
      },
      {
        rel: 'icon',
        sizes: '48x48',
        type: 'image/png',
        href: iconImages + 'favicon-48.png',
      },
      {
        rel: 'icon',
        sizes: '72x72',
        type: 'image/png',
        href: iconImages + 'favicon-72.png',
      },
      // apple touch icon
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: iconImages + 'apple-touch-icon.png',
      },
    ],
  },

  manifest: {
    lang,
    name: siteName,
    short_name: shortName,
    description: siteDesc,
    background_color: '#ffffff',
    theme_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
  },
  icon: {
    iconFileName: manifestIcon,
  },

  loading: { color: '#E64A19', height: '5px' },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/utils.ts', '@/plugins/searchUtils.ts'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    [
      '@nuxtjs/google-analytics',
      {
        id: GOOGLE_ANALYTICS_ID,
      },
    ],
    'nuxt-i18n',
    // Simple usage
    // '@nuxtjs/amp',
  ],

  sitemap: {
    path: '/sitemap.xml',
    hostname: baseUrl,
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en_US', file: 'en.json' },
      { code: 'ja', iso: 'ja_JP', file: 'ja.json' },
    ],
    defaultLocale: 'en',
    vueI18nLoader: true,
    lazy: true,
    langDir: 'lang/',
    // strategy: 'no_prefix'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    standalone: true, // これを追加！
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    },
  },

  ...routerBase,

  generate: {
    dir: 'docs',

    async routes() {
      const pages = await axios
        .get('https://moeller.jinsha.tsukuba.ac.jp/data/curation.json')
        .then(function (res) {
          const selections = res.data.selections
          const pages = []
          for (let i = 0; i < selections.length; i++) {
            const selection = selections[i]
            const members = selection.members
            for (let j = 0; j < members.length; j++) {
              const member = members[j]
              const metadataObj = {}
              const metadata = member.metadata
              for (let k = 0; k < metadata.length; k++) {
                const obj = metadata[k]
                metadataObj[obj.label] = obj.value
              }

              // const memberId = member['@id']
              // const id = md5(memberId)
              const id = metadataObj.m_sort
              member.manifest = selection.within['@id']

              pages.push({
                route: `/item/${id}`,
                payload: member,
              })

              pages.push({
                route: `/ja/item/${id}`,
                payload: member,
              })
            }
          }
          return pages
        })
      return pages
    },
  },
}
