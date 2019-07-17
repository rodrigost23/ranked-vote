<template>
  <v-layout wrap>
    <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
      <v-expand-transition>
        <v-card>
          <v-card-title primary-title>
            <h2>Teste</h2>
          </v-card-title>
          <v-list>
            <v-subheader>CANDIDATES</v-subheader>
            <draggable
              v-model="items"
              v-bind="dragOptions"
              :group="{name: 'candidates'}"
              ghost-class="elevation-1"
              handle=".handle"
            >
              <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                <template v-for="item in items">
                  <v-list-item :key="item.id">
                    <v-list-item-avatar class="handle">
                      <v-icon>mdi-drag</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-btn icon @click="removeItem(item.id)">
                        <v-icon>mdi-minus-circle</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </template>
              </transition-group>
            </draggable>

            <v-list-item-group>
              <v-list-item @click="newItem">
                <v-list-item-icon>
                  <v-icon>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Add candidate</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
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
    itemsMax: 3,
    items: [
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" }
    ],
    drag: false
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
  methods: {
    newItem: function() {
      this.items.push({ id: ++this.itemsMax, text: "Item " + this.itemsMax });
    },
    removeItem: function (id) {
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
