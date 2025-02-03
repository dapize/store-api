import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    silent: false,
    setupFiles: './tests/setup.ts',
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/configs/*', 'src/**/__tests__/**', 'src/**/*.test.ts', 'src/**/*.spec.ts', 'src/app.ts', 'src/server.ts'],
      reporter: ['text', 'json', 'html'],
      all: true
    }
  },
  esbuild: {
    loader: 'ts',
    target: 'esnext'
  },
  resolve: {
    conditions: ['node'],
    alias: {
      '@config': '/src/config',
      '@modules': '/src/modules',
      '@utils': '/src/utils',
      '@app': '/src/app',
      '@server': '/src/server'
    }
  }
});
