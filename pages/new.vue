<template>
  <poll type="create" />
</template>

<script>
import poll from '~/components/Poll.vue'

export default {
  components: { poll },
  head() {
    return {
      title: 'Create a new poll',
      meta: [
        { hid: 'name', itemprop: 'name', content: 'Create a new poll' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'app' },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Create a new poll'
        },
        { hid: 'og:title', name: 'og:title', content: 'Create a new poll' }
      ]
    }
  }
}
</script>

<style scoped></style>
