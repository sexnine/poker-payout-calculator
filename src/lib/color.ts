export const PLAYER_COLORS = [
  "pink",
  "blue",
  "green",
  "yellow",
  "red",
  "orange",
  "purple",
  "teal",
  "rose",
];
export type PlayerColor = (typeof PLAYER_COLORS)[number];

export const COLOR_CLASSES: Record<PlayerColor, { text: string; bg: string }> = {
  pink: {
    text: "text-pink-500",
    bg: "bg-pink-500",
  },
  blue: {
    text: "text-blue-500",
    bg: "bg-blue-500",
  },
  green: {
    text: "text-green-500",
    bg: "bg-green-500",
  },
  yellow: {
    text: "text-yellow-500",
    bg: "bg-yellow-500",
  },
  red: {
    text: "text-red-500",
    bg: "bg-red-500",
  },
  orange: {
    text: "text-orange-500",
    bg: "bg-orange-500",
  },
  purple: {
    text: "text-purple-500",
    bg: "bg-purple-500",
  },
  teal: {
    text: "text-teal-500",
    bg: "bg-teal-500",
  },
  rose: {
    text: "text-rose-900",
    bg: "bg-rose-900",
  },
};
