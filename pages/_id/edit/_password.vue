<template>
  <poll
    type="edit"
    :poll-id="pollId"
    :poll-data="pollData"
    :poll-password="pollPassword"
  />
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
      return {
        pollId,
        pollData: pollData.data(),
        pollPassword: params.password
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  }
}
</script>

<style scoped></style>
