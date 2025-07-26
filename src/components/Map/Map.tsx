import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { CountryProperties, GeoJSONFeature } from "../../types";
import { COUNTRY_STYLE, MAP_STYLES } from "../../utils/constants";
import "./Map.css";

interface MapProps {
  selectedBorders: GeoJSONFeature | null;
}

const Map: React.FC<MapProps> = ({ selectedBorders }) => {
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

        {selectedBorders && (
          <GeoJSON
            key={selectedBorders.properties.name}
            data={selectedBorders}
            style={COUNTRY_STYLE}
            onEachFeature={(
              feature: GeoJSON.Feature<GeoJSON.Geometry, CountryProperties>,
              layer
            ) => {
              layer.bindPopup(`
                <div style="color: black;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold;">${feature.properties.name}</h3>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
