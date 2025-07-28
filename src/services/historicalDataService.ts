import type {
  Country,
  Empire,
  HistoricalBasemapsFeatureCollection,
} from "../types/geo";
import { HISTORICAL_BASE_URL, YEAR_TO_FILENAME } from "../utils/constants";

export const fetchCountries = async (year: number): Promise<Country[]> => {
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

    const data: HistoricalBasemapsFeatureCollection = await response.json();

    return data.features
      .filter((feature) => feature.properties.NAME)
      .map((feature, index) => ({
        id: `${year}_${index}`,
        name: feature.properties.NAME!,
        year,
        empireName:
          feature.properties.SUBJECTO ||
          feature.properties.PARTOF ||
          feature.properties.NAME!,
        feature: feature,
      }));
  } catch (error) {
    console.error(`Error fetching historical data for ${year}:`, error);
    throw error;
  }
};

export const parseEmpires = (countries: Country[]): Map<string, Empire> => {
  const empires = new Map<string, Empire>();

  countries.forEach((country) => {
    const empireName = country.empireName;
    const empire = empires.get(empireName) ?? {
      ...(country.name === empireName
        ? country
        : countries.find(({ name }) => name === empireName) ?? country),
      countries: [],
    };

    empire.countries.push(country);
    empires.set(empireName, empire);
  });

  return empires;
};
