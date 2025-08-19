type HistoricalBasemapsProperties = {
  NAME: string | null;
  PART_OF: string | null;
  BORDER_PRECISION: number | null;
};

export type Coordinate = GeoJSON.Position | Coordinate[];

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

export type DateTimeSettings = {
  timeFormat: "12h" | "24h";
  dateFormat: "MM/DD" | "DD/MM" | "YYYY-MM-DD";
};