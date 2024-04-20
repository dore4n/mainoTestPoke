<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-img :src="pokemon.sprites.front_default" height="200px"></v-img>
      <v-card-title>{{ pokemon.name }}</v-card-title>
      <v-card-subtitle>ID: {{ pokemon.id }}</v-card-subtitle>
      <v-card-text>
        <div v-for="move in pokemon.moves" :key="move.move.name">
          <v-chip>{{ move.move.name }}</v-chip>
        </div>
        <div v-for="game in pokemon.game_indices" :key="game.game_index">
          <v-chip>{{ game.version.name }}</v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    pokemon: {
      type: Object,
      required: true,
    },
  },
};
</script>