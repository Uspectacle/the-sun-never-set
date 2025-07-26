import React from "react";
import type { GeoJSONFeature } from "../../types";
import "./InfoPanel.css";

interface InfoPanelProps {
  selectedBorders: GeoJSONFeature;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedBorders }) => {
  const country = selectedBorders.properties;

  return (
    <div className="info-panel">
      <h3 className="info-title">{country.name}</h3>
      <div className="info-content">
        <div className="info-next">
          Next: Add historical empire data and sun illumination
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
