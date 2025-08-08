import React, { useMemo } from "react";
import { YEAR_TO_FILENAME } from "../../utils/constants";
import "./Toolbar.css";
import type { DateTimeSettings } from "../../types/geo";
import { formatDateValue, getDayOfYear, formatTimeValue } from "../../utils/dateTime";

interface ToolbarProps {
  selectedYear: number;
  onYearSelected: (year: number) => void;
  date: Date;
  onDateChange: (date: Date) => void;
  settings: DateTimeSettings;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedYear,
  onYearSelected,
  date,
  onDateChange,
  settings,
}) => {
  const availableYears = useMemo(() => {
    return Object.keys(YEAR_TO_FILENAME)
      .map(Number)
      .sort((a, b) => a - b);
  }, []);

  const handleTimeSliderChange = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value % 1) * 60);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    onDateChange(newDate);
  };

  const handleDateSliderChange = (value: number) => {
    const newDate = new Date(date.getFullYear(), 0, 1);
    newDate.setDate(value);
    newDate.setHours(date.getHours(), date.getMinutes());
    onDateChange(newDate);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section year-section">
        <div className="control-item">
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            className="year-select"
            value={selectedYear}
            onChange={(e) => onYearSelected(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="toolbar-section time-section">
        <div className="control-group">
          <div className="control-item slider-container">
            <label htmlFor="date-slider">
              Date: {formatDateValue(getDayOfYear(date), settings)}
            </label>
            <input
              type="range"
              id="date-slider"
              className="slider"
              min="1"
              max="365"
              value={getDayOfYear(date)}
              onChange={(e) => handleDateSliderChange(parseInt(e.target.value))}
            />
          </div>
          <div className="control-item slider-container">
            <label htmlFor="time-slider">
              Time:{" "}
              {formatTimeValue(
                date.getHours() + date.getMinutes() / 60,
                settings
              )}
            </label>
            <input
              type="range"
              id="time-slider"
              className="slider"
              min="0"
              max="24"
              step="0.25"
              value={date.getHours() + date.getMinutes() / 60}
              onChange={(e) =>
                handleTimeSliderChange(parseFloat(e.target.value))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
