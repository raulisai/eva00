"use client";

import { useBrowserStore } from "@/store/browserStore";

export function useBrowserControl() {
  const closeBrowser = useBrowserStore((state) => state.closeBrowser);
  const navigateTo = useBrowserStore((state) => state.navigateTo);
  const openBrowser = useBrowserStore((state) => state.openBrowser);
  const reload = useBrowserStore((state) => state.reload);

  return {
    closeBrowser,
    navigateTo,
    openBrowser,
    reload,
  };
}
