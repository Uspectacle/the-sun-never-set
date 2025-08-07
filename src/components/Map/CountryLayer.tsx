import React, { useRef } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import type {
  Country,
  Empire,
  HistoricalBasemapsFeature,
} from "../../types/geo";
import { combineFeatures, getStyle } from "../../utils/helpers";

interface CountryLayerProps {
  country: Country;
  index: number;
  selectedEmpire: Empire | null;
  onCountrySelected: (country: Country | null) => void;
  onCountryHovered?: (feature: HistoricalBasemapsFeature | null) => void;
}

const CountryLayer: React.FC<CountryLayerProps> = ({
  country,
  index,
  selectedEmpire,
  onCountrySelected,
  onCountryHovered,
}) => {
  const isSelectedRef = useRef(false);

  isSelectedRef.current = country.empireName === selectedEmpire?.empireName;

  const style = getStyle(country.name, isSelectedRef.current, !!selectedEmpire);

  return (
    <GeoJSON
      key={`${country.name}-${index}`}
      data={combineFeatures(country)}
      style={style}
      onEachFeature={(feature: HistoricalBasemapsFeature, layer) => {
        layer.on({
          mouseover: () => onCountryHovered?.(feature),
          mouseout: () => onCountryHovered?.(null),
          click: (e: L.LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e);
            onCountrySelected(isSelectedRef.current ? null : country);
          },
        });
      }}
    />
  );
};

export default CountryLayer;
