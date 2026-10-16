"use client";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <strong>What Are The Odds?</strong> — An educational project exposing the
            mathematical reality of sports betting. Not financial advice.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            If you or someone you know has a gambling problem, call the{" "}
            <strong className="text-zinc-600 dark:text-zinc-300">
              National Council on Problem Gambling: 1-800-522-4700
            </strong>
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            Data is curated for educational purposes. Odds and probabilities are illustrative.
          </p>
        </div>
      </div>
    </footer>
  );
}
