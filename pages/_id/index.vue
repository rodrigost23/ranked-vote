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
  }
}
</script>

<style scoped></style>
