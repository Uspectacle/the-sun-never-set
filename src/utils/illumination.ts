import terminator from "@joergdietrich/leaflet.terminator";
import type { Empire } from "../types/geo";
import * as turf from "@turf/turf";

/** Extracts polygons from geometry */
function extractPolygons(
  geometry: GeoJSON.Geometry
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[] {
  const features: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[] =
    [];

  switch (geometry.type) {
    case "Polygon":
      features.push(turf.polygon(geometry.coordinates as number[][][]));
      break;
    case "MultiPolygon":
      features.push(turf.multiPolygon(geometry.coordinates as number[][][][]));
      break;
    case "GeometryCollection":
      for (const geom of geometry.geometries) {
        features.push(...extractPolygons(geom));
      }
      break;
    default:
      // Ignore other types
      break;
  }

  return features;
}

export function generateTimeLabels() {
  return Array.from(
    { length: 25 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
}

export async function* calculateIlluminationDataStream(
  empire: Empire,
  baseDate: Date
): AsyncGenerator<number, void, void> {
  if (!empire || !empire.countries.length) {
    for (let i = 0; i < 25; i++) yield 0;
    return;
  }

  const countryPolygons: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon
  >[] = [];
  let totalArea = 0;

  for (const country of empire.countries) {
    const polygons = extractPolygons(country.feature.geometry);
    for (const poly of polygons) {
      countryPolygons.push(poly);
      totalArea += turf.area(poly);
    }
  }

  if (totalArea === 0) {
    for (let i = 0; i < 25; i++) yield 0;
    return;
  }

  const multiCoords = countryPolygons.flatMap((feature) => {
    if (feature.geometry.type === "Polygon") {
      return [feature.geometry.coordinates];
    } else if (feature.geometry.type === "MultiPolygon") {
      return feature.geometry.coordinates;
    }
    return [];
  });

  const empireMultiPolygon = turf.multiPolygon(multiCoords);
  const simplifiedEmpire = turf.simplify(empireMultiPolygon, { tolerance: 1 });
  const term = terminator();

  for (let hourIndex = 0; hourIndex <= 24; hourIndex++) {
    const dateAtHour = new Date(baseDate);
    dateAtHour.setHours(hourIndex, 0, 0, 0);
    term.setTime(dateAtHour);

    const intersection = turf.intersect(
      turf.featureCollection([simplifiedEmpire, term.toGeoJSON()])
    );

    const illuminatedArea = intersection ? turf.area(intersection) : 0;
    const illuminationPercent = (illuminatedArea / totalArea) * 100;

    // Simulate delay (optional)
    await new Promise((res) => setTimeout(res, 100));

    yield illuminationPercent;
  }
}
