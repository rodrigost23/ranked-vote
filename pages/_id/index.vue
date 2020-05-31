<template>
  <poll type="view" :poll-id="pollId" :poll-data="pollData" />
</template>

<script>
import poll from '~/components/Poll.vue'

export default {
  components: { poll },
  async asyncData({ app, params, error }) {
    const pollId = params.id
    try {
      const pollData = await app.$fireStore
        .collection('polls')
        .doc(pollId)
        .get()
      return { pollId, pollData: pollData.data() }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head() {
    return {
      title: this.pollData.title,
      meta: [
        { hid: 'name', itemprop: 'name', content: this.pollData.title },
        { hid: 'twitter:card', name: 'twitter:card', content: 'app' },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.pollData.title
        },
        { hid: 'og:title', name: 'og:title', content: this.pollData.title }
      ]
    }
  }
}
</script>

<style scoped></style>
