export function formatNumber(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("tr-TR").format(value);
}

export function formatArea(km2: number | undefined): string {
  if (km2 === undefined) return "—";
  return `${formatNumber(km2)} km²`;
}

export function formatElevation(m: number | undefined): string {
  if (m === undefined) return "—";
  return `${formatNumber(m)} m`;
}

export function formatPlate(code: string): string {
  return code.padStart(2, "0");
}

export function formatAreaCode(code: string): string {
  return `0${code}`;
}

export function pluralizeDistrict(count: number | undefined): string {
  if (!count) return "";
  return `${count} ilçe`;
}
