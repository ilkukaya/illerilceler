export type AccentColor =
  "blue" | "green" | "purple" | "orange" | "pink" | "cyan";

export const accentClasses: Record<AccentColor, { bg: string; text: string }> =
  {
    blue: { bg: "bg-brand-sky", text: "text-brand-blue" },
    green: { bg: "bg-brand-green-soft", text: "text-brand-green" },
    purple: { bg: "bg-brand-purple-soft", text: "text-brand-primary" },
    orange: { bg: "bg-brand-orange-soft", text: "text-brand-orange" },
    pink: { bg: "bg-brand-pink-soft", text: "text-brand-pink" },
    cyan: { bg: "bg-brand-cyan-soft", text: "text-brand-cyan" },
  };
