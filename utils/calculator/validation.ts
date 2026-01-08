export function validateForm(form: any) {
  const errors: any = {};

  const required = [
    "distanceKm",
    "durationHours",
    "weightKg",
    "temperatureC",
    "terrain",
    "packWeightKg",
    "sweatRateLPerHour",
    "experienceLevel",
    "goal",
    "hasAidStations",
    "aidStationGapHours",
  ];

  required.forEach((field) => {
    if (!form[field]) {
      errors[`${field}Error`] = "This field should not be empty!";
    }
  });

  return errors;
}
