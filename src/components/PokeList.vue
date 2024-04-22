<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title><img src="../assets/logo.png" style="max-width: 30px;" alt=""></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Name, id, type or species"
        class="mx-4"
        :style="{ width: '300px' }"
        solo
        hide-details
        clearable
      ></v-text-field>
    </v-app-bar>
    <v-container fluid class="pa-0 pokemon-container">
      <v-row>
        <v-col
          v-for="(pokemon, index) in filteredPokemons"
          :key="pokemon.id"
          cols="12"
          sm="4"
          md="3"
          lg="2"
          @click="selectPokemon(pokemon)"
        >
          <v-card class="ma-2">
            <v-img
              :src="pokemon.sprites.front_default"
              height="200px"
              aspect-ratio="1"
            ></v-img>
            <v-card-title>{{ pokemon.name }}</v-card-title>
            <v-card-subtitle>{{ pokemon.type }}</v-card-subtitle>
            <v-card-text>#{{ pokemon.id }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-infinite-scroll @load="load" height="100%" side="end" />
    </v-container>

    <PokeCard :dialog="dialog" :pokemon="selectedPokemon" @update:dialog="dialog = $event"></PokeCard>
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from "@/service/api";
import PokeCard from './PokeCard.vue';

export default {
  name: "PokeList",
  components: {
    PokeCard
  },
  setup({ emit }) {
    const pokemons = ref([]);
    const search = ref("");
    const dialog = ref(false);
    const selectedPokemon = ref(null);
    const limit = 50;
    let offset = 0;

    const fetchPokemons = async () => {
      try {
        const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
        const data = response.data.results.map(async p => {
          const details = await api.get(`/pokemon/${p.name}`);
          return {
            id: details.data.id,
            name: firstLetterUpperCase(details.data.name),
            type: details.data.types.map(t => t.type.name).join(', '),
            species: details.data.species.name,
            sprites: details.data.sprites,
            moves: details.data.moves.map(m => m.move.name).join(', '),
            games: details.data.game_indices.map(g => g.version.name).join(', ')
          };
        });
        const results = await Promise.all(data);
        pokemons.value.push(...results);
        offset += limit;
      } catch (error) {
        console.error('Failed to fetch pokemons:', error);
      }
    };

    watch(search, () => {
      pokemons.value = [];
      offset = 0;
      fetchPokemons();
    }, { deep: true });

    onMounted(fetchPokemons);

    const filteredPokemons = computed(() => {
      const uniqueIds = new Set();
      return pokemons.value.filter(pokemon => {
        const includesSearch = (
          `${pokemon.id}`.includes(search.value) ||
          pokemon.name.toLowerCase().includes(search.value.toLowerCase()) ||
          pokemon.type.toLowerCase().includes(search.value.toLowerCase()) ||
          pokemon.species.toLowerCase().includes(search.value.toLowerCase())
        );
        if (includesSearch && !uniqueIds.has(pokemon.id)) {
          uniqueIds.add(pokemon.id);
          return true;
        }
        return false;
      });
    });

    function selectPokemon(pokemon) {
      selectedPokemon.value = pokemon;
      dialog.value = true;
    }

    function load({ side, done }) {
      if (side === 'end') {
        fetchPokemons().then(() => done());
      }
    }    

    function firstLetterUpperCase(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
      search,
      filteredPokemons,
      dialog,
      selectedPokemon,
      selectPokemon,
      load
    };
  },
};
</script>

<style>
.pokemon-container {
  margin-top: 48px;
}
.pokemon-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
  cursor: pointer;
}
.pokemon-details {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.pokemon-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
}
.pokemon-id, .pokemon-id-header,
.pokemon-name, .pokemon-name-header,
.pokemon-type, .pokemon-type-header,
.pokemon-species, .pokemon-species-header,
.pokemon-image-header {
  flex: 1;
}
</style>
