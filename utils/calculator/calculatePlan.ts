export interface RunInput {
  distanceKm: number;
  durationHours: number;
  weightKg: number;
  temperatureC: number;
  sweatRateLPerHour?: number;
  experienceLevel: "Beginner" | "Intermediate" | "Elite";
}

export interface PlanResult {
  totalCalories: number;
  totalHydration: number;
  totalSodiumMg: number;
  totalPotassiumMg: number;
  totalMagnesiumMg: number;
  hourly: {
    calories: number;
    hydration: number;
    sodium: number;
    potassium: number;
    magnesium: number;
  };
}

// Calculate Advanced Plan
export type Experience = "Beginner" | "Intermediate" | "Elite";

export interface AdvancedInput {
  distanceKm: number;
  durationHours: number;
  weightKg: number;
  temperatureC: number;
  humidityPct?: number; // optional, 0-100
  paceMinPerKm?: number; // optional, if provided derive pace factor
  terrain?: "flat" | "rolling" | "mountain";
  packWeightKg?: number; // optional additional load
  sweatRateLPerHour?: number | null; // user-known sweat rate overrides estimate
  experience?: Experience;
  goal?: "finish" | "performance"; // conservative vs aggressive fueling
  hasAidStations?: number;
  aidStationGapHours?: number;
}

export interface HourlyPlan {
  hourIndex: number; // 1..n
  calories: number;
  carbsGrams: number;
  fluidsL: number;
  sodiumMg: number;
  notes?: string;
}

export interface AdvancedResult {
  distanceKm: number;
  durationHours: number;
  weightKg: number;
  temperatureC: number;
  totalCalories: number;
  caloriesPerHour: number;
  totalFluidsL: number;
  fluidsPerHour: number;
  totalSodiumMg: number;
  sodiumPerHourMg: number;
  totalCarbsGrams: number;
  carbsPerHourGrams: number;
  terrain: string;
  hourly: HourlyPlan[];
  raw: {
    sweatRateLPerHourUsed?: number;
    sodiumMgPerLUsed?: number;
    assumptions: Record<string, any>;
  };
  packing: {
    packCalories: number;
    packCarbsGrams: number;
    packFluidsL: number;
    packSodiumMg: number;
    notes: string;
    totalRaceCarbs: number;
    totalRaceFluids: number;
    totalRaceSodium: number;
    hasAidStations: boolean;
    aidStationGapHours: number;
    perStation: {
      carbsGrams: number;
      fluidsL: number;
      sodiumMg: number;
    } | null;
  };
}

export function calculateNutritionPlan(input: RunInput): PlanResult {
  const {
    distanceKm,
    durationHours,
    weightKg,
    temperatureC,
    sweatRateLPerHour,
    experienceLevel,
  } = input;

  const baseCaloriesPerHour = 9 * (weightKg / 10);
  const effortFactor =
    experienceLevel === "Beginner"
      ? 1.0
      : experienceLevel === "Intermediate"
        ? 0.9
        : 0.8;
  const caloriesPerHour = baseCaloriesPerHour * effortFactor;
  const totalCalories = caloriesPerHour * durationHours;

  let hydrationPerHour = 0.6;
  if (temperatureC > 25) hydrationPerHour += 0.3;
  if (temperatureC > 30) hydrationPerHour += 0.5;
  if (temperatureC < 10) hydrationPerHour -= 0.2;
  if (sweatRateLPerHour) hydrationPerHour = sweatRateLPerHour;
  const totalHydration = hydrationPerHour * durationHours;

  const sodiumMgPerL = temperatureC > 25 ? 700 : 500;
  const totalSodiumMg = sodiumMgPerL * totalHydration;
  const potassiumMg = totalSodiumMg * 0.25;
  const magnesiumMg = totalSodiumMg * 0.05;

  const hourly = {
    calories: Math.round(totalCalories / durationHours),
    hydration: Number(hydrationPerHour.toFixed(2)),
    sodium: Math.round(totalSodiumMg / durationHours),
    potassium: Math.round(potassiumMg / durationHours),
    magnesium: Math.round(magnesiumMg / durationHours),
  };

  return {
    totalCalories: Math.round(totalCalories),
    totalHydration: Number(totalHydration.toFixed(2)),
    totalSodiumMg: Math.round(totalSodiumMg),
    totalPotassiumMg: Math.round(potassiumMg),
    totalMagnesiumMg: Math.round(magnesiumMg),
    hourly,
  };
}

export function calculateAdvancedPlan(input: AdvancedInput): AdvancedResult {
  const {
    distanceKm,
    durationHours,
    weightKg,
    temperatureC,
    humidityPct = 50,
    paceMinPerKm,
    terrain = "flat",
    packWeightKg = 0,
    sweatRateLPerHour,
    experience = "Intermediate",
    goal = "finish",
    hasAidStations,
    aidStationGapHours = 2,
  } = input;

  // ✅ Define thresholds
  const isShortEffort = durationHours < 0.75; // Under 45 min
  const isMediumEffort = durationHours < 1.5; // Under 90 min
  const needsCarbs = durationHours >= 0.75; // Carbs only needed 45min+
  const needsSodium = durationHours >= 1.0; // Sodium only needed 60min+

  // --- ENERGY (calories) ---------------------------------------------------
  let kcalPerKgPerKm = 1.0;
  if (terrain === "rolling") kcalPerKgPerKm *= 1.05;
  if (terrain === "mountain") kcalPerKgPerKm *= 1.12;

  const packFactor = 1 + Math.min(0.25, packWeightKg / Math.max(20, weightKg));
  kcalPerKgPerKm *= packFactor;

  const experienceFactor =
    experience === "Beginner"
      ? 1.05
      : experience === "Intermediate"
        ? 1.0
        : 0.95;
  kcalPerKgPerKm *= experienceFactor;

  const totalCalories = Math.round(weightKg * distanceKm * kcalPerKgPerKm);
  const caloriesPerHour =
    durationHours > 0
      ? Math.round(totalCalories / durationHours)
      : totalCalories;

  const MAX_ABSORBABLE_KCAL_PER_HOUR = 300;

  const displayCaloriesPerHour =
    durationHours >= 1
      ? Math.min(caloriesPerHour, MAX_ABSORBABLE_KCAL_PER_HOUR)
      : caloriesPerHour;

  // --- SWEAT RATE ----------------------------------------------------------
  let estimatedSweatRate = 0.7;
  if (temperatureC > 15)
    estimatedSweatRate += 0.25 * Math.floor((temperatureC - 15) / 5);
  if ((humidityPct ?? 0) > 70) estimatedSweatRate += 0.2;
  if (paceMinPerKm) {
    if (paceMinPerKm <= 5) estimatedSweatRate += 0.2;
    else if (paceMinPerKm >= 7) estimatedSweatRate -= 0.1;
  }
  const sweatUsed = sweatRateLPerHour ?? Number(estimatedSweatRate.toFixed(2));

  // --- FLUIDS --------------------------------------------------------------
  const replaceFraction = goal === "performance" ? 0.85 : 0.75;
  const fluidsPerHour = Number((sweatUsed * replaceFraction).toFixed(2));
  const totalFluidsL = Number((fluidsPerHour * durationHours).toFixed(2));

  // --- SODIUM --------------------------------------------------------------
  let sodiumMgPerL = 600;
  if (temperatureC >= 25) sodiumMgPerL = 700;
  if (temperatureC >= 30) sodiumMgPerL = 800;
  if ((humidityPct ?? 0) > 80) sodiumMgPerL += 50;

  // ✅ No sodium needed for short efforts
  const totalSodiumMg = needsSodium
    ? Math.round(sodiumMgPerL * totalFluidsL)
    : 0;
  const sodiumPerHourMg = needsSodium
    ? Math.min(1000, Math.round(totalSodiumMg / Math.max(1, durationHours)))
    : 0;

  // --- CARBS ---------------------------------------------------------------
  // ✅ No carbs needed under 45 minutes
  let carbsPerHour = 0;

  if (needsCarbs) {
    if (durationHours < 1.5)
      carbsPerHour = 30; // 45-90 min: minimal
    else if (durationHours < 2)
      carbsPerHour = 45; // 90-120 min: moderate
    else if (durationHours <= 4)
      carbsPerHour = 60; // 2-4 hours: standard
    else carbsPerHour = goal === "performance" ? 90 : 75; // 4h+: high

    if (experience === "Elite")
      carbsPerHour = Math.min(120, Math.round(carbsPerHour * 1.15));
    if (experience === "Beginner")
      carbsPerHour = Math.max(30, Math.round(carbsPerHour * 0.9));
  }

  const totalCarbs = Math.round(carbsPerHour * durationHours);

  // --- HOURLY NOTES --------------------------------------------------------
  function getHourlyNote(
    i: number,
    isShort: boolean,
    isMedium: boolean,
    needsCarbs: boolean,
  ): string {
    // ✅ Short effort - minimal fueling needed
    if (isShort) {
      return "💧 Hydrate well before the effort. Water only during — no food needed for runs under 45 min.";
    }

    // ✅ Medium effort - light fueling
    if (isMedium) {
      return i === 1
        ? "💧 Start hydrating early. Small sips every 15-20 min — no solid food needed yet."
        : "🥤 Optional: electrolyte drink if hot. Keep sipping water every 15-20 min.";
    }

    // ✅ Long effort - standard fueling
    return i === 1
      ? "🍌 Start fueling in first 20-30 min — banana half or gel + 200 ml water."
      : i === 2
        ? "🥤 1 gel + 250 ml electrolyte drink — maintain steady carb intake."
        : i === 3
          ? "🍞 Small energy bar or rice cake + 200 ml water — add some solids."
          : i === 4
            ? "🥤 1 gel + 250 ml electrolyte drink — keep sodium steady."
            : i === 5
              ? "🍪 Half energy bar or dates + 250 ml water — add variety."
              : i === 6
                ? "🥤 1 gel + small piece of fruit from checkpoint + 200 ml drink."
                : i === 7
                  ? "🍞 Small solid (half sandwich or bar) + 200 ml water."
                  : i === 8
                    ? "🥤 1 gel + caffeine (if used) + 250 ml electrolyte drink."
                    : i === 9
                      ? "🍌 Banana or soft chew + 250 ml drink — check for stomach comfort."
                      : i === 10
                        ? "🥤 1 gel + 250 ml electrolyte drink — keep moving consistently."
                        : i > 10 && i % 3 === 0
                          ? "🍪 Small solid snack + 200 ml drink — small energy boost."
                          : "🥤 1 gel + 200 ml water or electrolyte drink — maintain rhythm.";
  }

  // --- Build hourly plan ---------------------------------------------------
  const hours = Math.max(1, Math.ceil(durationHours));
  const hourly: HourlyPlan[] = [];

  for (let i = 1; i <= hours; i++) {
    // ✅ For partial last hour, scale values proportionally
    const isLastHour = i === hours;
    const lastHourFraction = durationHours % 1 === 0 ? 1 : durationHours % 1;
    const fraction = isLastHour && lastHourFraction > 0 ? lastHourFraction : 1;

    hourly.push({
      hourIndex: i,
      calories: Math.round(displayCaloriesPerHour * fraction),
      carbsGrams: Math.round(carbsPerHour * fraction),
      fluidsL: Number((fluidsPerHour * fraction).toFixed(2)),
      sodiumMg: Math.round(sodiumPerHourMg * fraction),
      notes: getHourlyNote(i, isShortEffort, isMediumEffort, needsCarbs),
    });
  }

  // --- Packing logic -------------------------------------------------------
  const selfCarryFraction = hasAidStations
    ? Math.min(1, aidStationGapHours / durationHours)
    : 1;

  const packCalories = Math.round(totalCalories * selfCarryFraction);
  const packCarbsGrams = Math.round(totalCarbs * selfCarryFraction);
  const packFluidsL = Number((totalFluidsL * selfCarryFraction).toFixed(2));
  const packSodiumMg = Math.round(totalSodiumMg * selfCarryFraction);

  const packingPerStation = hasAidStations
    ? {
        carbsGrams: Math.round(carbsPerHour * aidStationGapHours),
        fluidsL: Number((fluidsPerHour * aidStationGapHours).toFixed(2)),
        sodiumMg: Math.round(sodiumPerHourMg * aidStationGapHours),
      }
    : null;

  const packingNotes = isShortEffort
    ? "Short effort — no nutrition packing needed. Bring a small water bottle."
    : hasAidStations
      ? `Carry between each aid station (every ${aidStationGapHours}h): ~${packCarbsGrams}g carbs, ${packFluidsL}L fluids. Total race: ~${totalCarbs}g carbs, ${totalFluidsL}L fluids.`
      : `No aid stations — full self-support. Carry all: ~${packCarbsGrams}g carbs, ${packFluidsL}L fluids.`;

  return {
    distanceKm,
    durationHours,
    weightKg,
    temperatureC,
    totalCalories,
    terrain,
    caloriesPerHour: displayCaloriesPerHour,
    totalFluidsL,
    fluidsPerHour,
    totalSodiumMg,
    sodiumPerHourMg,
    totalCarbsGrams: totalCarbs,
    carbsPerHourGrams: carbsPerHour,
    hourly,
    raw: {
      sweatRateLPerHourUsed: sweatUsed,
      sodiumMgPerLUsed: sodiumMgPerL,
      assumptions: {
        kcalPerKgPerKm,
        packFactor,
        experienceFactor,
        replaceFraction,
        actualCaloriesPerHour: caloriesPerHour,
        displayCaloriesPerHour,
      },
    },
    packing: {
      packCalories,
      packCarbsGrams,
      packFluidsL,
      packSodiumMg,
      notes: packingNotes,
      totalRaceCarbs: totalCarbs, // ✅ Add total race values
      totalRaceFluids: totalFluidsL,
      totalRaceSodium: totalSodiumMg,
      hasAidStations: !!hasAidStations,
      aidStationGapHours,
      perStation: packingPerStation,
    },
  };
}
