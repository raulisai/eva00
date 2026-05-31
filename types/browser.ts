export type BrowserStatus = "idle" | "loading" | "ready" | "error";

export type BrowserState = {
  currentUrl: string;
  errorMessage: string;
  isOpen: boolean;
  reloadKey: number;
  status: BrowserStatus;
};
