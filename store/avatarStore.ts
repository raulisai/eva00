import { create } from "zustand";
import type { AvatarEmotion, AvatarLoadState } from "@/types/avatar";

type AvatarStore = {
  emotion: AvatarEmotion;
  loadState: AvatarLoadState;
  isSpeaking: boolean;
  speechText: string;
  activateIdle: () => void;
  setEmotion: (emotion: AvatarEmotion) => void;
  setLoadState: (loadState: AvatarLoadState) => void;
  setSpeaking: (isSpeaking: boolean) => void;
  setSpeechText: (speechText: string) => void;
  reset: () => void;
};

export const useAvatarStore = create<AvatarStore>((set) => ({
  emotion: "idle",
  loadState: "loading",
  isSpeaking: false,
  speechText: "",
  activateIdle: () =>
    set({
      emotion: "idle",
      isSpeaking: false,
    }),
  setEmotion: (emotion) => set({ emotion }),
  setLoadState: (loadState) => set({ loadState }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setSpeechText: (speechText) => set({ speechText }),
  reset: () =>
    set({
      emotion: "idle",
      isSpeaking: false,
      speechText: "",
    }),
}));
