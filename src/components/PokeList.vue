<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
    </v-app-bar>

    <div style="height: calc(100vh - 64px); overflow-y: auto;">
      <v-infinite-scroll
        @load="load"
        height="100%"
        side="end"
      >
        <template v-for="(pokemon, index) in filteredPokemons" :key="pokemon.id">
          <div class="pokemon-item" @click="selectPokemon(pokemon)">
            <v-img :src="pokemon.sprites.front_default" height="50px" class="pokemon-image"></v-img>
            <div class="pokemon-details">
              <div class="pokemon-name"> #{{ pokemon.id }} - {{ pokemon.name }}</div>
              <div class="pokemon-type">Type: {{ pokemon.type }}</div>
              <div class="pokemon-species">Species: {{ pokemon.species }}</div>
            </div>
          </div>
        </template>
      </v-infinite-scroll>
    </div>
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
  setup() {
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
        name: details.data.name,
        type: details.data.types.map(t => t.type.name).join(', '),
        species: details.data.species.name,
        sprites: details.data.sprites
      };
    });
    const results = await Promise.all(data);
    pokemons.value.push(...results);
    offset += limit;
  } catch (error) {
    console.error('Failed to fetch pokemons:', error);
  }
};
    onMounted(fetchPokemons);

    const filteredPokemons = computed(() => {
      return pokemons.value.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.value.toLowerCase()) ||
        `${pokemon.id}` === search.value
      );
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
.pokemon-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
  cursor: pointer;
}
.pokemon-item.is-alternate {
  background-color: #f0f0f0;
}
.pokemon-image {
  margin-right: 15px;
}
.pokemon-info {
  display: flex;
  flex-direction: column;
}
</style>