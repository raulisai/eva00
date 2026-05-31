"use client";

import { BrowserControls } from "./BrowserControls";
import { createProxyUrl } from "./PageInjector";
import { useBrowserStore } from "@/store/browserStore";

export function BrowserFrame() {
  const currentUrl = useBrowserStore((state) => state.currentUrl);
  const errorMessage = useBrowserStore((state) => state.errorMessage);
  const isOpen = useBrowserStore((state) => state.isOpen);
  const reloadKey = useBrowserStore((state) => state.reloadKey);
  const status = useBrowserStore((state) => state.status);
  const setError = useBrowserStore((state) => state.setError);
  const setStatus = useBrowserStore((state) => state.setStatus);
  const iframeUrl = createProxyUrl(currentUrl, reloadKey);

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="absolute bottom-28 right-5 top-28 z-[15] flex w-[min(520px,calc(100vw-120px))] flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-2xl shadow-zinc-300/30 backdrop-blur-xl">
      <BrowserControls />

      <div className="relative flex min-h-0 flex-1 bg-zinc-50">
        {!currentUrl ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                B
              </div>
              <p className="text-sm font-medium text-zinc-600">EVA Browser listo para navegar</p>
              <p className="mt-2 text-xs text-zinc-400">Escribe una URL para abrirla en modo MVP.</p>
            </div>
          </div>
        ) : (
          <iframe
            className="h-full w-full bg-white"
            key={`${currentUrl}-${reloadKey}`}
            onError={() => setError("No se pudo cargar la pagina.")}
            onLoad={() => setStatus("ready")}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
            src={iframeUrl}
            title="EVA Browser"
          />
        )}

        {status === "loading" ? (
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-teal-100">
            <div className="h-full w-1/2 animate-pulse bg-teal-500" />
          </div>
        ) : null}

        {status === "error" ? (
          <div className="absolute inset-0 grid place-items-center bg-white/85 p-8 text-center backdrop-blur-sm">
            <div>
              <p className="text-sm font-semibold text-rose-500">Error de navegador</p>
              <p className="mt-2 text-sm text-zinc-500">{errorMessage || "No se pudo cargar la pagina."}</p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
