import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import unpluginIcons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    unpluginIcons({
      compiler: "svelte",
    }),
  ],
});
