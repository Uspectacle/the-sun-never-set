/**
 * Formats a population number with commas, or "Unknown" if not provided.
 */
export const formatPopulation = (population?: number): string => {
  if (!population) return "Unknown";
  return population.toLocaleString();
};
