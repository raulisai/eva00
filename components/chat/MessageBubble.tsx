import type { ChatMessage } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (!isUser) {
    return (
      <div className="relative max-w-sm rounded-[28px] border border-white/80 bg-white/80 px-5 py-4 text-sm leading-6 text-zinc-600 shadow-xl shadow-zinc-300/25 backdrop-blur-xl">
        <span className="absolute -bottom-2 right-10 h-4 w-4 rounded-full bg-white/80" />
        <span className="absolute -bottom-6 right-4 h-2.5 w-2.5 rounded-full bg-white/75" />
        {message.content}
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-teal-500 px-3 py-2 text-sm text-white shadow-sm">
        {message.content}
      </div>
    </div>
  );
}
