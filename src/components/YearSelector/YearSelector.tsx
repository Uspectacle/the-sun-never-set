import React, { useEffect, useRef } from "react";
import "./YearSelector.css";
import { AVAILABLE_YEARS } from "../../utils/constants";

interface YearSelectorProps {
  years?: number[];
  onSelect: (year: number) => void;
  selectedYear?: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  years = AVAILABLE_YEARS,
  onSelect,
  selectedYear,
}) => {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current && selectedYear) {
      const timer = setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedYear]);

  return (
    <div className="timeline-container">
      <div className="timeline">
        {years.map((year) => (
          <div
            key={year}
            ref={year === selectedYear ? selectedRef : null}
            className={`year ${year === selectedYear ? "selected" : ""}`}
            onClick={() => onSelect(year)}
          >
            <span>{year}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;
