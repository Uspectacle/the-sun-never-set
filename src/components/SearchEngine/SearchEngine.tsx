import React, { useState, useRef, useEffect } from "react";
import "./SearchEngine.css";
import type { Country } from "../../types/geo";

interface SearchEngineProps {
  countries: Country[];
  selectedCountry: Country | null;
  onCountrySelect: (entity: Country | null) => void;
  loading: boolean;
}

const SearchEngine: React.FC<SearchEngineProps> = ({
  countries,
  onCountrySelect,
  loading,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = countries.filter((entity) => {
        const searchText = `${entity.name} ${entity.year}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
      setSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, countries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      onCountrySelect(null);
    }
  };

  const handleSuggestionClick = (entity: Country) => {
    setQuery(`${entity.year} ${entity.name}`);
    setShowSuggestions(false);
    onCountrySelect(entity);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    onCountrySelect(null);
    inputRef.current?.focus();
  };

  return (
    <div className="search-engine">
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Search countries and empires... (e.g., '1800 British' or 'Roman Empire')"
          className="search-input"
          disabled={loading}
        />
        {query && (
          <button onClick={handleClear} className="search-clear" type="button">
            ×
          </button>
        )}
        {loading && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="search-suggestions">
          {suggestions.map((entity, index) => (
            <div
              key={entity.id}
              className={`search-suggestion ${
                index === highlightedIndex ? "highlighted" : ""
              }`}
              onClick={() => handleSuggestionClick(entity)}
            >
              <div className="suggestion-main">
                <span className="suggestion-year">{entity.year}</span>
                <span className="suggestion-name">{entity.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {query && suggestions.length === 0 && !loading && (
        <div className="search-no-results">No results found for "{query}"</div>
      )}
    </div>
  );
};

export default SearchEngine;
