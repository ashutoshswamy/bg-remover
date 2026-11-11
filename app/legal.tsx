import Link from "next/link";
import { Footer } from "./footer";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import type { ReactNode } from "react";

export const UPDATED = "November 12, 2026";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <div className="flex flex-col gap-3 leading-relaxed text-soft">{children}</div>
    </section>
  );
}

export function LegalPage({ title, children, dated = true }: { title: string; children: ReactNode; dated?: boolean }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-film text-on-film">
        <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5 sm:px-8">
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
        <div className="mx-auto w-full max-w-3xl px-5 pb-14 pt-8 sm:px-8">
          <h1 className="font-display text-5xl leading-[0.98] sm:text-7xl">{title}</h1>
          {dated && <p className="mt-4 text-base">Last updated {UPDATED}</p>}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-20">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export function TryCta() {
  return (
    <Link
      href="/#top"
      className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded-md bg-ink px-6 py-3.5 text-base font-semibold text-ground transition-opacity hover:opacity-90"
    >
      Choose photos
    </Link>
  );
}
