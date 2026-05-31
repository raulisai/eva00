"use client";

import { useAvatarStore } from "@/store/avatarStore";

export function SpeechBubble() {
  const speechText = useAvatarStore((state) => state.speechText);
  const emotion = useAvatarStore((state) => state.emotion);

  if (!speechText) {
    return null;
  }

  return (
    <div className="relative rounded-2xl border border-white/80 bg-white/70 px-5 py-4 text-sm text-zinc-700 shadow-xl shadow-zinc-300/25 backdrop-blur-xl">
      <div className="absolute -right-2 bottom-6 h-4 w-4 rotate-45 bg-white/70" />
      <div className="flex items-center gap-4">
        <div className="flex h-8 items-center gap-1 text-teal-500">
          <span className="h-3 w-1 rounded-full bg-current" />
          <span className="h-6 w-1 rounded-full bg-current" />
          <span className="h-4 w-1 rounded-full bg-current" />
          <span className="h-7 w-1 rounded-full bg-current" />
          <span className="h-3 w-1 rounded-full bg-current" />
        </div>
        <div>
          <div>{speechText}</div>
          <div className="mt-2 flex gap-1 text-teal-500" aria-hidden="true">
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="h-1 w-1 rounded-full bg-current" />
          </div>
        </div>
      </div>
      <span className="sr-only">{emotion}</span>
    </div>
  );
}
