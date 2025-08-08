import type { PathOptions } from "leaflet";

/**
 * Generate a large pastel color palette (300+ colors) using HSL.
 */
const generatePastelColors = (): string[] => {
  const colors: string[] = [];
  for (let h = 0; h < 360; h += 3) {
    for (let s = 40; s <= 70; s += 15) {
      for (let l = 75; l <= 90; l += 7.5) {
        colors.push(`hsl(${h}, ${s}%, ${l}%)`);
      }
    }
  }
  return colors;
};

const PASTEL_COLORS = generatePastelColors();

/**
 * Assigns a consistent pastel color to a country based on its name.
 */
export const getCountryColor = (countryName: string): string => {
  let hash = 0;
  for (let i = 0; i < countryName.length; i++) {
    const char = countryName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Keep as 32-bit int
  }
  return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
};

/**
 * Generates Leaflet style options for a given country, adjusting for selection state.
 */
export const getStyle = (
  countryName: string,
  isSelected?: boolean,
  someAreSelected?: boolean
): PathOptions => {
  const baseColor = getCountryColor(countryName);

  if (someAreSelected) {
    if (isSelected) {
      return {
        color: "#ffffff",
        weight: 3,
        fillColor: "#ffffff",
        opacity: 1,
        fillOpacity: 0.7,
      };
    }
    return {
      color: baseColor,
      weight: 1,
      fillColor: baseColor,
      opacity: 0.2,
      fillOpacity: 0.2,
    };
  }

  return {
    color: baseColor,
    weight: 1,
    fillColor: baseColor,
    opacity: 1,
    fillOpacity: 0.4,
  };
};
