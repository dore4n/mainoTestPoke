<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Pokédex</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Nome ou número"
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
        (search.value.startsWith('#') && `${pokemon.id}` === search.value.substring(1)) ||
        (!search.value.startsWith('#') && pokemon.name.toLowerCase().includes(search.value.toLowerCase()))
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
