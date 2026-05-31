"use client";

type VoiceInputProps = {
  supported?: boolean;
};

export function VoiceInput({ supported }: VoiceInputProps) {
  return (
    <button
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-50 text-lg text-teal-600"
      disabled
      title="Entrada por voz pendiente para una fase futura"
      aria-label={supported ? "TTS activo" : "TTS no disponible"}
      type="button"
    >
      ♫
    </button>
  );
}
