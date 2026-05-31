"use client";

import { useCallback } from "react";
import { getSimulatedResponse, getThinkingDelay } from "@/lib/simulated-conversation";
import { useAvatarStore } from "@/store/avatarStore";
import { useChatStore } from "@/store/chatStore";
import { useVoice } from "@/hooks/useVoice";
import { MessageBubble } from "./MessageBubble";
import { TextInput } from "./TextInput";
import { VoiceInput } from "./VoiceInput";

export function ChatPanel() {
  const messages = useChatStore((state) => state.messages);
  const isThinking = useChatStore((state) => state.isThinking);
  const addMessage = useChatStore((state) => state.addMessage);
  const setThinking = useChatStore((state) => state.setThinking);
  const setEmotion = useAvatarStore((state) => state.setEmotion);
  const setSpeaking = useAvatarStore((state) => state.setSpeaking);
  const setSpeechText = useAvatarStore((state) => state.setSpeechText);
  const { speak, supported } = useVoice();

  const handleSend = useCallback(
    (input: string) => {
      addMessage({ role: "user", content: input });
      setThinking(true);
      setEmotion("thinking");
      setSpeechText("Procesando respuesta simulada...");

      window.setTimeout(() => {
        const response = getSimulatedResponse(input);
        addMessage({ role: "assistant", content: response.content });
        setThinking(false);
        setSpeechText(response.content);

        speak(response.content, {
          onStart: () => {
            setSpeaking(true);
            setEmotion("talking");
          },
          onEnd: () => {
            setSpeaking(false);
            setEmotion(response.emotion);

            window.setTimeout(() => {
              setEmotion("idle");
              setSpeechText("");
            }, response.emotion === "idle" ? 400 : 1600);
          },
        });
      }, getThinkingDelay());
    },
    [addMessage, setEmotion, setSpeaking, setSpeechText, setThinking, speak],
  );

  return (
    <section className="rounded-2xl border border-white/80 bg-white/75 p-2 shadow-xl shadow-zinc-300/25 backdrop-blur-xl">
      <div className="mb-2 max-h-36 space-y-2 overflow-y-auto px-2 py-1">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isThinking ? <div className="px-3 text-sm text-zinc-400">EVA esta pensando...</div> : null}
      </div>

      <div className="flex items-center gap-2">
        <VoiceInput supported={supported} />
        <TextInput disabled={isThinking} onSend={handleSend} />
      </div>
    </section>
  );
}
