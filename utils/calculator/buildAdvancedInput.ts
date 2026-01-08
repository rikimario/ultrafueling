export function buildAdvancedInput(form: any) {
  return {
    distanceKm: Number(form.distanceKm),
    durationHours: Number(form.durationHours),
    weightKg: Number(form.weightKg),
    temperatureC: Number(form.temperatureC),

    terrain: form.terrain as "flat" | "rolling" | "mountain",
    packWeightKg: Number(form.packWeightKg),
    sweatRateLPerHour: Number(form.sweatRateLPerHour),

    experienceLevel: form.experienceLevel as
      | "Beginner"
      | "Intermediate"
      | "Elite",

    goal: form.goal as "finish" | "performance",

    hasAidStations: Number(form.hasAidStations),
    aidStationGapHours: Number(form.aidStationGapHours),
  };
}
