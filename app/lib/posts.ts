import { Marked } from "marked";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  art: string | null;
  minutes: number;
};

const sources = import.meta.glob("../../content/posts/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const assets = import.meta.glob("../../content/posts/*/*.{png,jpg,jpeg,gif,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, string>, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2] };
}

function assetUrl(slug: string, href: string) {
  const name = href.replace(/^\.\//, "");
  return assets[`../../content/posts/${slug}/${name}`] ?? href;
}

function renderer(slug: string) {
  const marked = new Marked();
  marked.use({
    renderer: {
      image({ href, title, text }) {
        const src = assetUrl(slug, href);
        const cls = href.endsWith(".svg") ? "" : ' class="photo"';
        const t = title ? ` title="${title}"` : "";
        return `<img src="${src}" alt="${text}"${t}${cls} loading="lazy">`;
      },
    },
  });
  return marked;
}

const posts: (PostMeta & { body: string })[] = Object.entries(sources)
  .map(([path, raw]) => {
    const slug = path.split("/").slice(-2)[0];
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      tags: (data.tags ?? "").replace(/^\[|\]$/g, "").split(",").map((t) => t.trim()).filter(Boolean),
      excerpt: data.excerpt ?? "",
      art: assets[`../../content/posts/${slug}/art.svg`] ?? null,
      minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
      body,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function listPosts(): PostMeta[] {
  return posts.map(({ body, ...meta }) => meta);
}

export async function getPost(slug: string) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  const { body, ...meta } = post;
  return { ...meta, html: await renderer(slug).parse(body) };
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "");
}
