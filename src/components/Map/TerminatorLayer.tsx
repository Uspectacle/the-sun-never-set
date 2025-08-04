import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import terminator from "@joergdietrich/leaflet.terminator";

const TerminatorLayer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const term = terminator();
    term.addTo(map);

    const interval = setInterval(() => {
      term.setTime(new Date());
    }, 60 * 1000);

    return () => {
      map.removeLayer(term);
      clearInterval(interval);
    };
  }, [map]);

  return null;
};

export default TerminatorLayer;
