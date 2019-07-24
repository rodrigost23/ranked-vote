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
  async asyncData({ app, params, redirect }) {
    const pollId = params.id
    try {
      const pollRef = app.$fireStore.collection('polls').doc(pollId)

      await app.$fireAuth.signInWithEmailAndPassword(
        params.password + '@ranked.vote',
        params.password
      )

      await pollRef.update({})

      return {
        pollId,
        pollData: (await pollRef.get()).data(),
        pollPassword: params.password
      }
    } catch (e) {
      redirect(403, '/' + params.id)
    }
  }
}
</script>

<style scoped></style>
