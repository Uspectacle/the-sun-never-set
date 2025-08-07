import React from "react";
import "./TimeControl.css";

interface TimeControlProps {
  date: Date;
  onChange: (newDate: Date) => void;
}

const TimeControl: React.FC<TimeControlProps> = ({ date, onChange }) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    onChange(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    // Preserve the current time
    newDate.setHours(date.getHours(), date.getMinutes());
    onChange(newDate);
  };

  const formatTimeForInput = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="time-control">
      <div className="time-control-item">
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          value={formatTimeForInput(date)}
          onChange={handleTimeChange}
        />
      </div>
      <div className="time-control-item">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={formatDateForInput(date)}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default TimeControl;
