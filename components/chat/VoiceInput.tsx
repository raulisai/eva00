"use client";

import { useState } from "react";

type VoiceInputProps = {
  supported?: boolean;
};

export function VoiceInput({ supported }: VoiceInputProps) {
  const [listening, setListening] = useState(false);

  return (
    <button
      aria-label={listening ? "Desactivar microfono" : "Activar microfono"}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
        listening ? "bg-teal-500 text-white shadow-md shadow-teal-500/20" : "bg-teal-50 text-teal-600 hover:bg-teal-100"
      }`}
      onClick={() => setListening((value) => !value)}
      title={supported ? "Control de microfono" : "Microfono en modo visual"}
      type="button"
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 14.5a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5.5a3 3 0 0 0 3 3Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M18 11.5a6 6 0 0 1-12 0M12 17.5V21M9 21h6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
