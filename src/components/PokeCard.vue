<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      PokeDéx
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="pokemons"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.sprites="{ item }">
        <v-img v-if="item.sprites && item.sprites.front_default" :src="item.sprites.front_default" height="64"></v-img>
        <span v-else>No image</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { onMounted, ref } from 'vue';
import api from "@/service/api";

export default {
  name: "PokeCard",
  setup() {
    const pokemons = ref([]);
    const search = ref("");

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Sprite', value: 'sprites' },
    ];

    const fetchPokemons = async () => {
      try {
        const response = await api.get("/pokemon?limit=20");
        pokemons.value = response.data.results.map(pokemon => ({
          ...pokemon,
          id: pokemon.url.split('/').filter(Boolean).pop() // Extrai o ID da URL
        }));
      } catch (error) {
        console.error("Failed to fetch pokemons:", error);
      }
    };

    onMounted(fetchPokemons);

    return { pokemons, search, headers };
  }
}
</script>
