<template>
  <v-layout wrap>
    <v-flex sm12 md6 offset-md3>
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
                  <v-list-item-icon class="handle">
                    <v-icon>mdi-drag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </transition-group>
          </draggable>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },
  data: () => ({
    item: -1,
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
