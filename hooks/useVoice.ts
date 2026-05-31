"use client";

import { useCallback, useEffect, useState } from "react";

type SpeakOptions = {
  onStart?: () => void;
  onEnd?: () => void;
};

export function useVoice() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const cancel = useCallback(() => {
    if (!supported) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (!supported) {
        options?.onStart?.();
        options?.onEnd?.();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-MX";
      utterance.rate = 1;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setSpeaking(true);
        options?.onStart?.();
      };

      utterance.onend = () => {
        setSpeaking(false);
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        setSpeaking(false);
        options?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  return { cancel, speak, speaking, supported };
}
