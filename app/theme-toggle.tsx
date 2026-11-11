"use client";

import { Check, CaretDown, Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const KEY = "matte-theme";
const EVENT = "matte-theme";
type Theme = "system" | "light" | "dark";

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System", Icon: Desktop },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}
function read(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

// favicon follows the chosen theme: one extra icon link (last one wins); "system" removes it
// and the media-query icons from the metadata take over again
function syncIcon(t: Theme) {
  let el = document.getElementById("matte-icon") as HTMLLinkElement | null;
  if (t === "system") {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.id = "matte-icon";
    el.rel = "icon";
    el.type = "image/svg+xml";
    document.head.appendChild(el);
  }
  el.href = `/icon-${t}.svg`;
}

function apply(t: Theme) {
  const root = document.documentElement;
  if (t === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", t);
  syncIcon(t);
  try {
    if (t === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, t);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle({ align = "right" }: { align?: "right" | "left" }) {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Theme);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];

  useEffect(() => {
    syncIcon(theme);
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) items.current[OPTIONS.findIndex((o) => o.value === theme)]?.focus();
  }, [open, theme]);

  function onMenuKey(e: React.KeyboardEvent) {
    const i = items.current.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items.current[(i + 1) % OPTIONS.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items.current[(i - 1 + OPTIONS.length) % OPTIONS.length]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btn.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrap} className="relative">
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 items-center gap-2 rounded-md border border-current/30 px-3 text-sm font-medium transition-colors hover:border-current/60 hover:bg-current/10"
      >
        <current.Icon size={18} weight="bold" aria-hidden />
        <span className="hidden sm:inline">{current.label}</span>
        <CaretDown size={14} weight="bold" aria-hidden className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKey}
          className={`absolute top-full z-40 mt-2 w-44 rounded-md border border-line bg-surface p-1 text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.35)] ${align === "right" ? "right-0" : "left-0"}`}
        >
          {OPTIONS.map(({ value, label, Icon }, i) => (
            <button
              key={value}
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={theme === value}
              onClick={() => {
                apply(value);
                setOpen(false);
                btn.current?.focus();
              }}
              className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-ground focus-visible:bg-ground focus-visible:outline-none"
            >
              <Icon size={18} weight="bold" aria-hidden className="text-soft" />
              <span className="flex-1">{label}</span>
              {theme === value && <Check size={16} weight="bold" aria-hidden className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
