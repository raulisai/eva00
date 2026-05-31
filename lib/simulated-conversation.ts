import type { AvatarEmotion } from "@/types/avatar";
import { emotionFromText } from "./avatar-animations";

const replies: Record<AvatarEmotion, string[]> = {
  idle: [
    "Estoy lista para ayudarte.",
    "Por ahora estoy funcionando en modo MVP sin conexion al backend.",
  ],
  thinking: ["Dejame revisar eso."],
  talking: ["Claro, puedo hablar contigo en modo local."],
  happy: ["Perfecto, esa accion se puede preparar."],
  alert: ["Atencion, esta accion necesitaria confirmacion mas adelante."],
};

export function getSimulatedResponse(input: string) {
  const emotion = emotionFromText(input);
  const options = replies[emotion];
  const content = options[Math.floor(Math.random() * options.length)];

  return { content, emotion };
}

export function getThinkingDelay() {
  return 1000 + Math.floor(Math.random() * 1000);
}
