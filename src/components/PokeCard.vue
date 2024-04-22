<template>
  <v-dialog v-model="localDialog" width="500">
    <v-card v-if="pokemon && !isLoading">
      <v-img :src="pokemon.sprites.front_default" height="15vw"></v-img>
      <div style="font-size: 2vh; font-weight: bold; padding: 0px 24px;">Name:</div>
      <v-card-title style="font-size: 2vh; padding: 0px 0px 10px 24px;">{{ pokemon.name }}</v-card-title>
      <div style="font-size: 2vh; font-weight: bold; padding: 0px 24px;">ID:</div>
      <v-card-subtitle style="font-size: 2vh; padding: 0px 24px;">{{ pokemon.id }}</v-card-subtitle>
      <v-card-text>
        <div style="font-size: 2vh; font-weight: bold;">Moves:</div>
        <div>{{ moveNames }}</div>
        <div style="font-size: 2vh; font-weight: bold; padding: 30px 0px 10px 0px;">Evolution chain:</div>
        <div class="evolution-sprite-container" v-for="(entry, index) in Object.entries(dicionarioSpritesFirst)"
          :key="index">
          <div class="evolution-blank"></div>
          <v-img class="evolution-sprite" :src="entry[1]"></v-img>
          <div class="evolution-text">{{ entry[0] }}</div>
          <div class="evolution-blank"></div>
        </div>
        <div v-show="existsEvolutionSecond" style="text-align: center;">&darr;</div>
        <div class="evolution-sprite-container" v-for="(entry, index) in Object.entries(dicionarioSpritesSecond)"
          :key="index">
          <div class="evolution-blank"></div>
          <v-img class="evolution-sprite" :src="entry[1]"></v-img>
          <div class="evolution-text">{{ entry[0] }}</div>
          <div class="evolution-blank"></div>
        </div>
        <div v-show="existsEvolutionThird" style="text-align: center;">&darr;</div>
        <div class="evolution-sprite-container" v-for="(entry, index) in Object.entries(dicionarioSpritesThird)"
          :key="index">
          <div class="evolution-blank"></div>
          <v-img class="evolution-sprite" :src="entry[1]"></v-img>
          <div class="evolution-text">{{ entry[0] }}</div>
          <div class="evolution-blank"></div>
        </div>
        <div style="font-size: 2vh; font-weight: bold; padding: 0px 0px 10px 0px;">Sprites:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">
          <div v-for="sprite in Object.values(pokemon.sprites).filter(s => typeof s === 'string')" :key="sprite">
            <v-img v-show="sprite" :src="sprite" height="60px"></v-img>
          </div>
        </div>
        <div style="font-size: 2vh; font-weight: bold;">Games:</div>
        <div>{{ gameNames }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red darken-1" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import api from "@/service/api";

export default {
  props: {
    dialog: Boolean,
    pokemon: {
      type: Object,
      default: () => ({})
    },
  },
  setup(props, { emit }) {
    const localDialog = ref(props.dialog);
    const isLoading = ref(true);
    const speciesDetails = ref({});
    const evolutionChainId = ref("");
    const dicionarioSpritesFirst = ref({});
    const dicionarioSpritesSecond = ref({});
    const dicionarioSpritesThird = ref({});
    const existsEvolutionSecond = ref(false);
    const existsEvolutionThird = ref(false);
    const moveNames = ref("");
    const gameNames = ref("");

    watch(() => props.dialog, async (newVal) => {
      localDialog.value = newVal;
      if (newVal && props.pokemon.id) {
        dicionarioSpritesFirst.value = {};
        dicionarioSpritesSecond.value = {};
        dicionarioSpritesThird.value = {};
        existsEvolutionSecond.value = false;
        existsEvolutionThird.value = false;
        isLoading.value = true;
        await fetchSpeciesDetails(props.pokemon.id);
        await fetchEvolutionChain(evolutionChainId.value);
        moveNames.value = props.pokemon.moves;
        gameNames.value = props.pokemon.games;
        isLoading.value = false;
      }
    });

    watch(localDialog, (newValue) => {
      emit('update:dialog', newValue);
    });

    async function fetchSpeciesDetails(pokemonId) {
      try {
        const response = await api.get(`/pokemon-species/${pokemonId}`);
        speciesDetails.value = response.data;
        const url = response.data.evolution_chain.url
        const match = url.match(/evolution-chain\/(\d+)\//);
        evolutionChainId.value = match ? match[1] : null;
      } catch (error) {
        console.error('Failed to fetch species details:', error);
      }
    }

    async function fetchPokemonSprite(pokemonName) {
      try {
        const response = await api.get(`/pokemon/${pokemonName}`);
        return response.data.sprites.front_default;
      } catch (error) {
        console.error('Failed to fetch pokemon sprites:', error);
      }
    }

    async function fetchEvolutionChain(chainId) {
      try {
        const response = await api.get(`/evolution-chain/${chainId}`);
        const data = response.data.chain;

        let pokemonChainFirst = data ? [data.species.name] : [];
        let pokemonChainSecond = data ? data.evolves_to.map(e => e.species.name) : [];
        let pokemonChainThird = data ? data.evolves_to.flatMap(e => e.evolves_to.map(e => e.species.name)) : [];

        await Promise.all([
          updateSpritesDictionary(dicionarioSpritesFirst, pokemonChainFirst),
          updateSpritesDictionary(dicionarioSpritesSecond, pokemonChainSecond),
          updateSpritesDictionary(dicionarioSpritesThird, pokemonChainThird)
        ]);

        if (pokemonChainSecond.length > 0) {
          existsEvolutionSecond.value = true;
        }

        if (pokemonChainThird.length > 0) {
          existsEvolutionThird.value = true;
        }


      } catch (error) {
        console.error('Failed to fetch evolution chain details:', error);
      }
    }

    async function updateSpritesDictionary(dictionary, pokemonNames) {
      const sprites = await Promise.all(pokemonNames.map(name => fetchPokemonSprite(name)));
      pokemonNames.forEach((name, index) => {
        dictionary.value[name] = sprites[index];
      });
    }

    function close() {
      localDialog.value = false;

    }

    return {
      localDialog,
      isLoading,
      speciesDetails,
      evolutionChainId,
      dicionarioSpritesFirst,
      dicionarioSpritesSecond,
      dicionarioSpritesThird,
      existsEvolutionSecond,
      existsEvolutionThird,
      moveNames,
      gameNames,
      close
    };
  },
};
</script>

<style>
.pokemon-name {
  font-size: 5vw;
}

.pokemon-id {
  font-size: 5vw;
}

.evolution-sprite-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.evolution-sprite {
  height: 50px;
  width: 50px;
}

.evolution-text {
  text-transform: capitalize;
  justify-self: center;
  align-self: center;
}

.evolution-blank {
  flex-grow: 5;
}
</style>
