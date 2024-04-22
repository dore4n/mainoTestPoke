import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import Vuetify from 'vuetify';
import PokeList from '@/components/PokeList.vue';
import axios from 'axios';

jest.mock('axios');

describe('PokeList.vue', () => {
  let vuetify;

  beforeEach(() => {
    const app = createApp({});
    vuetify = new Vuetify();
    app.use(vuetify);
    axios.get.mockResolvedValue({ data: { results: [], count: 0 } });
  });

  const mountFunction = options => {
    return mount(PokeList, {
      global: {
        plugins: [vuetify],
      },
      ...options,
    });
  };

  it('fetches pokemons on mount', async () => {
    mountFunction();
    expect(axios.get).toHaveBeenCalledWith(`/pokemon?limit=50&offset=0`);
  });

  it('filters pokemons based on search input', async () => {
    const wrapper = mountFunction({
      data() {
        return {
          pokemons: [
            { id: 1, name: 'Bulbasaur', type: 'grass', species: 'seed' },
            { id: 2, name: 'Charmander', type: 'fire', species: 'lizard' }
          ]
        };
      }
    });
    wrapper.vm.search = 'bulba';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredPokemons).toHaveLength(1);
    expect(wrapper.vm.filteredPokemons[0].name).toBe('Bulbasaur');
  });

  it('selects a pokemon to display details', async () => {
    const wrapper = mountFunction();
    const mockPokemon = { id: 1, name: 'Bulbasaur', type: 'grass', species: 'seed' };
    wrapper.vm.selectPokemon(mockPokemon);
    expect(wrapper.vm.selectedPokemon).toBe(mockPokemon);
    expect(wrapper.vm.dialog).toBeTruthy();
  });
});