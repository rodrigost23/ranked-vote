<template>
  <poll type="create" />
</template>

<script>
import poll from '~/components/Poll.vue'

export default {
  components: { poll },
  async created() {
    console.log(
      await this.$fireStore
        .collection('polls')
        .doc('LkeD')
        .get()
    )
  }
}
</script>

<style scoped></style>
