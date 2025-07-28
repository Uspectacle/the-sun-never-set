export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

type HistoricalBasemapsProperties = {
  NAME: string | null;
  ABBREVN: string | null;
  SUBJECTO: string | null;
  PARTOF: string | null;
  BORDERPRECISION: number | null;
};

export type HistoricalBasemapsFeature = GeoJSON.Feature<
  GeoJSON.Geometry,
  HistoricalBasemapsProperties
>;

export type HistoricalBasemapsFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  HistoricalBasemapsProperties
>;

export type Country = {
  id: string;
  name: string;
  year: number;
  empireName: string;
  feature: HistoricalBasemapsFeature;
};

export type Empire = Country & {
  countries: Country[];
};

export type EmpireMap = Map<string, Empire>;

export type YearData = [Country[], EmpireMap];
