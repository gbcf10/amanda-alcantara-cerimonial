export const SESSION_COOKIE_NAME = "amanda_admin_session";
export const BRIDE_SESSION_COOKIE_NAME = "amanda_bride_session";

export const REACTION_TYPES = [
  { value: "amei", emoji: "❤️", label: "Amei" },
  { value: "parabens", emoji: "🎉", label: "Parabéns" },
  { value: "fofo", emoji: "🥰", label: "Fofo" },
  { value: "bravo", emoji: "👏", label: "Bravo" },
] as const;

export type ReactionType = (typeof REACTION_TYPES)[number]["value"];
