export function Sidebar() {
  return (
    <aside className="absolute left-3 top-3 z-30 hidden h-[calc(100%-24px)] w-20 rounded-2xl border border-white/80 bg-white/70 p-3 shadow-xl shadow-zinc-300/30 backdrop-blur-xl md:block">
      <div className="flex h-full flex-col items-center justify-between py-4">
        <nav className="flex flex-col gap-8 text-2xl text-zinc-400">
          <button className="rounded-xl bg-teal-50 p-3 text-teal-500" aria-label="Inicio" type="button">
            ⌂
          </button>
          <button className="p-2" aria-label="Notas" type="button">
            ♡
          </button>
          <button className="p-2" aria-label="Mundo" type="button">
            ◌
          </button>
          <button className="p-2" aria-label="Sistema" type="button">
            ⚙
          </button>
        </nav>
        <div className="flex flex-col items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          <span className="h-3 w-3 rounded-full bg-rose-300" />
        </div>
      </div>
    </aside>
  );
}
