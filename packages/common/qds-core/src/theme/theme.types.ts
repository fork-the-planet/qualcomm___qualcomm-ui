export const QdsBrand = {
  DRAGONWING: "dragonwing",
  QUALCOMM: "qualcomm",
  SNAPDRAGON: "snapdragon",
} as const

export type QdsBrand = (typeof QdsBrand)[keyof typeof QdsBrand]

export const QdsTheme = {
  DARK: "dark",
  LIGHT: "light",
} as const

export type QdsTheme = (typeof QdsTheme)[keyof typeof QdsTheme]
