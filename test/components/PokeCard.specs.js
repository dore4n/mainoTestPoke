import { describe, it, expect, mount } from '@vue/test-utils';
import PokeCard from '@/components/PokeCard.vue';
import api from '@/service/api';

jest.mock('@/service/api');

describe('PokeCard.vue', () => {
  it('opens and closes dialog correctly', async () => {
    const wrapper = mount(PokeCard, {
      props: { dialog: false }
    });
    await wrapper.setProps({ dialog: true });
    expect(wrapper.vm.localDialog).toBe(true);
    wrapper.vm.close();
    expect(wrapper.vm.localDialog).toBe(false);
  });

  it('fetches and displays Pokémon details correctly', async () => {
    api.get.mockResolvedValue({ data: { id: 1, name: 'Bulbasaur', moves: [], games: [] } });
    const wrapper = mount(PokeCard, {
      props: { dialog: true, pokemon: { id: 1 } }
    });
    await wrapper.vm.$nextTick();
    expect(api.get).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Bulbasaur');
  });
});
