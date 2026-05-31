"use client";

import type { AvatarEmotion } from "@/types/avatar";
import { useAvatarStore } from "@/store/avatarStore";

const controls: AvatarEmotion[] = ["idle", "thinking", "talking", "happy", "alert"];

export function AvatarController() {
  const emotion = useAvatarStore((state) => state.emotion);
  const loadState = useAvatarStore((state) => state.loadState);
  const setEmotion = useAvatarStore((state) => state.setEmotion);
  const reset = useAvatarStore((state) => state.reset);

  return (
    <section className="rounded-xl border border-white/70 bg-white/55 p-3 shadow-lg shadow-zinc-300/20 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold text-zinc-500">Estado</h2>
        <span className="text-xs text-teal-600">{loadState}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {controls.map((item) => (
          <button
            className={`rounded-full px-3 py-1.5 text-xs capitalize transition ${
              emotion === item
                ? "bg-teal-500 text-white shadow-sm"
                : "bg-white/80 text-zinc-500 hover:bg-white hover:text-teal-600"
            }`}
            key={item}
            onClick={() => setEmotion(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <button
          className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-500 transition hover:bg-white hover:text-teal-600"
          onClick={reset}
          type="button"
        >
          reset
        </button>
      </div>
    </section>
  );
}
