export const MAP_STYLES = {
  DARK: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  LIGHT: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  SATELLITE:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
} as const;

export const HISTORICAL_BASE_URL =
  "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/";

export const YEAR_TO_FILENAME: Record<number, string> = {
  100: "world_100.geojson",
  1000: "world_1000.geojson",
  1100: "world_1100.geojson",
  1200: "world_1200.geojson",
  1279: "world_1279.geojson",
  1300: "world_1300.geojson",
  1400: "world_1400.geojson",
  1492: "world_1492.geojson",
  1500: "world_1500.geojson",
  1530: "world_1530.geojson",
  1600: "world_1600.geojson",
  1650: "world_1650.geojson",
  1700: "world_1700.geojson",
  1715: "world_1715.geojson",
  1783: "world_1783.geojson",
  1800: "world_1800.geojson",
  1815: "world_1815.geojson",
  1880: "world_1880.geojson",
  1900: "world_1900.geojson",
  1914: "world_1914.geojson",
  1920: "world_1920.geojson",
  1930: "world_1930.geojson",
  1938: "world_1938.geojson",
  1945: "world_1945.geojson",
  1960: "world_1960.geojson",
  1994: "world_1994.geojson",
  200: "world_200.geojson",
  2000: "world_2000.geojson",
  2010: "world_2010.geojson",
  300: "world_300.geojson",
  400: "world_400.geojson",
  500: "world_500.geojson",
  600: "world_600.geojson",
  700: "world_700.geojson",
  800: "world_800.geojson",
  900: "world_900.geojson",
  [-1]: "world_bc1.geojson",
  [-100]: "world_bc100.geojson",
  [-1000]: "world_bc1000.geojson",
  [-10000]: "world_bc10000.geojson",
  [-123000]: "world_bc123000.geojson",
  [-1500]: "world_bc1500.geojson",
  [-200]: "world_bc200.geojson",
  [-2000]: "world_bc2000.geojson",
  [-300]: "world_bc300.geojson",
  [-3000]: "world_bc3000.geojson",
  [-323]: "world_bc323.geojson",
  [-400]: "world_bc400.geojson",
  [-4000]: "world_bc4000.geojson",
  [-500]: "world_bc500.geojson",
  [-5000]: "world_bc5000.geojson",
  [-700]: "world_bc700.geojson",
  [-8000]: "world_bc8000.geojson",
};

export const AVAILABLE_YEARS = Object.keys(
  YEAR_TO_FILENAME
) as unknown as number[];

export const ENTITY_COLORS = {
  modern: "#ff6b6b",
  historical: "#4ecdc4",
  empire: "#f39c12",
  civilization: "#9b59b6",
};
