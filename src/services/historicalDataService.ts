import type { HistoricalEntity, HistoricalProperties } from "../types";
import {
  AVAILABLE_YEARS,
  HISTORICAL_BASE_URL,
  YEAR_TO_FILENAME,
} from "../utils/constants";

export const fetchHistoricalData = async (
  year: number
): Promise<HistoricalEntity[]> => {
  try {
    const filename = YEAR_TO_FILENAME[year];
    if (!filename) {
      throw new Error(`No data available for year ${year}`);
    }

    const response = await fetch(`${HISTORICAL_BASE_URL}${filename}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch historical data for ${year}: ${response.status}`
      );
    }

    const data: GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      HistoricalProperties
    > = await response.json();

    return data.features
      .filter((feature) => feature.properties.NAME)
      .map((feature, index) => ({
        id: `hist_${year}_${index}`,
        name: feature.properties.NAME,
        year,
        type: determineEntityType(feature.properties),
        properties: {
          NAME: feature.properties.NAME,
          YEAR: year,
        },
        geometry: feature.geometry,
      }));
  } catch (error) {
    console.error(`Error fetching historical data for ${year}:`, error);
    throw error;
  }
};

const determineEntityType = (
  properties: any
): "country" | "empire" | "region" | "civilization" => {
  const name = properties.NAME?.toLowerCase() || "";
  const subjecto = properties.SUBJECTO?.toLowerCase() || "";

  if (name.includes("empire") || subjecto.includes("empire")) return "empire";
  if (name.includes("civilization") || name.includes("culture"))
    return "civilization";
  if (properties.PARTOF) return "region";
  return "country";
};

export const fetchAllHistoricalData = async (): Promise<HistoricalEntity[]> => {
  const allEntities: HistoricalEntity[] = [];

  for (const year of [600]) {
    try {
      const entities = await fetchHistoricalData(year);
      allEntities.push(...entities);
    } catch (error) {
      console.warn(`Failed to load data for year ${year}:`, error);
    }
  }

  return allEntities;
};
