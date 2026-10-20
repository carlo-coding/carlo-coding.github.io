import { readdirSync } from "node:fs";
import type { Config } from "@react-router/dev/config";

const postsDir = new URL("./content/posts/", import.meta.url);

export default {
  // Static site: every page is rendered to HTML at build time
  ssr: false,
  async prerender() {
    const slugs = readdirSync(postsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    return ["/", ...slugs.map((s) => `/posts/${s}`)];
  },
} satisfies Config;
