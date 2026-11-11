import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function GuideLayout({
  title,
  intro,
  toc,
  children,
}: {
  title: string;
  intro: string;
  toc: { id: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-film text-on-film">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-display flex items-center gap-2.5 text-2xl">
            <Logo />
            Matte
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
            <Link href="/" className="opacity-85 transition-opacity hover:opacity-100">
              Back to Matte
            </Link>
            <ThemeToggle />
          </div>
        </nav>
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-7 px-5 pb-16 pt-10 sm:px-8 lg:pb-24 lg:pt-16">
          <h1 className="font-display max-w-5xl text-5xl leading-[0.96] sm:text-7xl lg:text-[5.5rem]">{title}</h1>
          <p className="max-w-2xl text-xl leading-relaxed">{intro}</p>
          <Link
            href="/#top"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-ink px-6 py-3.5 text-base font-semibold text-ground transition-[transform,opacity] hover:opacity-90 active:translate-y-px active:scale-[0.98]"
          >
            Choose photos
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-8 flex flex-col gap-3 text-base font-medium">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-soft transition-colors hover:text-ink">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex flex-col gap-20 lg:col-span-9 lg:gap-28">{children}</main>
      </div>

      <Footer />
    </div>
  );
}

export function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-8 flex-col gap-8">
      <h2 className="font-display text-4xl leading-[1.02] sm:text-5xl">{title}</h2>
      {children}
    </section>
  );
}

export function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-5">
          <span className="font-display text-6xl leading-none text-accent">{i + 1}</span>
          <span className="flex flex-col gap-1.5 pt-1.5">
            <span className="text-xl font-semibold">{s.title}</span>
            <span className="leading-relaxed text-soft">{s.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
