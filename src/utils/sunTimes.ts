/**
 * Approximate sunrise/sunset calculator using the standard NOAA solar
 * position equations. Turkey observes a fixed UTC+3 offset (no DST since
 * 2016), which is hard-coded here.
 */
const TURKEY_UTC_OFFSET_MIN = 180;

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 1);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((current - start) / 86400000) + 1;
}

export interface SunTimes {
  sunrise: string | null;
  sunset: string | null;
  daylightMinutes: number | null;
}

export function calculateSunTimes(
  lat: number,
  lng: number,
  date: Date,
): SunTimes {
  const rad = Math.PI / 180;
  const n = dayOfYear(date);
  const gamma = ((2 * Math.PI) / 365) * (n - 1);

  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const zenith = 90.833 * rad;
  const latRad = lat * rad;
  const cosHourAngle =
    (Math.cos(zenith) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));

  if (cosHourAngle > 1 || cosHourAngle < -1) {
    return { sunrise: null, sunset: null, daylightMinutes: null };
  }

  const haDeg = Math.acos(cosHourAngle) / rad;
  const solarNoonUTC = 720 - 4 * lng - eqTime;
  const sunriseUTC = solarNoonUTC - 4 * haDeg;
  const sunsetUTC = solarNoonUTC + 4 * haDeg;

  const toLocalTime = (minutesUTC: number): string => {
    let total = Math.round(minutesUTC + TURKEY_UTC_OFFSET_MIN);
    total = ((total % 1440) + 1440) % 1440;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return {
    sunrise: toLocalTime(sunriseUTC),
    sunset: toLocalTime(sunsetUTC),
    daylightMinutes: Math.round(sunsetUTC - sunriseUTC),
  };
}
