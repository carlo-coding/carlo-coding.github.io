import { Link } from "react-router";
import { site } from "../lib/site";

export function Defs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <filter id="crayon" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" />
      </filter>
    </svg>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
      <header className="mb-12">
        <p className="text-sm text-[var(--ink-soft)]">
          carlos@blog:~$ <Link to="/">cd ~</Link>
          <span className="cursor ml-1" aria-hidden="true" />
        </p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          <Link to="/" className="scribble">{site.name}</Link>
        </h1>
        <p className="mt-5 max-w-prose text-[var(--ink-soft)]">{site.tagline}</p>
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Redes">
          {site.socials.map((s) => (
            <a key={s.href} href={s.href} rel="me noopener" target="_blank" className="scribble px-1">
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <hr className="rule mb-10" />

      <main>{children}</main>

      <footer className="mt-16 text-xs text-[var(--ink-soft)]">
        <hr className="rule mb-4" />
        <p>© {new Date().getFullYear()} · hecho a mano</p>
      </footer>
    </div>
  );
}
