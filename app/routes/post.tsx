import { Link } from "react-router";
import type { Route } from "./+types/post";
import { formatDate, getPost } from "../lib/posts";
import { site } from "../lib/site";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPost(params.slug);
  if (!post) throw new Response("Not found", { status: 404 });
  return { post };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: site.name }];
  return [
    { title: `${loaderData.post.title} · ${site.name}` },
    { name: "description", content: loaderData.post.excerpt },
  ];
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  return (
    <article>
      <p className="text-sm">
        <Link to="/" className="scribble">← back</Link>
      </p>
      <h2 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">{post.title}</h2>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        {formatDate(post.date)} · {post.minutes} min
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
      {post.art && <img src={post.art} alt="" className="mt-8 aspect-[5/3] w-full max-w-sm" />}
      <div className="prose-crayon mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
