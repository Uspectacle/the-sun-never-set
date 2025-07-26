import React from "react";
import type { SearchableEntity } from "../../types";
import { formatPopulation } from "../../utils/helpers";
import "./InfoPanel.css";

interface InfoPanelProps {
  selectedEntity: SearchableEntity;
  selectedBorders: any;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedEntity,
  selectedBorders,
}) => {
  const props = selectedBorders.properties;
  const isHistorical = selectedEntity.type === "historical";

  return (
    <div className={`info-panel ${selectedEntity.type}`}>
      <div className="info-header">
        <h3 className="info-title">{selectedEntity.name}</h3>
        <div className="info-year-badge">{selectedEntity.year}</div>
      </div>

      <div className="info-content">
        <div className="info-section">
          <h4>Basic Information</h4>

          {props.POP_EST && (
            <p className="info-item">
              <span className="info-label">Population:</span>
              <span className="info-value">
                {formatPopulation(props.POP_EST)}
              </span>
            </p>
          )}

          <p className="info-item">
            <span className="info-label">Type:</span>
            <span className="info-value">
              {isHistorical ? "Historical Entity" : "Modern Country"}
            </span>
          </p>

          {props.CONTINENT && (
            <p className="info-item">
              <span className="info-label">Continent:</span>
              <span className="info-value">{props.CONTINENT}</span>
            </p>
          )}
        </div>

        {isHistorical && (
          <div className="info-section">
            <h4>Historical Context</h4>

            {props.SUBJECTO && props.SUBJECTO !== selectedEntity.name && (
              <p className="info-item">
                <span className="info-label">Controlled by:</span>
                <span className="info-value">{props.SUBJECTO}</span>
              </p>
            )}

            {props.PARTOF && (
              <p className="info-item">
                <span className="info-label">Part of:</span>
                <span className="info-value">{props.PARTOF}</span>
              </p>
            )}

            {props.BORDERPRECISION && (
              <p className="info-item">
                <span className="info-label">Border precision:</span>
                <span className="info-value">
                  {props.BORDERPRECISION === 1
                    ? "Approximate"
                    : props.BORDERPRECISION === 2
                    ? "Moderate"
                    : "Precise"}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="info-next">
          <div className="progress-indicator">
            <div className="progress-step completed">✓ Historical Data</div>
            <div className="progress-step">→ Sun Illumination</div>
            <div className="progress-step">→ Globe Effect</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
