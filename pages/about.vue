<template>
  <div>
    <v-container class="my-5">
      <h2>{{ $t('lod_vocabulary') }}</h2>

      <ul>
        <li v-for="(value, key) in pathes" :key="key">
          <nuxt-link
            :to="
              localePath({
                name: 'property-id',
                params: { id: key },
              })
            "
          >
            {{ value }}
          </nuxt-link>
        </li>
      </ul>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pathes: {
        Item: this.$t('Item'),
        HieroglyphNo: this.$t('Hieroglyph No'),
        HieraticNo: this.$t('Hieratic No'),
      },
    }
  },
  head() {
    const title = 'About'
    return {
      title,
    }
  },
}
</script>
