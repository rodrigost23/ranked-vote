<template>
  <v-layout v-resize="onResize" wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card :tile="$vuetify.breakpoint.xs" :loading="isLoading">
          <v-overlay :absolute="true" :value="false" opacity="0.1">
            <v-progress-circular indeterminate color="primary" />
          </v-overlay>
          <v-card-title primary-title :class="{ 'grey--text': !poll.title }">
            <h3>{{ poll.title || 'Untitled' }}</h3>
          </v-card-title>
          <v-expansion-panels accordion multiple :value="[1]">
            <v-expansion-panel>
              <v-expansion-panel-header>List of votes</v-expansion-panel-header>
              <v-expansion-panel-content elevation-0>
                <v-responsive
                  :max-height="windowSize.y / 3"
                  style="overflow-y: auto;"
                >
                  <v-list flat>
                    <template v-for="(vote, i) in votes">
                      <span :key="vote.id">
                        <v-divider v-if="i > 0" />
                        <v-list-item>
                          <v-list-item-content>
                            <v-container fluid grid-list-sm>
                              <v-layout wrap>
                                <v-flex
                                  v-for="(item, j) in vote.vote.map((id) =>
                                    candidateFromId(id)
                                  )"
                                  :key="item.id"
                                >
                                  <v-chip
                                    class="mx-1"
                                    :color="color(item.id)"
                                    outlined
                                  >
                                    <v-avatar
                                      left
                                      :color="color(item.id)"
                                      class="white--text"
                                    >
                                      {{ j + 1 }}
                                    </v-avatar>
                                    {{ item.name }}
                                  </v-chip>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-list-item-content>
                        </v-list-item>
                      </span>
                    </template>
                  </v-list>
                </v-responsive>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Winner</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list flat subheader>
                  <v-layout wrap>
                    <v-flex :sm6="isTied" xs12>
                      <v-subheader>Scores</v-subheader>
                      <v-list-item
                        v-for="(candidate, i) in sortedCandidates"
                        :key="candidate.id"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            :class="{ 'grey--text': !candidate.name }"
                          >
                            <v-chip
                              :color="color(candidate.id)"
                              :outlined="isTied || i > 0"
                              :class="{ 'white--text': !isTied && i === 0 }"
                            >
                              <v-avatar
                                left
                                :color="
                                  color(candidate.id) +
                                    (!isTied && i === 0 ? ' darken-3' : '')
                                "
                                class="white--text"
                              >
                                {{ i + 1 }}
                              </v-avatar>
                              {{ candidate.name || 'Nameless candidate' }}
                              <v-avatar
                                right
                                :color="
                                  color(candidate.id) +
                                    (!isTied && i === 0
                                      ? ' darken-1'
                                      : ' lighten-5')
                                "
                              >
                                {{ scores[candidate.id] }}
                              </v-avatar>
                            </v-chip>
                            <v-avatar v-if="!isTied && i === 0" right>
                              <v-icon color="amber darken-1">mdi-trophy</v-icon>
                            </v-avatar>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-flex>

                    <v-flex v-if="isTied" sm6 xs12>
                      <v-subheader>Tiebreaker</v-subheader>
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon color="amber darken-1">mdi-trophy</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-chip
                              v-for="candidate in winner"
                              :key="candidate.id"
                              :color="color(candidate.id)"
                              class="white--text"
                            >
                              {{ candidate.name || 'Nameless candidate' }}
                            </v-chip>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider inset />
                      <v-list-item>
                        <v-list-item-avatar></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-chip
                              v-for="candidate in tiedCandidates"
                              :key="candidate.id"
                              :color="color(candidate.id)"
                              outlined
                            >
                              {{ candidate.name || 'Nameless candidate' }}
                              <v-avatar
                                right
                                :color="color(candidate.id) + ' lighten-5'"
                              >
                                {{ tiebreakerScores[candidate.id] }}
                              </v-avatar>
                            </v-chip>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-flex>
                  </v-layout>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-expand-transition>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  head() {
    return {
      title: this.poll.title
    }
  },
  data() {
    return {
      isLoading: false,
      colors: [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'blue',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'brown'
      ],
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    scores() {
      const scores = {}
      this.votes.forEach((v) => {
        for (let i = 0; i < v.vote.length; i++) {
          const id = v.vote[i]
          const score = v.vote.length - i
          scores[id] = scores[id] ? scores[id] + score : score
        }
      })
      return scores
    },
    sortedCandidates() {
      return this.sortCandidates(this.scores)
    },
    isTied() {
      return (
        this.candidateScore(this.sortedCandidates[0].id) ===
        this.candidateScore(this.sortedCandidates[1].id)
      )
    },
    tiedCandidates() {
      const scores = this.scores
      return this.isTied
        ? Object.keys(scores)
            .filter((id) => scores[id] === scores[this.sortedCandidates[0].id])
            .map((id) => this.candidateFromId(id))
        : []
    },
    tiebreakerScores() {
      const self = this
      const scores = {}
      // Check combinations of two
      this.k_combinations(this.tiedCandidates, 2).forEach((comb) => {
        self.votes
          .map((v) => v.vote)
          .forEach((vote) => {
            // Check each user vote
            for (let i = 0; i < vote.length; i++) {
              const id = vote[i]
              if (id === comb[0].id) {
                // If first won, add to counter and break
                scores[comb[0].id] = scores[comb[0].id]
                  ? scores[comb[0].id] + 1
                  : 1
                break
              } else if (id === comb[1].id) {
                // If second won, add to counter and break
                scores[comb[1].id] = scores[comb[1].id]
                  ? scores[comb[1].id] + 1
                  : 1
                break
              }
            }
          })
      })
      return scores
    },
    winner() {
      const scores = this.tiebreakerScores

      return Object.keys(scores)
        .filter(
          (id) => scores[id] === scores[this.sortCandidates(scores)[0].id]
        )
        .map((id) => this.candidateFromId(id))
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
    this.$fireStore
      .collection('polls/' + this.id + '/votes')
      .onSnapshot((data) => {
        self.votes = data.docs.map((v) => v.data())
      })
  },

  mounted() {
    this.onResize()
  },

  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    color(i) {
      return this.colors[i % this.colors.length]
    },
    candidateFromId(id) {
      return this.poll.candidates.filter((c) => c.id === parseInt(id))[0]
    },
    candidateScore(id) {
      return this.scores[id]
    },
    sortCandidates(scores) {
      const self = this
      return Object.keys(scores)
        .sort((a, b) => scores[b] - scores[a])
        .map((id) => self.candidateFromId(id))
    },
    k_combinations(set, k) {
      /**
       * Source: https://gist.github.com/axelpale/3118596
       *
       * Copyright 2012 Akseli Palén.
       * Created 2012-07-15.
       * Licensed under the MIT license.
       *
       * Permission is hereby granted, free of charge, to any person obtaining
       * a copy of this software and associated documentation files
       * (the "Software"), to deal in the Software without restriction,
       * including without limitation the rights to use, copy, modify, merge,
       * publish, distribute, sublicense, and/or sell copies of the Software,
       * and to permit persons to whom the Software is furnished to do so,
       * subject to the following conditions:
       *
       * The above copyright notice and this permission notice shall be
       * included in all copies or substantial portions of the Software.
       *
       * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
       * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
       * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
       * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
       * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
       * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
       * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
       * SOFTWARE.
       */
      let i, j, combs, head, tailcombs

      // There is no way to take e.g. sets of 5 elements from
      // a set of 4.
      if (k > set.length || k <= 0) {
        return []
      }

      // K-sized set has only one K-sized subset.
      if (k === set.length) {
        return [set]
      }

      // There is N 1-sized subsets in a N-sized set.
      if (k === 1) {
        combs = []
        for (i = 0; i < set.length; i++) {
          combs.push([set[i]])
        }
        return combs
      }

      // Assert {1 < k < set.length}
      combs = []
      for (i = 0; i < set.length - k + 1; i++) {
        // head is a list that includes only our current element.
        head = set.slice(i, i + 1)
        // We take smaller combinations from the subsequent elements
        tailcombs = this.k_combinations(set.slice(i + 1), k - 1)
        // For each (k-1)-combination we join it with the current
        // and store it to the set of k-combinations.
        for (j = 0; j < tailcombs.length; j++) {
          combs.push(head.concat(tailcombs[j]))
        }
      }
      return combs
    }
  }
}
</script>
<style scoped></style>
