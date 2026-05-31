"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type TextInputProps = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export function TextInput({ disabled, onSend }: TextInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = value.trim();

    if (!message) {
      return;
    }

    onSend(message);
    setValue("");
  }

  return (
    <form className="flex flex-1 items-center gap-2" onSubmit={handleSubmit}>
      <input
        aria-label="Mensaje para EVA"
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Pregunta algo..."
        type="text"
        value={value}
      />
      <button
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-500 text-lg text-white shadow-md shadow-teal-500/20 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-zinc-300"
        disabled={disabled}
        aria-label="Enviar"
        type="submit"
      >
        ↗
      </button>
    </form>
  );
}
