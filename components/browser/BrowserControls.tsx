"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useBrowserControl } from "@/hooks/useBrowserControl";
import { useBrowserStore } from "@/store/browserStore";

export function BrowserControls() {
  const currentUrl = useBrowserStore((state) => state.currentUrl);
  const status = useBrowserStore((state) => state.status);
  const { closeBrowser, navigateTo, reload } = useBrowserControl();
  const [url, setUrl] = useState(currentUrl);

  useEffect(() => {
    setUrl(currentUrl);
  }, [currentUrl]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateTo(url);
  }

  return (
    <form className="flex items-center gap-2 border-b border-zinc-200/80 bg-white/70 p-3" onSubmit={handleSubmit}>
      <div className="flex gap-1">
        <button
          aria-label="Atras"
          className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-300"
          disabled
          type="button"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        <button
          aria-label="Adelante"
          className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-300"
          disabled
          type="button"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <input
        aria-label="URL"
        className="min-w-0 flex-1 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm text-zinc-700 outline-none transition focus:border-teal-300"
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com"
        value={url}
      />

      <button
        className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-500 transition hover:bg-white hover:text-teal-600"
        onClick={reload}
        type="button"
      >
        Recargar
      </button>
      <button
        className="rounded-full bg-teal-500 px-4 py-2 text-xs font-medium text-white shadow-sm shadow-teal-500/20 transition hover:bg-teal-400"
        type="submit"
      >
        Ir
      </button>
      <button
        aria-label="Cerrar browser"
        className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-500 transition hover:text-rose-500"
        onClick={closeBrowser}
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>

      <span className="sr-only">{status}</span>
    </form>
  );
}
