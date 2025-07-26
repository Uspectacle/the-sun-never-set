export const findCountryByName = (
  countries: GeoJSON.Feature[],
  name: string
): GeoJSON.Feature | undefined => {
  return countries.find((country) => country.properties?.name === name);
};

export const getCountryNames = (countries: GeoJSON.Feature[]): string[] => {
  return countries
    .map((country) => country.properties?.name)
    .filter(Boolean)
    .sort();
};

export const formatPopulation = (population?: number): string => {
  if (!population) return "Unknown";
  return population.toLocaleString();
};

export const calculateSunPosition = (
  date: Date,
  latitude: number,
  _longitude: number
) => {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const solarDeclination =
    23.45 * Math.sin((((360 * (284 + dayOfYear)) / 365) * Math.PI) / 180);

  const timeDecimal = date.getHours() + date.getMinutes() / 60;
  const hourAngle = 15 * (timeDecimal - 12);

  const elevation =
    (Math.asin(
      Math.sin((solarDeclination * Math.PI) / 180) *
        Math.sin((latitude * Math.PI) / 180) +
        Math.cos((solarDeclination * Math.PI) / 180) *
          Math.cos((latitude * Math.PI) / 180) *
          Math.cos((hourAngle * Math.PI) / 180)
    ) *
      180) /
    Math.PI;

  return { elevation, declination: solarDeclination };
};
