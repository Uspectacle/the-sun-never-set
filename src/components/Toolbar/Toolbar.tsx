import React, { useMemo } from "react";
import { YEAR_TO_FILENAME } from "../../utils/constants";
import "./Toolbar.css";
import type { DateTimeSettings } from "../Settings/Settings";

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

  const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const formatTimeValue = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value % 1) * 60);

    if (settings.timeFormat === "12h") {
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDateValue = (dayOfYear: number) => {
    const dateObj = new Date(new Date().getFullYear(), 0, dayOfYear);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return settings.dateFormat === "MM/DD"
      ? `${month}/${day}`
      : `${day}/${month}`;
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
              Date: {formatDateValue(getDayOfYear(date))}
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
              Time: {formatTimeValue(date.getHours() + date.getMinutes() / 60)}
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
