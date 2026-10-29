import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { resolveDeployment } from "./site.config.mjs";

const deployment = resolveDeployment(process.env);

export default defineConfig({
  site: deployment.site,
  base: deployment.base,
  trailingSlash: "always",
  output: "static",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/update/") && !page.endsWith("/404/") && !page.endsWith("/404.html") })],
  vite: {
    define: {
      "import.meta.env.PUBLIC_REPOSITORY_OWNER": JSON.stringify(deployment.owner),
      "import.meta.env.PUBLIC_REPOSITORY_NAME": JSON.stringify(deployment.repository),
    },
    build: {
      cssMinify: true,
    },
  },
});
