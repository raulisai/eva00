"use client";

import { useEffect, useRef } from "react";
import { useAvatarStore } from "@/store/avatarStore";
import { useSpeechBubbleStore } from "@/store/speechBubbleStore";
import { FloatingBubble } from "./FloatingBubble";

function shortResponse(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentence = clean.split(/[.!?]/)[0];
  return sentence.length > 52 ? `${sentence.slice(0, 49)}...` : sentence || clean;
}

export function SpeechBubbleContainer() {
  const emotion = useAvatarStore((state) => state.emotion);
  const isSpeaking = useAvatarStore((state) => state.isSpeaking);
  const speechText = useAvatarStore((state) => state.speechText);
  const bubbles = useSpeechBubbleStore((state) => state.bubbles);
  const spawnAlertBubble = useSpeechBubbleStore((state) => state.spawnAlertBubble);
  const spawnHappyBubble = useSpeechBubbleStore((state) => state.spawnHappyBubble);
  const spawnIdleBubble = useSpeechBubbleStore((state) => state.addBubble);
  const spawnTalkingBubble = useSpeechBubbleStore((state) => state.spawnTalkingBubble);
  const spawnThinkingBubble = useSpeechBubbleStore((state) => state.spawnThinkingBubble);
  const lastSpeechRef = useRef("");

  useEffect(() => {
    if (emotion === "thinking") {
      spawnThinkingBubble();
      const intervalId = window.setInterval(() => spawnThinkingBubble(), 1100);
      return () => window.clearInterval(intervalId);
    }

    if (emotion === "happy") {
      spawnHappyBubble();
    }

    if (emotion === "alert") {
      spawnAlertBubble();
    }
  }, [emotion, spawnAlertBubble, spawnHappyBubble, spawnThinkingBubble]);

  useEffect(() => {
    if (!isSpeaking || !speechText || lastSpeechRef.current === speechText) {
      return;
    }

    lastSpeechRef.current = speechText;
    spawnTalkingBubble(shortResponse(speechText));
  }, [isSpeaking, speechText, spawnTalkingBubble]);

  useEffect(() => {
    if (emotion !== "idle") {
      return;
    }

    const schedule = () => window.setTimeout(() => {
      if (useAvatarStore.getState().emotion === "idle") {
        spawnIdleBubble("idle");
      }
      timeoutId = schedule();
    }, 20000 + Math.random() * 10000);

    let timeoutId = schedule();
    return () => window.clearTimeout(timeoutId);
  }, [emotion, spawnIdleBubble]);

  return (
    <div aria-label="Avatar Expression Zone" className="pointer-events-none absolute inset-x-[10%] top-[8%] z-10 h-[48%]">
      {bubbles.map((bubble) => (
        <FloatingBubble bubble={bubble} key={bubble.id} />
      ))}
    </div>
  );
}
