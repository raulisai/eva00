import { create } from "zustand";
import type { BrowserStatus } from "@/types/browser";

type BrowserStore = {
  currentUrl: string;
  errorMessage: string;
  isOpen: boolean;
  reloadKey: number;
  status: BrowserStatus;
  closeBrowser: () => void;
  navigateTo: (url: string) => void;
  openBrowser: (url?: string) => void;
  reload: () => void;
  setError: (message: string) => void;
  setStatus: (status: BrowserStatus) => void;
};

function normalizeBrowserUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const useBrowserStore = create<BrowserStore>((set, get) => ({
  currentUrl: "",
  errorMessage: "",
  isOpen: false,
  reloadKey: 0,
  status: "idle",
  closeBrowser: () => set({ isOpen: false }),
  navigateTo: (url) => {
    const currentUrl = normalizeBrowserUrl(url);

    if (!currentUrl) {
      set({
        currentUrl: "",
        errorMessage: "",
        isOpen: true,
        status: "idle",
      });
      return;
    }

    set({
      currentUrl,
      errorMessage: "",
      isOpen: true,
      status: "loading",
    });
  },
  openBrowser: (url) => {
    if (url) {
      get().navigateTo(url);
      return;
    }

    set({
      errorMessage: "",
      isOpen: true,
      status: get().currentUrl ? "ready" : "idle",
    });
  },
  reload: () => {
    if (!get().currentUrl) {
      set({ status: "idle" });
      return;
    }

    set((state) => ({
      errorMessage: "",
      reloadKey: state.reloadKey + 1,
      status: "loading",
    }));
  },
  setError: (message) => set({ errorMessage: message, status: "error" }),
  setStatus: (status) => set({ status }),
}));
