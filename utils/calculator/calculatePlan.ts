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
