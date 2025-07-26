import type { GeoJSONFeature } from "./geo";
import type { HistoricalEntity, SearchableEntity } from "./historical";

export * from "./geo";
export * from "./empire";
export * from "./historical";

export interface AppState {
  modernCountries: GeoJSONFeature[];
  historicalEntities: HistoricalEntity[];
  searchableEntities: SearchableEntity[];
  selectedEntity: SearchableEntity | null;
  selectedBorders: any | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredEntities: SearchableEntity[];
}
