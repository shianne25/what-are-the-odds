"use client";

import { useBetState } from "@/hooks/useBetState";
import Header from "@/components/Header";
import ScenarioPicker from "@/components/ScenarioPicker";
import BetBuilder from "@/components/BetBuilder";
import BetSlip from "@/components/BetSlip";
import Simulator from "@/components/Simulator";
import Footer from "@/components/Footer";

export default function Home() {
  const {
    isRealityMode,
    selectedScenario,
    selectedScenarioId,
    scenarios,
    activeLegs,
    activeLegIds,
    wagerAmount,
    mathResult,
    toggleLeg,
    selectAllLegs,
    clearLegs,
    selectScenario,
    setWagerAmount,
    toggleRealityMode,
  } = useBetState();

  // Calculate payout multiplier for simulator (decimal odds - 1)
  const payoutMultiplier = mathResult.combinedDecimalOdds > 0
    ? mathResult.combinedDecimalOdds - 1
    : 0;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header isRealityMode={isRealityMode} onToggle={toggleRealityMode} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {/* Scenario Picker */}
        <div className="mb-6">
          <ScenarioPicker
            scenarios={scenarios}
            selectedId={selectedScenarioId}
            onSelect={selectScenario}
          />
        </div>

        {/* Main Two-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Bet Builder */}
          <BetBuilder
            scenario={selectedScenario}
            isRealityMode={isRealityMode}
            activeLegIds={activeLegIds}
            onToggleLeg={toggleLeg}
            onSelectAll={selectAllLegs}
            onClear={clearLegs}
          />

          {/* Right Column: Bet Slip */}
          <BetSlip
            isRealityMode={isRealityMode}
            wager={wagerAmount}
            onWagerChange={setWagerAmount}
            mathResult={mathResult}
            scenarioTitle={selectedScenario.title}
          />
        </div>

        {/* Simulator */}
        <div className="mt-6">
          <Simulator
            isRealityMode={isRealityMode}
            winProbability={mathResult.trueProbability}
            payoutMultiplier={payoutMultiplier}
            wagerAmount={wagerAmount}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
