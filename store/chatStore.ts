import { create } from "zustand";
import type { ChatMessage } from "@/types/chat";

type ChatStore = {
  messages: ChatMessage[];
  isThinking: boolean;
  addMessage: (message: Omit<ChatMessage, "id">) => void;
  setThinking: (isThinking: boolean) => void;
  clear: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Hola, soy EVA-00. Estoy funcionando en modo MVP local.",
    },
  ],
  isThinking: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
        },
      ],
    })),
  setThinking: (isThinking) => set({ isThinking }),
  clear: () => set({ messages: [], isThinking: false }),
}));
