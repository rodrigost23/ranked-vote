<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card :tile="$vuetify.breakpoint.xs" :loading="isLoading">
          <v-overlay :absolute="true" :value="false" opacity="0.1">
            <v-progress-circular indeterminate color="primary" />
          </v-overlay>
          <v-card-title primary-title :class="{ 'grey--text': !poll.title }">
            <h3 v-if="!isView">
              <v-edit-dialog
                :return-value.sync="poll.title"
                lazy
                @open="tempName = poll.title"
                @cancel="poll.title = tempName || poll.title"
                @save="save()"
              >
                {{ poll.title || 'Click to set the title' }}
                <template v-slot:input>
                  <v-text-field
                    v-model="poll.title"
                    label="Type poll name"
                    single-line
                  />
                </template>
              </v-edit-dialog>
            </h3>
            <h3 v-else>{{ poll.title || 'No title' }}</h3>
            <v-spacer />
            <v-btn
              v-if="isView"
              outlined
              rounded
              color="primary"
              :loading="isSaving"
              :disabled="isSaving || voteSaved"
              @click="saveVote()"
            >
              {{ voteSaved ? 'Saved' : 'Save' }}
            </v-btn>
            <v-fade-transition v-else>
              <span v-show="isSaving" class="caption grey--text">
                Saving...
                <v-progress-circular indeterminate color="grey" size="24" />
              </span>
            </v-fade-transition>
          </v-card-title>
          <v-list flat>
            <v-layout>
              <v-flex
                v-if="isView"
                :xs6="candidates.length > 0"
                :xs12="candidates.length == 0"
              >
                <v-subheader>YOUR VOTE</v-subheader>
                <draggable
                  :list="vote"
                  group="candidates"
                  :animation="200"
                  ghost-class="elevation-1"
                  handle=".handle"
                  :disabled="voteSaved"
                  @start="drag = true"
                  @end="drag = false"
                >
                  <template v-for="(item, i) in vote">
                    <v-expand-transition :key="item.id">
                      <div
                        v-show="item.show && !item.hide"
                        style="overflow:hidden"
                        class="handle"
                      >
                        <v-list-item>
                          <v-list-item-icon>
                            <v-avatar
                              size="36"
                              color="primary"
                              class="white--text"
                            >
                              <transition name="short-fade" :appear="true">
                                <span v-show="!drag">{{ i + 1 }}</span>
                              </transition>
                            </v-avatar>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              :class="{ 'grey--text': !item.name }"
                            >
                              <v-edit-dialog
                                v-if="!isView"
                                :return-value.sync="item.name"
                                lazy
                                style="top:-100px"
                                @open="tempName = item.name"
                                @cancel="item.name = tempName || item.name"
                                @save="save()"
                              >
                                {{ item.name || 'Click to set candidate name' }}
                                <template v-slot:input>
                                  <v-text-field
                                    v-model="item.name"
                                    label="Candidate name"
                                    single-line
                                  />
                                </template>
                              </v-edit-dialog>
                              <!-- prettier-ignore -->
                              <span v-if="isView">{{ item.name || 'No name' }}</span>
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon>
                            <up-down
                              :up-disabled="i == 0"
                              :down-disabled="i == vote.length - 1"
                              @up="voteMove(i, i - 1)"
                              @down="voteMove(i, i + 1)"
                            />
                          </v-list-item-icon>
                        </v-list-item>
                      </div>
                    </v-expand-transition>
                  </template>
                </draggable>
              </v-flex>
              <v-flex
                v-show="!isView || candidates.length > 0"
                :xs6="isView"
                :xs12="!isView"
              >
                <v-subheader>CANDIDATES</v-subheader>
                <draggable
                  :list="candidates"
                  group="candidates"
                  :animation="200"
                  ghost-class="elevation-1"
                  handle=".handle"
                  :disabled="isView"
                  @change="!isView ? save() : undefined"
                >
                  <template v-for="item in candidates">
                    <v-expand-transition :key="item.id">
                      <div
                        v-show="item.show && !item.hide"
                        style="overflow:hidden"
                      >
                        <v-list-item>
                          <v-list-item-icon v-if="isView">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  icon
                                  small
                                  v-on="on"
                                  @click="addToVote(item)"
                                >
                                  <v-icon>mdi-arrow-left-bold</v-icon>
                                </v-btn>
                              </template>
                              <span>Add to votes list</span>
                            </v-tooltip>
                          </v-list-item-icon>
                          <v-list-item-avatar v-else class="handle">
                            <!-- prettier-ignore -->
                            <v-icon>mdi-drag</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              :class="{ 'grey--text': !item.name }"
                            >
                              <v-edit-dialog
                                v-if="!isView"
                                :return-value.sync="item.name"
                                lazy
                                style="top:-100px"
                                @open="tempName = item.name"
                                @cancel="item.name = tempName || item.name"
                                @save="save()"
                              >
                                {{ item.name || 'Click to set candidate name' }}
                                <template v-slot:input>
                                  <v-text-field
                                    v-model="item.name"
                                    label="Candidate name"
                                    single-line
                                  />
                                </template>
                              </v-edit-dialog>
                              <!-- prettier-ignore -->
                              <span v-if="isView">{{ item.name || 'No name' }}</span>
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon v-if="!isView">
                            <v-tooltip left>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  icon
                                  small
                                  v-on="on"
                                  @click="removeItem(item.id)"
                                >
                                  <v-icon>mdi-minus-circle</v-icon>
                                </v-btn>
                              </template>
                              <span>Remove candidate</span>
                            </v-tooltip>
                          </v-list-item-icon>
                        </v-list-item>
                      </div>
                    </v-expand-transition>
                  </template>
                </draggable>
              </v-flex>
            </v-layout>

            <v-expand-transition v-if="!isView">
              <div style="overflow:hidden">
                <v-list-item :disabled="!newEnabled" @click="newItem">
                  <v-list-item-avatar>
                    <v-icon>add</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Add candidate</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-expand-transition>
          </v-list>
        </v-card>
      </v-expand-transition>
    </v-flex>
  </v-layout>
</template>

<script>
import draggable from 'vuedraggable'
import { Promise } from 'q'
import upDown from './UpDown.vue'
const Hashids = require('hashids')

export default {
  components: { draggable, upDown },
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
      Hashids: null,
      id: this.pollId,
      poll: this.pollData,
      vote: [],
      password: this.pollPassword,
      itemsMax: 1,
      tempName: null,
      drag: false,
      newEnabled: false,
      saveEnabled: false,
      isLoading: false,
      isSaving: false,
      voteSaved: false
    }
  },
  computed: {
    candidates: {
      get() {
        return this.poll
          ? this.poll.candidates.filter(
              (candidate) =>
                !this.vote.find((value) => value.id === candidate.id)
            )
          : []
      },
      set(val) {
        if (!this.isView) {
          this.poll.candidates = val
        }
      }
    },
    computedVote() {
      return this.vote.map((candidate) => candidate.id)
    },
    isView() {
      return this.type === 'view'
    },
    isCreate() {
      return this.type === 'create'
    },
    isEdit() {
      return this.type === 'edit'
    }
  },
  watch: {
    poll: {
      handler(val) {
        this.pollChanged(val)
      },
      deep: true
    },
    saveEnabled(val) {
      if (val) {
        this.pollChanged(this.poll)
      }
    }
  },
  created() {
    if (this.id && !this.poll) {
      this.isLoading = true
    }

    if (this.password) {
      this.$fireAuth.signInWithEmailAndPassword(
        this.password + '@ranked.vote',
        this.password
      )
    }

    if (this.isCreate) {
      this.poll.createdAt = this.$fireStoreObj.Timestamp.now()
    } else {
      const me = this
      this.$fireStore
        .collection('polls')
        .doc(this.id)
        .onSnapshot((doc) => {
          me.poll = doc.data()
        })
    }
  },
  methods: {
    newItem() {
      if (!this.newEnabled) return

      const id = ++this.itemsMax
      const inserted = this.poll.candidates.push({
        id: id,
        name: null,
        show: false,
        hide: false
      })
      const me = this
      setTimeout(() => {
        me.poll.candidates[inserted - 1].show = true
      }, 50)
    },
    removeItem(id) {
      for (const i in this.poll.candidates) {
        if (
          Object.prototype.hasOwnProperty.call(this.poll.candidates, i) &&
          this.poll.candidates[i].id === id
        ) {
          this.poll.candidates[i].hide = true
          const me = this
          setTimeout(() => {
            me.poll.candidates.splice(i, 1)
            me.save()
          }, 200)
          break
        }
      }
    },
    addToVote(item) {
      this.vote.push(item)
    },
    pollChanged(val) {
      if (val) {
        this.itemsMax = val.candidates.reduce(
          (max, c) => (c.id > max ? c.id : max),
          val.candidates[0].id
        )
        if (this.saveEnabled) {
          this.save()
        }
        for (const i in val.candidates) {
          if (Object.prototype.hasOwnProperty.call(val.candidates, i)) {
            const el = val.candidates[i]

            if (!el.name) {
              this.newEnabled = false
            } else {
              this.newEnabled = true
            }
          }
        }
        this.isLoading = false
      }
    },
    async save() {
      if (this.isCreate) {
        this.isLoading = true

        const statsRef = this.$fireStore.collection('polls').doc('--stats--')
        const increment = this.$fireStoreObj.FieldValue.increment(1)
        await statsRef.update({ pollCount: increment })
        const nextId = (await statsRef.get()).data().pollCount

        // eslint-disable-next-line
        this.pollHash = new Hashids.default(
          'RankedVote',
          4,
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        )

        this.id = this.pollHash.encode(nextId)

        // eslint-disable-next-line
        this.password = new Hashids.default(
          'RankedVote' +
            this.id +
            'password' +
            Math.floor(Math.random() * 100 + 1),
          14,
          'abcdefghijklmnopqrstuvwxyz0123456789&'
        ).encode(Date.now())

        Promise.all([
          this.$fireStore
            .collection('passwords')
            .doc(this.id)
            .set({ password: this.password }),
          this.$fireAuth.createUserWithEmailAndPassword(
            this.password + '@ranked.vote',
            this.password
          ),
          this.$fireStore
            .collection('polls')
            .doc(this.id)
            .set(this.poll)
        ]).then(() => {
          this.$router.replace('/' + this.id + '/edit/' + this.password)
        })
      } else {
        this.isSaving = true
        if (
          this.$fireAuth.currentUser ||
          this.$fireAuth.currentUser.email !== this.password + '@ranked.vote'
        ) {
          await this.$fireAuth.signInWithEmailAndPassword(
            this.password + '@ranked.vote',
            this.password
          )
        }
        // TODO: Log back in to anonymous user if there is one
        await this.$fireStore
          .collection('polls')
          .doc(this.id)
          .update(this.poll)
        this.isSaving = false
      }
    },
    async saveVote() {
      this.isSaving = true
      // TODO: Use anonymous login to vote
      await this.$fireStore
        .collection('polls/' + this.id + '/votes')
        .add({ vote: this.computedVote })
      this.voteSaved = true
      this.isSaving = false
    },
    voteMove(oldIndex, newIndex) {
      if (newIndex >= this.vote.length) {
        let k = newIndex - this.vote.length + 1
        while (k--) {
          this.vote.push(undefined)
        }
      }
      this.vote.splice(newIndex, 0, this.vote.splice(oldIndex, 1)[0])
    },
    focusEditDialog() {
      if (Object.prototype.hasOwnProperty.call(this.$refs, 'editDialogText')) {
        this.$refs.editDialogText[0].focus()
      }
    }
  }
}
</script>

<style scoped>
.sortable-drag {
  display: none;
}

.handle {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

/* Apply a "closed-hand" cursor during drag operation. */
.handle:active {
  cursor: grabbing !important;
  cursor: -moz-grabbing !important;
  cursor: -webkit-grabbing !important;
}
.short-fade-leave-active,
.short-fade-enter-active {
  transition: all 100ms ease;
}
.short-fade-enter,
.short-fade-leave-to {
  opacity: 0;
}
</style>
