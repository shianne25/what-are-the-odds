"use client";

import { useState, useCallback, useMemo } from "react";
import type { Scenario, BetMathResult } from "@/lib/types";
import { calculateBetMath } from "@/lib/betMath";
import scenariosData from "@/data/scenarios.json";

const scenarios = scenariosData as Scenario[];

export function useBetState() {
  const [isRealityMode, setIsRealityMode] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[0].id);
  const [activeLegIds, setActiveLegIds] = useState<string[]>([]);
  const [wagerAmount, setWagerAmount] = useState(25);

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0],
    [selectedScenarioId]
  );

  const activeLegs = useMemo(
    () => selectedScenario.legs.filter((leg) => activeLegIds.includes(leg.id)),
    [selectedScenario, activeLegIds]
  );

  const mathResult: BetMathResult = useMemo(
    () => calculateBetMath(activeLegs, wagerAmount),
    [activeLegs, wagerAmount]
  );

  const toggleLeg = useCallback((legId: string) => {
    setActiveLegIds((prev) =>
      prev.includes(legId) ? prev.filter((id) => id !== legId) : [...prev, legId]
    );
  }, []);

  const selectAllLegs = useCallback(() => {
    setActiveLegIds(selectedScenario.legs.map((l) => l.id));
  }, [selectedScenario]);

  const clearLegs = useCallback(() => {
    setActiveLegIds([]);
  }, []);

  const selectScenario = useCallback((scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setActiveLegIds([]);
  }, []);

  const toggleRealityMode = useCallback(() => {
    setIsRealityMode((prev) => !prev);
  }, []);

  return {
    // State
    isRealityMode,
    selectedScenario,
    selectedScenarioId,
    scenarios,
    activeLegs,
    activeLegIds,
    wagerAmount,
    mathResult,

    // Actions
    toggleLeg,
    selectAllLegs,
    clearLegs,
    selectScenario,
    setWagerAmount,
    toggleRealityMode,
  };
}
