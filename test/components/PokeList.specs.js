import { describe, it, expect, mount } from '@vue/test-utils';
import PokeList from '@/components/PokeList.vue';
import api from '@/service/api';

jest.mock('@/service/api');

describe('PokeList.vue', () => {
  it('filters pokemons correctly', async () => {
    const wrapper = mount(PokeList);
    await wrapper.setData({ search: 'bulbasaur' });
    expect(wrapper.vm.filteredPokemons.length).toBeGreaterThan(0);
  });

  it('fetches pokemons on mount', () => {
    api.get.mockResolvedValue({ data: { results: [{ name: 'bulbasaur' }] } });
    const wrapper = mount(PokeList);
    expect(api.get).toHaveBeenCalled();
  });

  it('handles infinite scroll correctly', async () => {
    const wrapper = mount(PokeList);
    wrapper.vm.load({ side: 'end', done: () => {} });
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
