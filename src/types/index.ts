import type { Empire } from "./empire";
import type { GeoJSONFeature } from "./geo";

export * from "./geo";
export * from "./empire";

export interface AppState {
  countries: GeoJSONFeature[];
  selectedCountry: string;
  selectedBorders: GeoJSONFeature | null;
  selectedEmpire: Empire | null;
  loading: boolean;
  error: string | null;
}

export interface TimeState {
  currentTime: number;
  isAnimating: boolean;
  animationSpeed: number;
}
