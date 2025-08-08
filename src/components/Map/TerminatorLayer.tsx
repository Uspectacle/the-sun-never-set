import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import terminator, { Terminator } from "@joergdietrich/leaflet.terminator";

interface TerminatorLayerProps {
  date: Date;
}

const TerminatorLayer: React.FC<TerminatorLayerProps> = ({ date }) => {
  const map = useMap();
  const terminatorRef = useRef<Terminator | null>(null);

  useEffect(() => {
    const term = terminator({
      fillColor: "rgba(9, 0, 27, 0.8)",
    });
    terminatorRef.current = term;
    term.addTo(map);

    return () => {
      map.removeLayer(term);
    };
  }, [map]);

  useEffect(() => {
    terminatorRef.current?.setTime(date);
  }, [date]);

  return null;
};

export default TerminatorLayer;
