<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card :elevation="isLoading ? 0 : 4">
          <v-overlay :absolute="true" :value="isLoading" opacity="0.1">
            <v-progress-circular indeterminate color="primary" />
          </v-overlay>
          <v-card-title primary-title :class="{ 'grey--text': !poll.title }">
            <h3>
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
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
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

            <v-expand-transition>
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
const Hashids = require('hashids')

export default {
  components: { draggable },
  data() {
    return {
      Hashids: null,
      id: this.$route.params.id,
      poll: {
        title: null,
        candidates: [{ id: 1, name: null, show: true, hide: false }]
      },
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
    }
  },
  watch: {
    poll: {
      handler(val) {
        this.pollChanged(val)
      },
      deep: true
    },
    saveEnabled() {
      this.pollChanged(this.poll)
    }
  },
  created() {
    if (this.id) {
      this.isLoading = true
    } else {
      this.Hashids = new Hashids.Default()
      this.id = this.Hashids.encode(Date.now())
      // this.$fireStore.collection('polls').doc(this.id).set(this.poll);
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
          this.$fireStore
            .collection('polls')
            .doc(this.id)
            .set(val)
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
    save() {
      this.$fireStore
        .collection('polls')
        .doc(this.id)
        .set(this.poll)
      this.$router.replace('/' + this.id)
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
