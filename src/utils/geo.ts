import type { Country, Coordinate } from "../types/geo";

/**
 * Find a country feature by its name from a GeoJSON list.
 */
export const findCountryByName = (
  countries: GeoJSON.Feature[],
  name: string
): GeoJSON.Feature | undefined => {
  return countries.find((country) => country.properties?.name === name);
};

/**
 * Extracts and alphabetically sorts country names from GeoJSON features.
 */
export const getCountryNames = (countries: GeoJSON.Feature[]): string[] => {
  return countries
    .map((country) => country.properties?.name)
    .filter(Boolean)
    .sort();
};

/**
 * Determine if a coordinate is a GeoJSON Position (two numbers).
 */
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

/**
 * Recursively shifts coordinates horizontally by a given amount.
 */
const shiftCoordinates = <C extends Coordinate>(
  coordinates: C,
  shiftBy: number
): C => {
  if (isPosition(coordinates)) {
    return [coordinates[0] + shiftBy, coordinates[1]] as C;
  }
  return coordinates.map((coord) => shiftCoordinates(coord, shiftBy)) as C;
};

/**
 * Shifts a GeoJSON feature’s coordinates horizontally.
 */
const shiftFeature = (
  feature: GeoJSON.Feature,
  shiftBy: number
): GeoJSON.Feature => {
  const shiftedFeature = JSON.parse(JSON.stringify(feature)) as GeoJSON.Feature;

  if (shiftedFeature.geometry.type === "GeometryCollection") {
    return shiftedFeature;
  }

  const geometry = shiftedFeature.geometry;
  geometry.coordinates = shiftCoordinates(geometry.coordinates, shiftBy);
  return shiftedFeature;
};

/**
 * Combines a country with shifted duplicates to handle world wrapping.
 */
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
