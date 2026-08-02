import type { Coordinates } from "@/types";

const EARTH_RADIUS_KM = 6371;
const ROAD_WINDING_FACTOR = 1.3;
const AVERAGE_SPEED_KMH = 85;
const AVERAGE_CONSUMPTION_L_PER_100KM = 7;
const FUEL_PRICE_TRY_PER_L = 42;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle ("kuş uçuşu") distance in km using the Haversine formula. */
export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_KM * c;
}

/** Approximate road distance from great-circle distance (demo heuristic, not live routing data). */
export function estimateRoadDistanceKm(straightLineKm: number): number {
  return straightLineKm * ROAD_WINDING_FACTOR;
}

export function estimateDurationHours(roadKm: number): number {
  return roadKm / AVERAGE_SPEED_KMH;
}

export function formatDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} dk`;
  return `${h} saat ${m > 0 ? `${m} dk` : ""}`.trim();
}

export function estimateFuelLiters(roadKm: number): number {
  return (roadKm / 100) * AVERAGE_CONSUMPTION_L_PER_100KM;
}

export function estimateFuelCostTRY(liters: number): number {
  return liters * FUEL_PRICE_TRY_PER_L;
}
