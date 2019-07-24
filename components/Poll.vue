<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card :elevation="isLoading ? 0 : 4">
          <v-overlay :absolute="true" :value="isLoading" opacity="0.1">
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
            <h3 v-if="isView">
              {{ poll.title || 'No title' }}
            </h3>
          </v-card-title>
          <v-list flat>
            <v-subheader>CANDIDATES</v-subheader>
            <draggable
              :v-model="poll ? poll.candidates : null"
              v-bind="dragOptions"
              :group="{ name: 'candidates' }"
              ghost-class="elevation-1"
              handle=".handle"
            >
              <template v-for="item in poll ? poll.candidates : null">
                <v-expand-transition :key="item.id">
                  <div v-show="item.show && !item.hide" style="overflow:hidden">
                    <v-list-item>
                      <v-list-item-avatar class="handle">
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
                          <span v-if="isView">
                            {{ item.name || 'No name' }}
                          </span>
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon v-if="!isView">
                        <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              icon
                              large
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
const Hashids = require('hashids')

export default {
  components: { draggable },
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
  data() {
    return {
      Hashids: null,
      id: this.pollId,
      poll: this.pollData,
      password: this.pollPassword,
      itemsMax: 1,
      tempName: null,
      drag: false,
      newEnabled: false,
      saveEnabled: false,
      isLoading: false
    }
  },
  firestore() {
    return this.id
      ? { poll: this.$fireStore.collection('polls').doc(this.id) }
      : null
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false
      }
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
          'abcdefghijklmnopqrstuvwxyz0123456789&_+='
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
        if (
          this.$fireAuth.currentUser ||
          this.$fireAuth.currentUser.email !== this.password + '@ranked.vote'
        ) {
          await this.$fireAuth.signInWithEmailAndPassword(
            this.password + '@ranked.vote',
            this.password
          )
        }
        await this.$fireStore
          .collection('polls')
          .doc(this.id)
          .set(this.poll)
      }
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
</style>
