import type { Country } from "../types/geo";

export class SearchService {
  static filterEntities(countries: Country[], query: string): Country[] {
    if (!query.trim()) return countries;

    const searchTerms = query.toLowerCase().trim().split(" ");

    return countries.filter((country) => {
      const searchableText = `${country.name} ${country.year}`.toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }

  static getEntitySuggestions(
    countries: Country[],
    query: string,
    limit = 10
  ): Country[] {
    const filtered = this.filterEntities(countries, query);
    return filtered.slice(0, limit);
  }
}
