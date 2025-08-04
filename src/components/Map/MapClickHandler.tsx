import { useMapEvents } from "react-leaflet";

const MapClickHandler: React.FC<{ onMapClick: () => void }> = ({
  onMapClick,
}) => {
  useMapEvents({
    click: onMapClick,
  });

  return null;
};

export default MapClickHandler;
