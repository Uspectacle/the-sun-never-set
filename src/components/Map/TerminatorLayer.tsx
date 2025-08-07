import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import terminator, { Terminator } from "@joergdietrich/leaflet.terminator";

interface TerminatorLayerProps {
  date?: Date;
}

const TerminatorLayer: React.FC<TerminatorLayerProps> = ({ date }) => {
  const map = useMap();
  const terminatorRef = useRef<Terminator | null>(null);

  useEffect(() => {
    const term = terminator();
    terminatorRef.current = term;
    term.addTo(map);

    if (date) {
      term.setTime(date);
    }

    const interval = setInterval(() => {
      if (!date) {
        term.setTime(new Date());
      }
    }, 60 * 1000);

    return () => {
      map.removeLayer(term);
      clearInterval(interval);
    };
  }, [map]);

  useEffect(() => {
    if (terminatorRef.current && date) {
      terminatorRef.current.setTime(date);
    }
  }, [date]);

  return null;
};

export default TerminatorLayer;
