"use client";

import { useRef, useState } from "react";

const MAX_IMAGES = 5;

type ImageItem = {
  id: string;
  name: string;
  originalUrl: string;
  resultUrl: string | null;
  status: "pending" | "processing" | "done" | "error";
};

// ponytail: shared drag math for every draggable divider on the page
function useDragSplit(initial: number) {
  const [split, setSplit] = useState(initial);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function moveTo(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(96, Math.max(4, pct)));
  }

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as Element).setPointerCapture(e.pointerId);
      moveTo(e.clientX);
    },
    onPointerMove: (e: React.PointerEvent) => dragging.current && moveTo(e.clientX),
    onPointerUp: () => (dragging.current = false),
  };

  return { split, trackRef, handlers };
}

function PeelReveal() {
  const { split, trackRef, handlers } = useDragSplit(52);

  return (
    <div
      ref={trackRef}
      className="relative aspect-[4/3] w-full max-w-md touch-none select-none overflow-hidden rounded-sm border border-white/10"
      {...handlers}
    >
      {/* the plate: original subject on a colored backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_30%_20%,#3a3f4d_0%,#14151a_60%)]">
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-t-full bg-[linear-gradient(180deg,#d8b48f_0%,#8a5a3a_100%)]" />
      </div>
      {/* the key: matte pulled away, checkerboard underneath */}
      <div
        className="checker-dark absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${split}%)` }}
      >
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-t-full bg-[linear-gradient(180deg,#d8b48f_0%,#8a5a3a_100%)]" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-px bg-key"
        style={{ left: `${split}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-key font-mono text-[10px] text-bone shadow-lg">
          ⇔
        </div>
      </div>
      <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-bone/60">
        plate
      </span>
      <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-bone/60">
        key
      </span>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = useState<ImageItem[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files).slice(0, MAX_IMAGES - items.length);
    const newItems: ImageItem[] = incoming.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
      status: "pending",
    }));
    setItems((prev) => [...prev, ...newItems]);
    newItems.forEach((item, i) => processImage(item.id, incoming[i]));
  }

  async function processImage(id: string, file: File) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "processing" } : it)),
    );
    try {
      // ponytail: dynamic import keeps the ~a few MB wasm/model out of the initial bundle
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file);
      const resultUrl = URL.createObjectURL(blob);
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, resultUrl, status: "done" } : it,
        ),
      );
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: "error" } : it)),
      );
    }
  }

  const atLimit = items.length >= MAX_IMAGES;
  const slotsLeft = MAX_IMAGES - items.length;

  return (
    <div className="flex flex-1 flex-col">
      {/* STAGE — hero */}
      <header className="bg-stage text-bone">
        <div className="sprocket" />
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-8 lg:py-24">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-slate">
              <span className="h-1.5 w-1.5 rounded-full bg-key" />
              in-browser · no upload to any server
            </div>
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Pull the plate.
              <br />
              <span className="text-key">Keep the subject.</span>
            </h1>
            <p className="max-w-md text-lg text-bone/70">
              Drag the divider — that&apos;s the matte lifting off the plate.
              Your own photos do the same thing below, rendered entirely on
              your device.
            </p>
          </div>
          <div className="flex flex-1 justify-center">
            <PeelReveal />
          </div>
        </div>
        <div className="sprocket" />
      </header>

      {/* BONE — pipeline + workspace */}
      <main className="flex flex-1 flex-col bg-bone">
        <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
          {[
            { tag: "plate", title: "Upload", body: "Drop up to five photos. Nothing leaves your browser." },
            { tag: "key", title: "Pull the matte", body: "A model traces the subject and cuts the backdrop away." },
            { tag: "composite", title: "Download", body: "Save the cutout as a transparent PNG, ready to drop anywhere." },
          ].map((step) => (
            <div key={step.tag} className="flex flex-col gap-2 border-t-2 border-stage pt-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-key">
                {step.tag}
              </span>
              <h3 className="font-display text-xl tracking-tight text-stage">
                {step.title}
              </h3>
              <p className="text-sm text-slate">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 pb-20">
          <label
            className={`group flex min-h-36 w-full items-center justify-center gap-3 px-4 py-6 text-center border-2 border-dashed border-stage/20 bg-bone-dim/60 font-mono text-xs uppercase tracking-widest text-slate transition-colors sm:text-sm ${
              atLimit
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:border-key hover:text-key"
            }`}
          >
            {atLimit
              ? "5 of 5 loaded — clear a slot to add more"
              : `Load footage — ${slotsLeft} slot${slotsLeft === 1 ? "" : "s"} open`}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={atLimit}
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {items.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 border border-stage/15 bg-white/40 p-3"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate">
                    <span>take {String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={
                        item.status === "done"
                          ? "text-key"
                          : item.status === "error"
                            ? "text-leader"
                            : ""
                      }
                    >
                      {item.status === "pending" && "queued"}
                      {item.status === "processing" && "keying…"}
                      {item.status === "done" && "composited"}
                      {item.status === "error" && "failed"}
                    </span>
                  </div>
                  <div className="checker flex max-h-64 items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl ?? item.originalUrl}
                      alt={item.name}
                      className="max-h-64 w-full object-contain"
                    />
                  </div>
                  <p className="truncate text-xs text-slate">{item.name}</p>
                  {item.status === "done" && item.resultUrl && (
                    <a
                      href={item.resultUrl}
                      download={`no-bg-${item.name.replace(/\.[^.]+$/, "")}.png`}
                      className="flex items-center justify-center bg-key py-2 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-key-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-key"
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="flex flex-col items-center gap-3 bg-stage px-6 py-6 text-center font-mono text-[11px] uppercase tracking-widest text-slate">
        <span>matte — background removal, rendered on your machine</span>
        <span>
          built by{" "}
          <a
            href="mailto:ashutoshswamy397@gmail.com"
            className="text-bone/70 transition-colors hover:text-key"
          >
            Ashutosh Swamy
          </a>
        </span>
        <span className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a
            href="https://github.com/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone/70 transition-colors hover:text-key"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone/70 transition-colors hover:text-key"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/ashutoshswamy_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone/70 transition-colors hover:text-key"
          >
            X
          </a>
        </span>
      </footer>
    </div>
  );
}
