import type { GeoJSONFeature, MapBounds } from "./geo";

export interface Empire {
  id: string;
  name: string;
  period: {
    start: number;
    end: number;
    peak: number;
  };
  territories: GeoJSONFeature[];
  capital?: string;
  description?: string;
  color?: string;
}

export interface IlluminationData {
  timestamp: number;
  illuminatedPercentage: number;
  territoryData: TerritoryIllumination[];
}

export interface TerritoryIllumination {
  territoryId: string;
  illuminatedPercentage: number;
  bounds: MapBounds;
}
