"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { SpeechBubbleItem } from "./BubbleTypes";
import { useSpeechBubbleStore } from "@/store/speechBubbleStore";

type FloatingBubbleProps = {
  bubble: SpeechBubbleItem;
};

const bubbleStyles: Record<SpeechBubbleItem["type"], string> = {
  idle: "rounded-[24px] border-white/70 bg-white/55 text-zinc-500",
  thinking: "rounded-[30px] border-white/75 bg-white/65 text-zinc-500",
  talking: "rounded-[24px] border-white/80 bg-white/75 text-zinc-600",
  happy: "rounded-[24px] border-teal-100/80 bg-white/75 text-teal-700",
  alert: "rounded-[18px] border-rose-100/80 bg-white/80 text-rose-500",
  system: "rounded-2xl border-white/60 bg-white/50 text-zinc-400",
};

export function FloatingBubble({ bubble }: FloatingBubbleProps) {
  const removeBubble = useSpeechBubbleStore((state) => state.removeBubble);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => removeBubble(bubble.id), bubble.duration);
    return () => window.clearTimeout(timeoutId);
  }, [bubble.duration, bubble.id, removeBubble]);

  return (
    <div
      className={`eva-floating-bubble absolute max-w-56 border px-4 py-3 text-sm leading-5 shadow-xl shadow-zinc-300/25 backdrop-blur-xl ${bubbleStyles[bubble.type]}`}
      style={
        {
          "--bubble-drift-x": `${bubble.driftX}px`,
          "--bubble-drift-y": `${bubble.driftY}px`,
          "--bubble-duration": `${bubble.duration}ms`,
          left: `${bubble.position.x}%`,
          top: `${bubble.position.y}%`,
        } as CSSProperties
      }
    >
      {bubble.type === "thinking" ? (
        <>
          <span className="absolute -bottom-2 left-7 h-3 w-3 rounded-full bg-white/65" />
          <span className="absolute -bottom-5 left-3 h-2 w-2 rounded-full bg-white/50" />
        </>
      ) : null}
      {bubble.text}
    </div>
  );
}
