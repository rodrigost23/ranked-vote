<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card>
          <v-card-title primary-title :class="{'grey--text': !title}">
            <h3>
              <v-edit-dialog :return-value.sync="title" lazy>
                {{title||"Click to set the title"}}
                <template v-slot:input>
                  <v-text-field label="Type poll name" single-line></v-text-field>
                </template>
              </v-edit-dialog>
            </h3>
          </v-card-title>
          <v-list flat>
            <v-subheader>CANDIDATES</v-subheader>
            <draggable
              v-model="items"
              v-bind="dragOptions"
              :group="{name: 'candidates'}"
              ghost-class="elevation-1"
              handle=".handle"
            >
              <template v-for="item in itemsSync">
                <v-expand-transition :key="item.id">
                  <div style="overflow:hidden" v-show="item.show && !item.hide">
                    <v-list-item>
                      <v-list-item-avatar class="handle">
                        <v-icon>mdi-drag</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title :class="{'grey--text': !item.text}">
                          <v-edit-dialog :return-value.sync="item.text" lazy style="top:-100px">
                            {{item.text||"Click to set candidate name"}}
                            <template v-slot:input>
                              <v-text-field label="Candidate name" single-line></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-btn icon large v-on="on" @click="removeItem(item.id)">
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
                <v-list-item @click="newItem" :disabled="!newEnabled">
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
import draggable from "vuedraggable";
import { db } from "../db";

export default {
  components: { draggable },
  data() {
    return {
      poll: null,
      title: null,
      itemsMax: 1,
      items: [{ id: 1, text: null, show: true, hide: false }],
      drag: false,
      newEnabled: false,
      saveEnabled: false
    };
  },
  firestore() {
    return {
      poll: db.collection("polls").doc(this.$route.params.id)
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false
      };
    },
    itemsSync() {
      if (this.poll) {
        var result = [];
        for (const i in this.poll.candidates) {
          if (this.poll.candidates.hasOwnProperty(i)) {
            const el = this.poll.candidates[i];
            result.push({ id: i, text: el, show: true, hide: false });
          }
        }
        return result;
      }
      return this.items;
    }
  },
  watch: {
    items: {
      handler(val) {
        for (const i in val) {
          if (val.hasOwnProperty(i) && !val[i].text) {
            this.newEnabled = false;
            return;
          }
        }
        this.newEnabled = true;
        this.saveEnabled = true;
      },
      deep: true
    }
  },
  methods: {
    newItem() {
      if (!this.newEnabled) return;

      var id = ++this.itemsMax;
      var inserted = this.items.push({
        id: id,
        text: null,
        show: false,
        hide: false
      });
      setTimeout(function() {
        this.items[inserted - 1].show = true;
      }, 50);
    },
    removeItem(id) {
      for (const i in this.items) {
        if (this.items.hasOwnProperty(i) && this.items[i].id == id) {
          this.items[i].hide = true;
          this.saveEnabled = false;
          setTimeout(function() {
            this.items.splice(i, 1);
            this.saveEnabled = true;
          }, 200);
          break;
        }
      }
    }
  }
};
</script>

<style>
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
