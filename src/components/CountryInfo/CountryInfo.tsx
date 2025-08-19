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
        {properties.PART_OF && (
          <div className="info-row">
            <span className="label">Part of:</span>
            <span className="value">{properties.PART_OF}</span>
          </div>
        )}
        {properties.BORDER_PRECISION !== null && (
          <div className="info-row">
            <span className="label">Border Precision:</span>
            <span className="value">{properties.BORDER_PRECISION}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryInfo;
