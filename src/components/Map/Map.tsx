import React, { useRef } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { MAP_STYLES } from "../../utils/constants";
import "./Map.css";
import type {
  Country,
  Empire,
  HistoricalBasemapsFeature,
} from "../../types/geo";
import TerminatorLayer from "./TerminatorLayer";
import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";
import CountryLayer from "./CountryLayer";

interface MapProps {
  countries: Country[];
  onCountrySelected: (country: Country | null) => unknown;
  selectedEmpire: Empire | null;
  onFeatureHover?: (feature: HistoricalBasemapsFeature | null) => void;
  date: Date;
}

const LeafletMap: React.FC<MapProps> = ({
  selectedEmpire,
  countries,
  onCountrySelected,
  onFeatureHover,
  date,
}) => {
  const selectedEmpireRef = useRef(selectedEmpire);
  selectedEmpireRef.current = selectedEmpire;

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="map"
        worldCopyJump
        zoomControl={false}
        style={{ background: "#1a1a1a" }}
      >
        <TileLayer
          url={MAP_STYLES.DARK}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        <TerminatorLayer date={date} />
        <MapClickHandler onMapClick={() => onCountrySelected(null)} />
        {countries.map((country, index) => (
          <CountryLayer
            key={`${country.name}-${index}`}
            country={country}
            index={index}
            selectedEmpire={selectedEmpire}
            onCountrySelected={onCountrySelected}
            onCountryHovered={onFeatureHover}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
