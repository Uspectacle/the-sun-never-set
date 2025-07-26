import type {
  IlluminationData,
  GeoJSONFeature,
  TerritoryIllumination,
} from "../types";
import { calculateSunPosition } from "../utils/helpers";

export class IlluminationService {
  static calculateTerritoryIllumination(
    territories: GeoJSONFeature[],
    timestamp: number
  ): IlluminationData {
    const date = new Date(timestamp);
    const territoryData: TerritoryIllumination[] = [];
    let totalIlluminated = 0;

    territories.forEach((territory) => {
      const illumination = this.calculateSingleTerritoryIllumination(
        territory,
        date
      );
      territoryData.push(illumination);
      totalIlluminated += illumination.illuminatedPercentage;
    });

    return {
      timestamp,
      illuminatedPercentage:
        territories.length > 0 ? totalIlluminated / territories.length : 0,
      territoryData,
    };
  }

  private static calculateSingleTerritoryIllumination(
    territory: GeoJSONFeature,
    date: Date
  ): TerritoryIllumination {
    const bounds = this.calculateBounds(territory);
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;

    const sunPos = calculateSunPosition(date, centerLat, centerLng);
    const isIlluminated = sunPos.elevation > 0;

    return {
      territoryId: territory.properties.name,
      illuminatedPercentage: isIlluminated ? 100 : 0,
      bounds,
    };
  }

  private static calculateBounds(_territory: GeoJSONFeature) {
    // Simplified bounds calculation
    return {
      north: 90,
      south: -90,
      east: 180,
      west: -180,
    };
  }
}
