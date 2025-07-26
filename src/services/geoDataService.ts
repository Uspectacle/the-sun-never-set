import type { GeoJSONCollection, Empire } from "../types";

export const fetchCountries = async (): Promise<GeoJSONCollection> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch countries data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error("Unable to load country data. Please try again later.");
  }
};

// export const fetchHistoricalEmpire = async (
//   empireType: EmpireType,
//   year?: number
// ): Promise<Empire | null> => {
//   try {
//     console.log(`Fetching ${empireType} data for year ${year || "current"}`);
//     // TODO: Implement actual API call to historical-basemaps
//     return null;
//   } catch (error) {
//     console.error("Error fetching historical empire:", error);
//     return null;
//   }
// };
