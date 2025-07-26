export interface HistoricalEntity {
  id: string;
  name: string;
  year: number;
  type: "country" | "empire" | "region" | "civilization";
  properties: HistoricalProperties;
  geometry: GeoJSON.Geometry;
}

export interface HistoricalProperties {
  NAME: string;
  SUBJECTO?: string; // Colonial power or controlling entity
  PARTOF?: string; // Larger cultural area
  BORDERPRECISION?: 1 | 2 | 3; // 1=approximate, 2=moderate, 3=precise
  CONTINENT?: string;
  REGION?: string;
  YEAR: number;
}

export interface SearchableEntity {
  id: string;
  displayName: string; // "2025 - Djibouti" or "600 - Saami"
  name: string;
  year: number;
  type: "modern" | "historical";
  entity: any; // GeoJSONFeature or HistoricalEntity
}
