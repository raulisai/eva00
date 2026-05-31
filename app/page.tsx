import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { AvatarController } from "@/components/avatar/AvatarController";
import { SpeechBubble } from "@/components/avatar/SpeechBubble";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#eee8e1] p-2 text-zinc-800">
      <div className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-xl border border-black/10 bg-[#f7f2ed] shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.92),transparent_28%),linear-gradient(90deg,rgba(255,255,255,0.58),transparent_42%)]" />
        <div className="pointer-events-none absolute bottom-12 left-28 hidden h-64 w-52 opacity-25 md:block">
          <div className="absolute bottom-0 left-12 h-20 w-24 rounded-t-full bg-white shadow-sm" />
          <div className="absolute bottom-16 left-16 h-28 w-2 rotate-[-18deg] rounded-full bg-teal-500/30" />
          <div className="absolute bottom-24 left-8 h-20 w-12 rotate-[-34deg] rounded-full bg-teal-500/25" />
          <div className="absolute bottom-28 left-20 h-24 w-12 rotate-[28deg] rounded-full bg-teal-500/25" />
        </div>
        <div className="pointer-events-none absolute bottom-16 right-12 hidden items-end gap-3 opacity-25 md:flex">
          <div className="h-28 w-5 rounded-sm bg-slate-400/45" />
          <div className="h-36 w-5 rounded-sm bg-teal-400/35" />
          <div className="h-24 w-5 rounded-sm bg-rose-300/40" />
          <div className="h-20 w-24 rounded-sm border-8 border-white/80 bg-slate-200/70" />
        </div>

        <Sidebar />

        <section className="absolute inset-0">
          <AvatarCanvas />
        </section>

        <div className="absolute left-[18%] top-[25%] z-10 hidden w-64 sm:block">
          <SpeechBubble />
        </div>

        <div className="absolute right-5 top-5 z-20 w-[min(480px,calc(100vw-120px))]">
          <AvatarController />
        </div>

        <div className="absolute bottom-7 left-1/2 z-20 w-[min(520px,calc(100vw-120px))] -translate-x-1/2">
          <ChatPanel />
        </div>
      </div>
    </main>
  );
}
