<template>
  <v-app> <!-- Adicione esta tag -->
    <div>
      <v-app-bar app color="primary" dark>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
      </v-app-bar>

      <v-data-table
        :headers="headers"
        :items="filteredPokemons"
        @click:row="openPokemonCard"
      >
        <template v-slot:item.sprites="{ item }">
          <v-img :src="item.sprites.front_default"></v-img>
        </template>
      </v-data-table>

      <PokeCard :dialog="dialog" :pokemon="selectedPokemon" @update:dialog="dialog = $event"></PokeCard>
    </div>
  </v-app> <!-- Feche a tag aqui -->
</template>


<script>
import { computed, onMounted, ref } from 'vue';
import api from "@/service/api";
import PokeCard from './PokeCard.vue';

export default {
  name: "PokeList",
  components: {
    PokeCard
  },
  setup() {
    const pokemons = ref([]);
    const search = ref("");
    const dialog = ref(false);
    const selectedPokemon = ref(null);

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Sprite', value: 'sprites' },
    ];

    const fetchPokemons = async () => {
        const response = await api.get("/pokemon?limit=100");
        const pokemonDetails = await Promise.all(response.data.results.map(async pokemon => {
          const detailedResponse = await api.get(`/pokemon/${pokemon.name}`);
          return { ...detailedResponse.data, id: pokemon.url.split('/').filter(Boolean).pop() };
        }));
        pokemons.value = pokemonDetails;
    };

    onMounted(fetchPokemons);

    const filteredPokemons = computed(() => {
      return search.value ? pokemons.value.filter(pokemon => pokemon.name.toLowerCase().includes(search.value.toLowerCase())) : pokemons.value;
    });

    const openPokemonCard = (pokemon) => {
      dialog.value = true;
      selectedPokemon.value = pokemon;
    };

    return {
      pokemons,
      search,
      headers,
      filteredPokemons,
      openPokemonCard,
      selectedPokemon,
      dialog,
    };
  },
};
</script>
