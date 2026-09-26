export type AccentColor = "blue" | "green" | "purple" | "orange" | "pink" | "cyan";

/**
 * Accent names are kept for template compatibility, but every accent now maps
 * to the same restrained treatment (no pastel rainbow tiles).
 */
const neutral = { bg: "bg-surface-muted", text: "text-brand-primary" };

export const accentClasses: Record<AccentColor, { bg: string; text: string }> = {
  blue: neutral,
  green: neutral,
  purple: neutral,
  orange: neutral,
  pink: neutral,
  cyan: neutral,
};
