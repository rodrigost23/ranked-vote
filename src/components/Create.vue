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
              <transition-group type="transition" :name="!drag ? 'fliip-list' : null">
                <template v-for="item in items">
                  <div style="overflow:hidden" :key="item.id">
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
                        <v-btn icon @click="removeItem(item.id)">
                          <v-icon>mdi-minus-circle</v-icon>
                        </v-btn>
                      </v-list-item-icon>
                    </v-list-item>
                  </div>
                </template>
              </transition-group>
            </draggable>

            <v-expand-transition>
              <v-list-item-group v-show="newEnabled" mandatory>
                <v-list-item @click="newItem">
                  <v-list-item-avatar>
                    <v-icon>add</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Add candidate</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-expand-transition>
          </v-list>
        </v-card>
      </v-expand-transition>
    </v-flex>
  </v-layout>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },
  data: () => ({
    title: null,
    itemsMax: 1,
    items: [{ id: 1, text: null }],
    drag: false,
    newEnabled: false
  }),
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
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
      },
      deep: true
    }
  },
  methods: {
    newItem: function() {
      this.items.push({ id: ++this.itemsMax, text: null });
    },
    removeItem: function(id) {
      for (const i in this.items) {
        if (this.items.hasOwnProperty(i) && this.items[i].id == id) {
          this.items.splice(i, 1);
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
