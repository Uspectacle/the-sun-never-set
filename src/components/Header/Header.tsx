import React from "react";
import SearchEngine from "../SearchEngine/SearchEngine";
import "./Header.css";
import type { Country } from "../../types/geo";

interface HeaderProps {
  countries: Country[];
  selectedCountry: Country | null;
  onCountrySelect: (entity: Country | null) => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  countries,
  selectedCountry,
  onCountrySelect,
  loading,
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">The Sun Never Sets</h1>
        <div className="header-subtitle">
          Explore {countries.length} countries and empires throughout history
        </div>
        <SearchEngine
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={onCountrySelect}
          loading={loading}
        />
      </div>
    </header>
  );
};

export default Header;
