import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// React Compiler: the stable Babel plugin (babel-plugin-react-compiler 1.0) via
// plugin-react's `reactCompilerPreset`. The Rust `compiler: true` option is
// documented as experimental, so it is not used.
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
});
