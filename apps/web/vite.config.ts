import { defineConfig } from "vite";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import Unocss from "unocss/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    Unocss({
      rules: [["custom-rule", { color: "red" }]],
      shortcuts: {
        "custom-shortcut": "text-lg text-orange hover:text-teal",
      },
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          cdn: "https://esm.sh/",
        }),
      ],
    }),
  ],
});
