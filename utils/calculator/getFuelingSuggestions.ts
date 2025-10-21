import { PlanResult } from "./calculatePlan";

export function getFuelingSuggestions(result: PlanResult): string[] {
  const suggestions: string[] = [];

  const gelsPerHour = Math.max(1, Math.round(result.hourly.calories / 100));
  suggestions.push(
    `Consume about ${gelsPerHour} energy gel${
      gelsPerHour > 1 ? "s" : ""
    } per hour.`
  );

  if (result.hourly.hydration <= 0.5) {
    suggestions.push(
      "Drink small sips of water (100–150 ml) every 20 minutes."
    );
  } else if (result.hourly.hydration <= 0.8) {
    suggestions.push("Drink 150–200 ml of fluid every 15 minutes.");
  } else {
    suggestions.push(
      "Drink 200–250 ml every 10–15 minutes to stay hydrated in warm conditions."
    );
  }

  if (result.hourly.sodium > 500) {
    suggestions.push(
      "Add 1 electrolyte tablet (~500–600 mg sodium) every hour."
    );
  } else {
    suggestions.push(
      "Use electrolyte drink mix with ~400–500 mg sodium per liter."
    );
  }

  if (result.totalCalories > 3000) {
    suggestions.push(
      "Use a mix of gels and carb drink to reach your calorie needs."
    );
  } else {
    suggestions.push(
      "Gels or small snacks should be enough for this distance."
    );
  }

  if (result.totalHydration > 4) {
    suggestions.push(
      "Consider adding extra sodium in hot weather (up to 1000 mg/L)."
    );
  }

  return suggestions;
}
