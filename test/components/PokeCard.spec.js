import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import Vuetify from 'vuetify';
import PokeCard from '@/components/PokeCard.vue';
import api from '@/service/api';

jest.mock('@/service/api');

describe('PokeCard.vue', () => {
  let vuetify;

  beforeEach(() => {
    const app = createApp({});
    vuetify = new Vuetify();
    app.use(vuetify);
  });

  const mountFunction = options => {
    return mount(PokeCard, {
      global: {
        plugins: [vuetify],
      },
      ...options,
    });
  };

  it('opens and closes dialog correctly', async () => {
    const wrapper = mountFunction({
      props: { dialog: false }
    });
    await wrapper.setProps({ dialog: true });
    expect(wrapper.vm.localDialog).toBe(true);
    wrapper.vm.close();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.localDialog).toBe(false);
  });

  it('fetches and displays Pokémon details correctly', async () => {
    api.get.mockResolvedValue({ data: { id: 1, name: 'Bulbasaur', moves: [], games: [] } });
    const wrapper = mountFunction({
      props: { dialog: true, pokemon: { id: 1 } }
    });
    await wrapper.vm.$nextTick();
    expect(api.get).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Bulbasaur');
  });
});