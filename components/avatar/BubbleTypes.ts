export type SpeechBubbleType = "thinking" | "talking" | "happy" | "alert" | "system" | "idle";

export type SpeechBubblePosition = {
  x: number;
  y: number;
};

export type SpeechBubbleItem = {
  id: string;
  text: string;
  type: SpeechBubbleType;
  position: SpeechBubblePosition;
  driftX: number;
  driftY: number;
  duration: number;
};

export const bubbleCopy: Record<SpeechBubbleType, string[]> = {
  idle: ["Lista para ayudarte.", "Esperando instrucciones."],
  thinking: ["Analizando...", "Buscando informacion...", "Comparando opciones..."],
  talking: ["Ya tengo una respuesta.", "Puedo ayudarte con eso.", "Encontré varias opciones."],
  happy: ["Perfecto.", "Excelente.", "Lo encontré."],
  alert: ["Confirmacion requerida.", "Accion sensible detectada."],
  system: ["Procesando...", "Navegando...", "Preparando respuesta..."],
};
