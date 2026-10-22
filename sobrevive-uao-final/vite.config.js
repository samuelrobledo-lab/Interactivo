import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Rutas relativas: permite publicar en GitHub Pages (usuario.github.io/repo/) o abrir desde cualquier carpeta
  base: './',
  plugins: [react(), tailwindcss()],
})
