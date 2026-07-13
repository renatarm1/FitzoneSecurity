import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // En build de producción, los assets quedan bajo /static/ para que Django (WhiteNoise)
  // los sirva junto con sus propios estáticos (admin, DRF) desde el mismo dominio.
  // En dev (vite) se mantiene la raíz "/" para que el servidor de Vite siga funcionando normal.
  base: command === 'build' ? '/static/' : '/',
}))
