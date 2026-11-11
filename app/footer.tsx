"use client";

import Link from "next/link";
import { Logo } from "./logo";

const CONSENT_KEY = "matte-consent-v1";
const CONSENT_EVENT = "matte-consent";
export const CONSENT_RESET_EVENT = "matte-consent-reset";

const col = "flex flex-col gap-3";
const head = "text-sm font-semibold opacity-60";
const link =
  "py-1 text-base font-medium underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-film";

function openConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  } catch {}
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
  // off the home page there is no dialog: go where it lives
  if (window.location.pathname !== "/") window.location.assign("/");
}

export function Footer({ onChoose }: { onChoose?: () => void }) {
  return (
    <footer className="bg-[#0f1511] text-[#eff3ef]">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="flex flex-col items-start gap-6 lg:col-span-5">
          <Link href="/" className="font-display flex items-center gap-2.5 text-3xl">
            <Logo onInk />
            Matte
          </Link>
          <p className="max-w-xs text-lg leading-snug opacity-80">
            Background removal that runs on your device. Free, and nothing is uploaded.
          </p>
          {onChoose ? (
            <button
              type="button"
              onClick={onChoose}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-film px-6 py-3.5 text-base font-semibold text-on-film transition-[transform,background-color] duration-200 hover:bg-film-deep active:translate-y-px active:scale-[0.98]"
            >
              Choose photos
            </button>
          ) : (
            <Link
              href="/#top"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-film px-6 py-3.5 text-base font-semibold text-on-film transition-[transform,background-color] duration-200 hover:bg-film-deep active:translate-y-px active:scale-[0.98]"
            >
              Choose photos
            </Link>
          )}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-7">
          <div className={col}>
            <h2 className={head}>Matte</h2>
            <Link href="/#how" className={link}>How it works</Link>
            <Link href="/#faq" className={link}>FAQ</Link>
            <button type="button" onClick={openConsent} className={`${link} text-left`}>Cookie settings</button>
          </div>
          <div className={col}>
            <h2 className={head}>Guides</h2>
            <Link href="/remove-background-for-product-photos" className={link}>Product photos</Link>
            <Link href="/transparent-png-maker" className={link}>Transparent PNG</Link>
          </div>
          <div className={col}>
            <h2 className={head}>Legal</h2>
            <Link href="/privacy" className={link}>Privacy Policy</Link>
            <Link href="/terms" className={link}>Terms of Service</Link>
          </div>
          <div className={col}>
            <h2 className={head}>Built by</h2>
            <a href="https://ashutoshswamy.in" target="_blank" rel="noopener noreferrer" className={link}>Portfolio</a>
            <a href="https://github.com/ashutoshswamy" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>
            <a href="https://linkedin.com/in/ashutoshswamy" target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>
            <a href="https://x.com/ashutoshswamy_" target="_blank" rel="noopener noreferrer" className={link}>X</a>
            <a href="mailto:ashutoshswamy397@gmail.com" className={link}>Email</a>
          </div>
        </nav>
      </div>

    </footer>
  );
}
