import { Link } from "react-router";
import type { Route } from "./+types/home";
import { formatDate, listPosts } from "../lib/posts";
import { site } from "../lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: site.name },
    { name: "description", content: site.tagline },
  ];
}

export function loader() {
  return { posts: listPosts() };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  return (
    <section aria-labelledby="posts">
      <h2 id="posts" className="label mb-6">Posts recientes</h2>
      <ul>
        {posts.map((p, i) => (
          <li key={p.slug} className="border-b border-dashed border-[var(--graphite)] last:border-0">
            <Link
              to={`/posts/${p.slug}`}
              className="post-link grid grid-cols-[2.5rem_1fr] gap-x-2 py-6 sm:grid-cols-[2.5rem_1fr_9rem]"
            >
              <span className="pt-1 text-xs text-[var(--ink-soft)]">
                {String(posts.length - i).padStart(2, "0")}
              </span>
              <div className="col-start-2 row-start-1">
                {p.art && <img src={p.art} alt="" className="mb-4 aspect-[5/3] w-36 sm:hidden" />}
                <h3 className="text-lg font-bold">
                  <span className="post-title -mx-1 px-1">{p.title}</span>
                </h3>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  {formatDate(p.date)} · {p.minutes} min
                </p>
                <p className="mt-3 text-sm">{p.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
              {p.art && (
                <img
                  src={p.art}
                  alt=""
                  className="col-start-3 row-start-1 hidden aspect-[5/3] w-full sm:block"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
