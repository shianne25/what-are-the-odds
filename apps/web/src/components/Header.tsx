"use client";

interface HeaderProps {
  isRealityMode: boolean;
  onToggle: () => void;
}

export default function Header({ isRealityMode, onToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-black text-sm">
            ?
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              WHAT ARE THE ODDS?
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Exposing sportsbook mathematics
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`group relative flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition-all duration-300 ${
            isRealityMode
              ? "border-red-600 bg-red-600/10 text-red-600 dark:text-red-400"
              : "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isRealityMode ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
          />
          {isRealityMode ? "TRUTH MODE" : "SPORTSBOOK MODE"}
          <span className="text-[10px] font-medium opacity-60">
            (click to flip)
          </span>
        </button>
      </div>
    </header>
  );
}
