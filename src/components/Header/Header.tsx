import React from "react";
import CountrySelector from "../CountrySelector/CountrySelector";
import type { GeoJSONFeature } from "../../types";
import "./Header.css";

interface HeaderProps {
  countries: GeoJSONFeature[];
  selectedCountry: string;
  onCountrySelect: (countryName: string) => void;
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
        <h1 className="header-title">The Sun Never Sets on the Empire</h1>
        <CountrySelector
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
