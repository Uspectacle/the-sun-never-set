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
      features.push(turf.polygon(geometry.coordinates));
      break;
    case "MultiPolygon":
      features.push(turf.multiPolygon(geometry.coordinates));
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

  const multiCoords = empire.countries.flatMap((country) =>
    extractPolygons(country.feature.geometry).flatMap((feature) => {
      const geom = feature.geometry;

      if (geom.type === "Polygon") {
        return [geom.coordinates];
      } else if (geom.type === "MultiPolygon") {
        return geom.coordinates;
      }
      return [];
    })
  );

  const empireMultiPolygon = turf.multiPolygon(multiCoords);

  const simplifiedEmpire = turf.simplify(empireMultiPolygon, { tolerance: 1 });
  const totalArea = turf.area(simplifiedEmpire);
  const term = terminator();

  for (let hourIndex = 0; hourIndex <= 24; hourIndex++) {
    const dateAtHour = new Date(baseDate);
    dateAtHour.setHours(hourIndex, 0, 0, 0);
    term.setTime(dateAtHour);

    const intersection = turf.intersect(
      turf.featureCollection([simplifiedEmpire, term.toGeoJSON()])
    );

    const illuminatedArea = intersection ? turf.area(intersection) : 0;
    const illuminationPercent = (1 - illuminatedArea / totalArea) * 100;

    // Simulate delay (optional)
    await new Promise((res) => setTimeout(res, 100));

    yield illuminationPercent;
  }
}
