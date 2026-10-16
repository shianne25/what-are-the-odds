"use client";

import type { Scenario } from "@/lib/types";

interface ScenarioPickerProps {
  scenarios: Scenario[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ScenarioPicker({
  scenarios,
  selectedId,
  onSelect,
}: ScenarioPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.id)}
          className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
            selectedId === scenario.id
              ? "border-blue-600 bg-blue-600/10 text-blue-700 dark:text-blue-300"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
          }`}
        >
          <span className="hidden sm:inline">{scenario.matchup}</span>
          <span className="sm:hidden">{scenario.title}</span>
        </button>
      ))}
    </div>
  );
}
