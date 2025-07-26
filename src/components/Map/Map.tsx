import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { MAP_STYLES } from "../../utils/constants";
import "./Map.css";
import type { Empire } from "../../types/geo";

interface MapProps {
  selectedEmpire: Empire | null;
  mapStyle?: any;
}

const Map: React.FC<MapProps> = ({ selectedEmpire, mapStyle }) => {
  const defaultStyle = {
    color: "#ff6b6b",
    weight: 2,
    fillColor: "#ff6b6b",
    fillOpacity: 0.3,
  };

  const currentStyle = mapStyle || defaultStyle;

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="map"
        style={{ background: "#1a1a1a" }}
      >
        <TileLayer
          url={MAP_STYLES.DARK}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {selectedEmpire && (
          <GeoJSON
            key={`${Date.now()}`}
            data={selectedEmpire.feature}
            style={currentStyle}
            onEachFeature={(feature, layer) => {
              const props = feature.properties;
              const name = props.NAME;
              const year = props.YEAR || 2025;
              const subjecto = props.SUBJECTO;
              const partOf = props.PARTOF;

              let popupContent = `
                <div style="color: black; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold;">${name}</h3>
                  <p style="margin: 4px 0;"><strong>Year:</strong> ${year}</p>
              `;

              if (subjecto && subjecto !== name) {
                popupContent += `<p style="margin: 4px 0;"><strong>Controlled by:</strong> ${subjecto}</p>`;
              }

              if (partOf) {
                popupContent += `<p style="margin: 4px 0;"><strong>Part of:</strong> ${partOf}</p>`;
              }

              if (props.POP_EST) {
                popupContent += `<p style="margin: 4px 0;"><strong>Population:</strong> ${props.POP_EST.toLocaleString()}</p>`;
              }

              if (props.BORDERPRECISION) {
                const precision =
                  props.BORDERPRECISION === 1
                    ? "Approximate"
                    : props.BORDERPRECISION === 2
                    ? "Moderate"
                    : "Precise";
                popupContent += `<p style="margin: 4px 0; font-size: 0.8em; color: #666;"><strong>Border precision:</strong> ${precision}</p>`;
              }

              popupContent += `</div>`;

              layer.bindPopup(popupContent);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
