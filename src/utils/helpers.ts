import type { PathOptions } from "leaflet";
import type { Coordinate, Country } from "../types/geo";

export const findCountryByName = (
  countries: GeoJSON.Feature[],
  name: string
): GeoJSON.Feature | undefined => {
  return countries.find((country) => country.properties?.name === name);
};

export const getCountryNames = (countries: GeoJSON.Feature[]): string[] => {
  return countries
    .map((country) => country.properties?.name)
    .filter(Boolean)
    .sort();
};

export const formatPopulation = (population?: number): string => {
  if (!population) return "Unknown";
  return population.toLocaleString();
};

export const calculateSunPosition = (
  date: Date,
  latitude: number,
  _longitude: number
) => {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const solarDeclination =
    23.45 * Math.sin((((360 * (284 + dayOfYear)) / 365) * Math.PI) / 180);

  const timeDecimal = date.getHours() + date.getMinutes() / 60;
  const hourAngle = 15 * (timeDecimal - 12);

  const elevation =
    (Math.asin(
      Math.sin((solarDeclination * Math.PI) / 180) *
        Math.sin((latitude * Math.PI) / 180) +
        Math.cos((solarDeclination * Math.PI) / 180) *
          Math.cos((latitude * Math.PI) / 180) *
          Math.cos((hourAngle * Math.PI) / 180)
    ) *
      180) /
    Math.PI;

  return { elevation, declination: solarDeclination };
};

// Generate a large pastel color palette (300+ colors)
const generatePastelColors = (): string[] => {
  const colors: string[] = [];

  // Generate HSL-based pastel colors
  for (let h = 0; h < 360; h += 3) {
    // Every 3 degrees of hue (120 colors)
    for (let s = 40; s <= 70; s += 15) {
      // 3 saturation levels (40%, 55%, 70%)
      for (let l = 75; l <= 90; l += 7.5) {
        // 3 lightness levels (75%, 82.5%, 90%)
        colors.push(`hsl(${h}, ${s}%, ${l}%)`);
      }
    }
  }

  return colors;
};

const PASTEL_COLORS = generatePastelColors();

// Function to get a consistent color for a country based on its name
export const getCountryColor = (countryName: string): string => {
  // Simple hash function to get consistent color for same country
  let hash = 0;
  for (let i = 0; i < countryName.length; i++) {
    const char = countryName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const colorIndex = Math.abs(hash) % PASTEL_COLORS.length;
  return PASTEL_COLORS[colorIndex];
};

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
        fillOpacity: 0.7,
      };
    }

    return {
      color: baseColor,
      weight: 1,
      fillColor: baseColor,
      fillOpacity: 0.2,
    };
  }

  return {
    color: baseColor,
    weight: 2,
    fillColor: baseColor,
    fillOpacity: 0.4,
  };
};

const isPosition = (
  coordinates: Coordinate
): coordinates is GeoJSON.Position => {
  return (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  );
};

const shiftCoordinates = <C extends Coordinate>(
  coordinates: C,
  shiftBy: number
): C => {
  if (isPosition(coordinates)) {
    return [coordinates[0] + shiftBy, coordinates[1]] as C;
  }

  return coordinates.map((coord) => shiftCoordinates(coord, shiftBy)) as C;
};

const shiftFeature = (
  feature: GeoJSON.Feature,
  shiftBy: number
): GeoJSON.Feature => {
  const shiftedFeature = JSON.parse(JSON.stringify(feature)) as GeoJSON.Feature;

  if (shiftedFeature.geometry.type === "GeometryCollection") {
    return shiftedFeature;
  }

  const geometry = shiftedFeature.geometry;
  const coordinates = geometry.coordinates;

  geometry.coordinates = shiftCoordinates(coordinates, shiftBy);
  return shiftedFeature;
};

export const combineFeatures = (
  country: Country,
  duplicates: number = 1
): GeoJSON.FeatureCollection => {
  const shiftedFeatures: GeoJSON.Feature[] = [country.feature];

  for (let i = 1; i <= duplicates; i++) {
    shiftedFeatures.push(shiftFeature(country.feature, -360 * i));
    shiftedFeatures.push(shiftFeature(country.feature, 360 * i));
  }

  return {
    type: "FeatureCollection",
    features: shiftedFeatures,
  };
};
