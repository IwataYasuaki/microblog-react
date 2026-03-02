import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: ['cdk.out/**', 'node_modules/**'],
  },
})
