import React, { useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { MAP_STYLES } from "../../utils/constants";
import "./Map.css";
import type {
  Country,
  Empire,
  HistoricalBasemapsFeature,
} from "../../types/geo";
import { getCountryColor } from "../../utils/helpers";
import TerminatorLayer from "./TerminatorLayer";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";

interface MapProps {
  countries: Country[];
  onCountrySelected: (country: Country | null) => unknown;
  selectedEmpire: Empire | null;
}

const LeafletMap: React.FC<MapProps> = ({
  selectedEmpire,
  countries,
  onCountrySelected,
}) => {
  const selectedEmpireRef = useRef(selectedEmpire);

  selectedEmpireRef.current = selectedEmpire;

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

        <TerminatorLayer />

        <MapClickHandler onMapClick={() => onCountrySelected(null)} />

        {countries.map((country, index) => {
          const isSelected = country.empireName === selectedEmpire?.empireName;
          const baseColor = getCountryColor(country.name);

          const currentStyle = {
            color: isSelected ? "#ffffff" : baseColor,
            weight: isSelected ? 3 : 2,
            fillColor: baseColor,
            fillOpacity: isSelected ? 0.7 : 0.4,
          };

          return (
            <GeoJSON
              key={`${country.name}-${index}`}
              data={country.feature}
              style={currentStyle}
              onEachFeature={(feature: HistoricalBasemapsFeature, layer) => {
                layer.bindTooltip(
                  () => {
                    const properties = feature.properties;

                    return `
                      <div>
                        <strong>${properties.NAME || "Unknown"}</strong><br/>
                        ${
                          properties.ABBREVN
                            ? `Abbreviation: ${properties.ABBREVN}<br/>`
                            : ""
                        }
                        ${
                          properties.SUBJECTO
                            ? `Subject: ${properties.SUBJECTO}<br/>`
                            : ""
                        }
                        ${
                          properties.PARTOF
                            ? `Part of: ${properties.PARTOF}<br/>`
                            : ""
                        }
                        ${
                          properties.BORDERPRECISION !== null
                            ? `Border Precision: ${properties.BORDERPRECISION}`
                            : ""
                        }
                      </div>
                    `;
                  },
                  {
                    permanent: false,
                    direction: "auto",
                    className: "country-tooltip",
                    interactive: false,
                  }
                );

                layer.on("click", (leafletEvent: L.LeafletMouseEvent) => {
                  L.DomEvent.stopPropagation(leafletEvent);

                  const isCurrentlySelected =
                    country.empireName ===
                    selectedEmpireRef.current?.empireName;

                  onCountrySelected(isCurrentlySelected ? null : country);
                });
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
