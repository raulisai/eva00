import type { AvatarEmotion } from "@/types/avatar";

export const avatarAnimations: Record<AvatarEmotion, { label: string; intensity: number }> = {
  idle: { label: "Idle", intensity: 0.2 },
  thinking: { label: "Thinking", intensity: 0.45 },
  talking: { label: "Talking", intensity: 0.8 },
  happy: { label: "Happy", intensity: 0.65 },
  alert: { label: "Alert", intensity: 0.9 },
};

export function emotionFromText(text: string): AvatarEmotion {
  const normalized = text.toLowerCase();

  if (normalized.includes("gracias")) {
    return "happy";
  }

  if (normalized.includes("error")) {
    return "alert";
  }

  if (normalized.includes("piensa")) {
    return "thinking";
  }

  if (normalized.includes("habla")) {
    return "talking";
  }

  return "idle";
}
