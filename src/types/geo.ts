export interface GeoJSONFeature {
  type: "Feature";
  properties: CountryProperties;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface CountryProperties {
  name: string;
}

export interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
