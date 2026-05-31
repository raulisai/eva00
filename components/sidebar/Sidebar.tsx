"use client";

import { useBrowserControl } from "@/hooks/useBrowserControl";

export function Sidebar() {
  const { openBrowser } = useBrowserControl();

  return (
    <aside className="absolute left-3 top-3 z-30 hidden h-[calc(100%-24px)] w-14 rounded-2xl border border-white/80 bg-white/70 p-2 shadow-xl shadow-zinc-300/30 backdrop-blur-xl md:block">
      <div className="flex h-full flex-col items-center justify-between py-4">
        <nav className="flex flex-col gap-7 text-sm font-semibold text-zinc-400">
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-500" aria-label="Inicio" type="button">
            H
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl" aria-label="Notas" type="button">
            N
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-xl transition hover:bg-teal-50 hover:text-teal-500"
            aria-label="Abrir navegador"
            onClick={() => openBrowser("https://example.com")}
            type="button"
          >
            B
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl" aria-label="Sistema" type="button">
            S
          </button>
        </nav>
        <div className="flex flex-col items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          <span className="h-3 w-3 rounded-full bg-rose-300" />
        </div>
      </div>
    </aside>
  );
}
