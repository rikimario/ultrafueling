export interface Plan {
  id?: string;
  user_id?: string;
  created_at?: string;
  result: {
    durationHours: number;
    distanceKm: number;
  };
}

export interface PlanResult {
  durationHours: number;
  distanceKm: number;
}
