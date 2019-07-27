<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card :tile="$vuetify.breakpoint.xs" :loading="isLoading">
          <v-overlay :absolute="true" :value="false" opacity="0.1">
            <v-progress-circular indeterminate color="primary" />
          </v-overlay>
          <v-card-title primary-title :class="{ 'grey--text': !poll.title }">
            <h3>{{ poll.title || 'Untitled' }}</h3>
          </v-card-title>
          <v-list flat>
            <v-layout>
              <v-flex xs6>
                <v-subheader>VOTES</v-subheader>
                <v-list-item v-for="vote in votes" :key="vote.id">
                  <v-list-item-content>
                    <v-list-item-title :class="{ 'grey--text': !vote.name }">
                      {{ vote.vote || 'Nameless candidate' }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-flex>
              <v-flex xs6>
                <v-subheader>CANDIDATES</v-subheader>
                <v-list-item v-for="item in poll.candidates" :key="item.id">
                  <v-list-item-content>
                    <v-list-item-title :class="{ 'grey--text': !item.name }">
                      {{ item.name || 'Nameless candidate' }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-flex>
            </v-layout>
          </v-list>
        </v-card>
      </v-expand-transition>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    type: {
      default: 'view',
      validator(value) {
        return ['view', 'create', 'edit'].indexOf(value) !== -1
      }
    },
    pollId: { type: String, default: null },
    pollData: {
      type: Object,
      default: () => ({
        title: null,
        candidates: [{ id: 1, name: null, show: true, hide: false }]
      })
    },
    pollPassword: {
      type: String,
      default: null
    }
  },
  head() {
    return {
      title: this.poll.title
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  async asyncData({ app, params, error }) {
    const pollId = params.id
    try {
      const pollData = (await app.$fireStore
        .collection('polls')
        .doc(pollId)
        .get()).data()

      const votesData = (await app.$fireStore
        .collection('polls/' + pollId + '/votes')
        .get()).docs.map((v) => v.data())

      return {
        id: pollId,
        poll: pollData,
        votes: votesData
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  created() {
    const self = this
    this.$fireStore
      .collection('polls')
      .doc(this.id)
      .onSnapshot((doc) => {
        self.poll = doc.data()
      })
  }
}
</script>
<style scoped></style>
