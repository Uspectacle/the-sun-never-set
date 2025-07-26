import React from "react";
import { getCountryNames } from "../../utils/helpers";
import "./CountrySelector.css";

interface CountrySelectorProps {
  countries: GeoJSON.Feature[];
  selectedCountry: string;
  onCountrySelect: (countryName: string) => void;
  loading: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onCountrySelect,
  loading,
}) => {
  const countryNames = getCountryNames(countries);

  return (
    <div className="country-selector">
      <select
        value={selectedCountry}
        onChange={(e) => onCountrySelect(e.target.value)}
        className="country-select"
        disabled={loading}
      >
        <option value="">Select a country...</option>
        {countryNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {loading && (
        <div className="loading-indicator">
          <span>Loading borders...</span>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
