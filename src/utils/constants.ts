export const EMPIRES = {
  BRITISH: "british-empire",
  FRENCH: "french-empire",
  SPANISH: "spanish-empire",
  PORTUGUESE: "portuguese-empire",
  OTTOMAN: "ottoman-empire",
  MONGOL: "mongol-empire",
  ROMAN: "roman-empire",
} as const;

export type EmpireType = (typeof EMPIRES)[keyof typeof EMPIRES];

export const HISTORICAL_PERIODS: Record<
  EmpireType,
  { start: number; end: number; peak: number }
> = {
  [EMPIRES.BRITISH]: { start: 1583, end: 1997, peak: 1922 },
  [EMPIRES.FRENCH]: { start: 1534, end: 1980, peak: 1929 },
  [EMPIRES.SPANISH]: { start: 1492, end: 1898, peak: 1790 },
  [EMPIRES.PORTUGUESE]: { start: 1415, end: 1999, peak: 1815 },
  [EMPIRES.OTTOMAN]: { start: 1299, end: 1922, peak: 1683 },
  [EMPIRES.MONGOL]: { start: 1206, end: 1368, peak: 1279 },
  [EMPIRES.ROMAN]: { start: -27, end: 1453, peak: 117 },
};

export const MAP_STYLES = {
  DARK: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  LIGHT: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  SATELLITE:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
} as const;

export const COUNTRY_STYLE = {
  color: "#ff6b6b",
  weight: 2,
  fillColor: "#ff6b6b",
  fillOpacity: 0.3,
};

export const EMPIRE_STYLE = {
  color: "#4ecdc4",
  weight: 2,
  fillColor: "#4ecdc4",
  fillOpacity: 0.4,
};
