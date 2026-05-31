import { create } from "zustand";
import { bubbleCopy, type SpeechBubbleItem, type SpeechBubblePosition, type SpeechBubbleType } from "@/components/avatar/BubbleTypes";

type SpeechBubbleStore = {
  bubbles: SpeechBubbleItem[];
  addBubble: (type: SpeechBubbleType, text?: string) => string;
  clearBubbles: () => void;
  removeBubble: (id: string) => void;
  spawnAlertBubble: (text?: string) => string;
  spawnHappyBubble: (text?: string) => string;
  spawnSystemBubble: (text?: string) => string;
  spawnTalkingBubble: (text?: string) => string;
  spawnThinkingBubble: (text?: string) => string;
};

const expressionZone: SpeechBubblePosition[] = [
  { x: 27, y: 18 },
  { x: 34, y: 12 },
  { x: 46, y: 9 },
  { x: 57, y: 13 },
  { x: 66, y: 22 },
  { x: 31, y: 33 },
  { x: 63, y: 36 },
];

function pickText(type: SpeechBubbleType, text?: string) {
  if (text) {
    return text.length > 58 ? `${text.slice(0, 55)}...` : text;
  }

  const options = bubbleCopy[type];
  return options[Math.floor(Math.random() * options.length)];
}

function pickPosition(bubbles: SpeechBubbleItem[]) {
  const positions = [...expressionZone].sort(() => Math.random() - 0.5);
  const position =
    positions.find((candidate) =>
      bubbles.every((bubble) => Math.hypot(candidate.x - bubble.position.x, candidate.y - bubble.position.y) > 14),
    ) ?? positions[0];

  return {
    x: position.x + (Math.random() - 0.5) * 5,
    y: position.y + (Math.random() - 0.5) * 4,
  };
}

function createBubble(type: SpeechBubbleType, text: string, position: SpeechBubblePosition): SpeechBubbleItem {
  return {
    id: crypto.randomUUID(),
    text,
    type,
    position,
    driftX: (Math.random() - 0.5) * 28,
    driftY: -18 - Math.random() * 18,
    duration: 4200 + Math.random() * 1400,
  };
}

function addBubbleToState(bubbles: SpeechBubbleItem[], type: SpeechBubbleType, text?: string) {
  const visible = type === "thinking" ? bubbles.filter((bubble) => bubble.type !== "thinking").concat(bubbles.filter((bubble) => bubble.type === "thinking").slice(-2)) : bubbles;
  const bubble = createBubble(type, pickText(type, text), pickPosition(visible));
  const next = [...visible, bubble].slice(-5);

  return { bubble, bubbles: next };
}

export const useSpeechBubbleStore = create<SpeechBubbleStore>((set, get) => ({
  bubbles: [],
  addBubble: (type, text) => {
    const { bubble, bubbles } = addBubbleToState(get().bubbles, type, text);
    set({ bubbles });
    return bubble.id;
  },
  clearBubbles: () => set({ bubbles: [] }),
  removeBubble: (id) => set((state) => ({ bubbles: state.bubbles.filter((bubble) => bubble.id !== id) })),
  spawnAlertBubble: (text) => get().addBubble("alert", text),
  spawnHappyBubble: (text) => get().addBubble("happy", text),
  spawnSystemBubble: (text) => get().addBubble("system", text),
  spawnTalkingBubble: (text) => get().addBubble("talking", text),
  spawnThinkingBubble: (text) => get().addBubble("thinking", text),
}));
