import { create } from "zustand";
import type { AvatarEmotion, AvatarLoadState } from "@/types/avatar";

type AvatarStore = {
  emotion: AvatarEmotion;
  loadState: AvatarLoadState;
  isSpeaking: boolean;
  speechText: string;
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
