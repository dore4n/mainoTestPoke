<template>
  <v-dialog v-model="localDialog" width="500">
    <v-card v-if="pokemon">
      <v-img :src="pokemon.sprites.front_default" height="50px"></v-img>
      <v-card-title>{{ pokemon.name }}</v-card-title>
      <v-card-subtitle>ID: {{ pokemon.id }}</v-card-subtitle>
      <v-card-text>
        <div v-for="sprite in Object.values(pokemon.sprites).filter(s => typeof s === 'string')" :key="sprite">
          <v-img :src="sprite" height="50px"></v-img>
        </div>
        <div v-for="move in pokemon.moves" :key="move.move.name">
          <v-chip>{{ move.move.name }}</v-chip>
        </div>
        <div v-for="game in pokemon.game_indices" :key="game.game_index">
          <v-chip>{{ game.version.name }}</v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red darken-1" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    pokemon: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
    localDialog: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit('update:dialog', value);
      }
    }
  },
  methods: {
    close() {
      this.localDialog = false;
    }
  }
};
</script>
