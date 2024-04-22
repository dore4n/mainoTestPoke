import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';
import App from '@/App.vue';
import { registerPlugins } from '@/plugins';

describe('main.js', () => {
  it('creates the app instance correctly', () => {
    const app = createApp(App);
    expect(app).toBeTruthy();
    expect(typeof app.mount).toBe('function');
  });

  it('registers plugins correctly', () => {
    const app = createApp(App);
    registerPlugins(app);
    expect(app._context.provides).toBeDefined();
  });
});
