<template>
  <div class="pokedex-container">
    <v-text-field v-model="search" label="Search"></v-text-field>
    <v-data-table-virtual
      :headers="headers"
      :items="filteredPokemons"
      :item-key="pokemon => pokemon.id"
      @click:row="openPokemonCard"
    >
      <template slot="item.name">{{ pokemon.name }}</template>
      <template slot="item.id">{{ pokemon.id }}</template>
      <template slot="item.image">
        <v-img :src="pokemon.sprites.front_default" width="30"></v-img>
      </template>
    </v-data-table-virtual>
  </div>
  <pokemon-dialog :dialog.sync="dialog" :pokemon="selectedPokemon" />
</template>

<script>
import { computed, onMounted, ref } from 'vue';
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
        const response = await api.get("/pokemon?limit=1000");
        pokemons.value = response.data.results.map(pokemon => ({
          ...pokemon,
          id: pokemon.url.split('/').filter(Boolean).pop()
        }));
      } catch (error) {
        console.error("Failed to fetch pokemons:", error);
      }
    };

    onMounted(fetchPokemons);

    const filteredPokemons = computed(() => {
      if (!search.value) {
        return pokemons.value;
      }
      return pokemons.value.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    return {
      pokemons,
      search,
      headers,
      fetchPokemons,
      filteredPokemons,
    };
  },
  data() {
    return {
      dialog: false,
      selectedPokemon: null,
    };
  },
  methods: {
    openPokemonCard(pokemon) {
      this.dialog = true;
      this.selectedPokemon = pokemon;
    },
  },
};
</script>
