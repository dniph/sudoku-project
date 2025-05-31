import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const defaultBase = '/LuluDoku/';
const base = process.env.VITE_BASE || defaultBase;

export default defineConfig({
  plugins: [react()],
  base: base
});
