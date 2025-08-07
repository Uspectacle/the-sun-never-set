import React from "react";
import "./CountryInfo.css";
import type { HistoricalBasemapsFeature } from "../../types/geo";

interface CountryInfoProps {
  feature: HistoricalBasemapsFeature | null;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ feature }) => {
  if (!feature) return null;

  const properties = feature.properties;

  return (
    <div className="country-info">
      <div className="country-info-content">
        <h2>{properties.NAME || "Unknown"}</h2>
        {properties.ABBREVN && (
          <div className="info-row">
            <span className="label">Abbreviation:</span>
            <span className="value">{properties.ABBREVN}</span>
          </div>
        )}
        {properties.SUBJECTO && (
          <div className="info-row">
            <span className="label">Subject:</span>
            <span className="value">{properties.SUBJECTO}</span>
          </div>
        )}
        {properties.PARTOF && (
          <div className="info-row">
            <span className="label">Part of:</span>
            <span className="value">{properties.PARTOF}</span>
          </div>
        )}
        {properties.BORDERPRECISION !== null && (
          <div className="info-row">
            <span className="label">Border Precision:</span>
            <span className="value">{properties.BORDERPRECISION}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryInfo;
