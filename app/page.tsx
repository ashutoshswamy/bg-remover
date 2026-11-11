"use client";

import { CloudSlash, Cpu, ImageSquare } from "@phosphor-icons/react";
import Link from "next/link";
import { FAQ } from "./faq";
import { CONSENT_RESET_EVENT, Footer } from "./footer";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { sileo } from "sileo";

const MAX_IMAGES = 5;
const CONSENT_KEY = "matte-consent-v1";
const CONSENT_EVENT = "matte-consent";

// consent lives in localStorage; useSyncExternalStore keeps SSR and hydration consistent
function subscribeConsent(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(CONSENT_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CONSENT_EVENT, cb);
  };
}
function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) ?? "none";
  } catch {
    return "none";
  }
}


type ImageItem = {
  id: string;
  name: string;
  originalUrl: string;
  resultUrl: string | null;
  status: "pending" | "processing" | "done" | "error";
};



const btn =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3.5 text-base font-semibold transition-[transform,background-color] duration-200 active:translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export default function Home() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stored = useSyncExternalStore(subscribeConsent, readConsent, () => "pending");
  const [sessionOk, setSessionOk] = useState(false); // fallback when storage is blocked
  const [showConsent, setShowConsent] = useState(true);
  // crawlers cannot consent; skip the blocking dialog so they can read the page
  const isBot = useSyncExternalStore(
    () => () => {},
    () => /bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent),
    () => false,
  );
  const ready = stored !== "pending";
  const accepted = stored !== "none" && stored !== "pending" ? true : sessionOk;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (ready && !accepted && showConsent && !isBot) {
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [ready, accepted, showConsent, isBot]);

  function acceptConsent() {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ terms: true, privacy: true, cookies: true, at: new Date().toISOString() }),
      );
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      setSessionOk(true);
    }
    sileo.success({ title: "Thanks, you're all set", description: "Drop a photo to get started." });
  }

  useEffect(() => {
    const onReset = () => {
      setSessionOk(false);
      setShowConsent(true);
    };
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);

  function requireConsent() {
    setShowConsent(true);
    sileo.warning({
      title: "Accept the terms to continue",
      description: "Matte needs your OK on the Terms, Privacy Policy and cookies first.",
    });
  }

  const used = items.length;
  const atLimit = used >= MAX_IMAGES;

  function update(id: string, patch: Partial<ImageItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function handleFiles(files: FileList | File[] | null) {
    if (!files) return;
    if (!accepted) return requireConsent();
    const all = Array.from(files);
    const images = all.filter((f) => f.type.startsWith("image/"));
    if (images.length < all.length) {
      sileo.warning({
        title: "Some files were skipped",
        description: "Matte only accepts image files.",
      });
    }
    if (!images.length) return;
    const slots = MAX_IMAGES - used;
    if (slots <= 0) {
      sileo.warning({
        title: "All five slots are used",
        description: "Remove a photo to make room for another.",
      });
      return;
    }
    const incoming = images.slice(0, slots);
    if (images.length > slots) {
      sileo.warning({
        title: `Only ${slots} slot${slots === 1 ? "" : "s"} left`,
        description: `${images.length - slots} photo${images.length - slots === 1 ? " was" : "s were"} left out.`,
      });
    }
    const added: ImageItem[] = incoming.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
      status: "pending",
    }));
    setItems((prev) => [...prev, ...added]);
    setTimeout(() => document.getElementById("cutouts")?.scrollIntoView({ behavior: "smooth" }), 80);

    const toastId = sileo.show({
      type: "loading",
      title: `Cutting ${added.length} photo${added.length === 1 ? "" : "s"}`,
      description: "The first one loads the model, so it takes a moment.",
      duration: null,
    });
    Promise.all(added.map((item, i) => processImage(item.id, incoming[i]))).then((results) => {
      sileo.dismiss(toastId);
      const ok = results.filter(Boolean).length;
      const failed = results.length - ok;
      if (!failed) {
        sileo.success({
          title: ok === 1 ? "Your cutout is ready" : `${ok} cutouts are ready`,
          description: "Download them as transparent PNGs.",
        });
      } else if (ok) {
        sileo.warning({
          title: `${ok} ready, ${failed} failed`,
          description: "Remove the failed photo and try another file.",
        });
      } else {
        sileo.error({
          title: "Couldn't cut that photo",
          description: "Try a different image or reload the page.",
        });
      }
    });
  }

  async function processImage(id: string, file: File): Promise<boolean> {
    update(id, { status: "processing" });
    try {
      // ponytail: dynamic import keeps the multi-MB wasm/model out of the initial bundle
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file);
      update(id, { resultUrl: URL.createObjectURL(blob), status: "done" });
      return true;
    } catch {
      update(id, { status: "error" });
      return false;
    }
  }

  function remove(id: string) {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) {
        URL.revokeObjectURL(it.originalUrl);
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      }
      return prev.filter((x) => x.id !== id);
    });
  }

  function pick() {
    if (!accepted) return requireConsent();
    if (atLimit) {
      sileo.warning({
        title: "All five slots are used",
        description: "Remove a photo to make room for another.",
      });
      return;
    }
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-1 flex-col">
      <input
        ref={inputRef}
        id="file-input"
        type="file"
        accept="image/*"
        multiple
        disabled={!accepted}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <dialog
        ref={dialogRef}
        aria-labelledby="consent-h"
        onCancel={(e) => e.preventDefault()}
        className="m-auto w-[calc(100%-2.5rem)] max-w-md rounded-md bg-surface p-7 text-ink shadow-2xl backdrop:bg-[rgb(10_12_15/0.72)] sm:p-9"
      >
        <h2 id="consent-h" className="font-display text-3xl leading-tight">Before you start</h2>
        <p className="mt-3 leading-relaxed text-soft">
          Matte stores small records in your browser (local storage) to remember this choice and your theme.
          There are no tracking or advertising cookies, and your photos never leave your device.
        </p>
        <p className="mt-3 leading-relaxed text-soft">
          To use Matte, please accept our{" "}
          <Link href="/terms" className="font-medium text-ink underline decoration-film decoration-2 underline-offset-4">Terms of Service</Link>,{" "}
          <Link href="/privacy" className="font-medium text-ink underline decoration-film decoration-2 underline-offset-4">Privacy Policy</Link>{" "}
          and the use of local storage and cookies.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" autoFocus onClick={acceptConsent} className={`${btn} bg-film text-on-film hover:bg-film-deep`}>
            Accept and continue
          </button>
          <button type="button" onClick={() => setShowConsent(false)} className={`${btn} border border-line text-soft hover:text-ink`}>
            Not now
          </button>
        </div>
      </dialog>

      {/* HERO: red film field, the drop print lies across its edge */}
      <header id="top" className="relative bg-film text-on-film">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-display flex items-center gap-2.5 text-2xl">
            <Logo />
            Matte
          </a>
          <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
            <a href="#how" className="hidden opacity-85 transition-opacity hover:opacity-100 sm:inline">How it works</a>
            <a href="#faq" className="hidden opacity-85 transition-opacity hover:opacity-100 sm:inline">FAQ</a>
            <ThemeToggle />
          </div>
        </nav>

        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10 lg:pb-0 lg:pt-10">
          <h1 className="font-display rise text-[2.9rem] leading-[0.95] sm:text-7xl lg:col-span-12 lg:text-[6.5rem] xl:text-[7.5rem]" style={{ "--i": 0 } as React.CSSProperties}>
            Peel the background<br className="hidden lg:block" /> off any photo.
          </h1>

          <div className="flex flex-col items-start gap-7 lg:col-span-5 lg:pb-16">
            <p className="rise max-w-[32rem] text-lg leading-relaxed" style={{ "--i": 1 } as React.CSSProperties}>
              Matte is a free background remover. It cuts the subject out in your
              browser, with no signup and no upload.
            </p>
            <div className="rise" style={{ "--i": 2 } as React.CSSProperties}>
              <button type="button" onClick={pick} className={`${btn} bg-ink text-ground hover:opacity-90`}>
                Choose photos
              </button>
            </div>
          </div>

          <div className="rise relative lg:relative lg:z-10 lg:col-span-7 lg:-mb-32" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="crop crop-tl" />
            <span className="crop crop-tr" />
            <span className="crop crop-bl" />
            <span className="crop crop-br" />
            <label
              htmlFor="file-input"
              data-over={over}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={(e) => {
                if (atLimit || !accepted) {
                  e.preventDefault();
                  pick();
                }
              }}
              className={`print flex min-h-[20rem] flex-col text-ink transition-transform duration-300 lg:min-h-[22rem] lg:-rotate-1 lg:hover:rotate-0 ${
                over ? "lg:rotate-0 scale-[1.015]" : ""
              } ${atLimit ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span className="checker relative flex flex-1 items-center justify-center" aria-hidden>
                <span className="relative block h-14 w-14 rounded-md bg-ink">
                  <span className="absolute left-1/2 top-3 bottom-3 w-1 -translate-x-1/2 bg-ground" />
                  <span className="absolute left-3 right-3 top-1/2 h-1 -translate-y-1/2 bg-ground" />
                </span>
              </span>
              <span className="flex flex-col gap-3 bg-surface p-6 sm:flex-row sm:items-end sm:justify-between">
                <span className="flex flex-col gap-1">
                  <span className="font-display text-3xl leading-tight sm:text-4xl">
                    {!accepted ? "Accept the terms to start." : atLimit ? "All five slots are used." : over ? "Let go to start." : "Drop photos here."}
                  </span>
                  <span className="text-base text-soft">
                    {!accepted ? "Click here to review and accept." : atLimit ? "Remove a photo below to add another." : "Or click to browse your files."}
                  </span>
                </span>
                <span className="flex flex-col gap-2 sm:items-end">
                  <span className="flex gap-1.5" aria-hidden>
                    {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                      <span key={i} className={`h-1.5 w-7 rounded-sm ${i < used ? "bg-accent" : "bg-line"}`} />
                    ))}
                  </span>
                  <span className="text-sm font-medium text-soft">{used} of {MAX_IMAGES} slots used</span>
                </span>
              </span>
            </label>
          </div>
        </div>
      </header>
      <div className="hidden h-24 lg:block" aria-hidden />

      {/* CUTTING TABLE */}
      {items.length > 0 && (
        <section id="cutouts" aria-label="Your cutouts" className="mx-auto w-full max-w-7xl scroll-mt-4 px-5 pb-24 sm:px-8">
          <h2 className="font-display mb-8 text-4xl sm:text-5xl">Your cutouts</h2>
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const peeled = item.status === "done" || item.status === "error";
              return (
                <li key={item.id} className="flex flex-col gap-3">
                  <div className="checker relative aspect-[4/3] overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl ?? item.originalUrl}
                      alt={item.status === "done" ? `${item.name} with the background removed` : item.name}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    <div
                      aria-hidden
                      className="peel absolute inset-0 overflow-hidden bg-film/80"
                      style={{ clipPath: peeled ? "inset(0 0 0 100%)" : "inset(0 0 0 0)" }}
                    >
                      {item.status === "processing" && (
                        <div className="sweep absolute inset-0">
                          <div className="absolute inset-y-0 right-0 w-0.5 bg-on-film" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="truncate text-sm font-medium" title={item.name}>{item.name}</p>
                    <p
                      className={`shrink-0 text-sm ${item.status === "error" ? "font-semibold text-danger" : "text-soft"}`}
                      role="status"
                    >
                      {item.status === "pending" && "Waiting"}
                      {item.status === "processing" && "Cutting"}
                      {item.status === "done" && "Ready"}
                      {item.status === "error" && "Failed"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {item.status === "done" && item.resultUrl && (
                      <a
                        href={item.resultUrl}
                        download={`no-bg-${item.name.replace(/\.[^.]+$/, "")}.png`}
                        onClick={() => sileo.success({ title: "Saving your PNG", description: item.name })}
                        className={`${btn} flex-1 bg-ink py-2.5 text-sm text-ground hover:bg-film hover:text-on-film`}
                      >
                        Download PNG
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className={`${btn} py-2.5 text-sm text-soft hover:text-ink ${item.status === "done" ? "" : "flex-1 border border-line"}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* HOW: three steps as one asymmetric board, each cell shows its real state */}
      <section id="how" aria-labelledby="how-h" className="mx-auto w-full max-w-7xl scroll-mt-4 px-5 py-20 sm:px-8 lg:py-28">
        <h2 id="how-h" className="sr-only">How it works</h2>
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          <article className="group flex flex-col justify-between gap-12 rounded-md bg-surface p-7 sm:p-10 lg:col-span-7 lg:row-span-2 lg:min-h-[34rem]">
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-7xl leading-none sm:text-8xl lg:text-[8.5rem]">Drop</h3>
              <p className="max-w-sm text-lg leading-relaxed text-soft">
                Add up to five photos. Drag them in or pick them from your device.
              </p>
            </div>
            <div className="grid grid-cols-5 gap-3" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="checker relative block aspect-[4/5] rounded-md transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {i === 0 && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="relative block h-8 w-8 rounded-md bg-ink">
                        <span className="absolute bottom-2 left-1/2 top-2 w-0.5 -translate-x-1/2 bg-ground" />
                        <span className="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 bg-ground" />
                      </span>
                    </span>
                  )}
                </span>
              ))}
            </div>
          </article>

          <article className="flex flex-col justify-between gap-10 rounded-md bg-film p-7 text-on-film sm:p-10 lg:col-span-5">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-6xl leading-none sm:text-7xl">Cut</h3>
              <p className="max-w-xs text-lg leading-relaxed">
                A model runs inside your browser and separates the subject from the backdrop.
              </p>
            </div>
            <div className="checker relative h-16 overflow-hidden rounded-md" aria-hidden>
              <div className="absolute inset-0 bg-film/80" />
              <div className="sweep absolute inset-0">
                <div className="absolute inset-y-0 right-0 w-0.5 bg-on-film" />
              </div>
            </div>
          </article>

          <article className="flex flex-col justify-between gap-10 rounded-md bg-ink p-7 text-ground sm:p-10 lg:col-span-5">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-6xl leading-none sm:text-7xl">Save</h3>
              <p className="max-w-xs text-lg leading-relaxed opacity-80">
                Download each result as a transparent PNG, ready for a listing, a slide or a sticker.
              </p>
            </div>
            <div className="flex items-center gap-4" aria-hidden>
              <span className="checker block h-14 w-14 shrink-0 rounded-md" />
              <span className="flex flex-col">
                <span className="font-semibold">no-bg-photo.png</span>
                <span className="text-sm opacity-70">Transparent PNG</span>
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* PRIVACY BAND: the claim, then the ledger that proves it */}
      <section className="bg-film text-on-film">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="flex flex-col items-start gap-7 lg:col-span-7">
            <h2 className="font-display text-5xl leading-[0.98] sm:text-7xl lg:text-[5rem]">
              Your photos never leave this tab.
            </h2>
            <p className="max-w-md text-lg leading-relaxed">
              The cutting model runs on your device. No upload, no account, no watermark.
            </p>
            <button type="button" onClick={pick} className={`${btn} bg-ink text-ground hover:opacity-90`}>
              Choose photos
            </button>
          </div>

          <div className="rounded-md bg-ink p-6 text-ground shadow-[0_30px_60px_-24px_rgb(60_8_2/0.6)] sm:p-8 lg:col-span-5">
            <h3 className="font-display text-2xl">Where your photo goes</h3>
            <ul className="mt-6 flex flex-col gap-6">
              {[
                { Icon: ImageSquare, title: "Your device", note: "The photo is read here and stays here." },
                { Icon: Cpu, title: "This browser tab", note: "The model cuts out the subject locally." },
                { Icon: CloudSlash, title: "Our servers", note: "Nothing is sent. There is no upload." },
              ].map(({ Icon, title, note }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-film text-on-film">
                    <Icon size={22} weight="bold" aria-hidden />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold">{title}</span>
                    <span className="text-sm leading-snug opacity-75">{note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-h" className="mx-auto grid w-full max-w-7xl scroll-mt-4 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <h2 id="faq-h" className="font-display text-4xl sm:text-5xl lg:col-span-4">Questions</h2>
        <div className="flex flex-col gap-3 lg:col-span-8">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-md bg-surface px-6 py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-semibold">
                {f.q}
                <span className="plus text-3xl font-normal leading-none text-accent" aria-hidden>+</span>
              </summary>
              <p className="mt-3 max-w-xl leading-relaxed text-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer onChoose={pick} />
    </div>
  );
}
