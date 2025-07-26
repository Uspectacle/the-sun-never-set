import type {
  GeoJSONFeature,
  HistoricalEntity,
  SearchableEntity,
} from "../types";

export class SearchService {
  static createSearchableEntities(
    modernCountries: GeoJSONFeature[],
    historicalEntities: HistoricalEntity[]
  ): SearchableEntity[] {
    const entities: SearchableEntity[] = [];

    // Add modern countries
    modernCountries.forEach((country, index) => {
      entities.push({
        id: `modern_${index}`,
        displayName: `2025 - ${country.properties.name}`,
        name: country.properties.name,
        year: 2025,
        type: "modern",
        entity: country,
      });
    });

    // Add historical entities
    historicalEntities.forEach((entity) => {
      entities.push({
        id: entity.id,
        displayName: `${entity.year} - ${entity.name}`,
        name: entity.name,
        year: entity.year,
        type: "historical",
        entity: entity,
      });
    });

    return entities.sort((a, b) => {
      // Sort by year (descending), then by name
      if (a.year !== b.year) return b.year - a.year;
      return a.name.localeCompare(b.name);
    });
  }

  static filterEntities(
    entities: SearchableEntity[],
    query: string
  ): SearchableEntity[] {
    if (!query.trim()) return entities;

    const searchTerms = query.toLowerCase().trim().split(" ");

    return entities.filter((entity) => {
      const searchableText =
        `${entity.name} ${entity.year} ${entity.displayName}`.toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }

  static getEntitySuggestions(
    entities: SearchableEntity[],
    query: string,
    limit = 10
  ): SearchableEntity[] {
    const filtered = this.filterEntities(entities, query);
    return filtered.slice(0, limit);
  }
}
