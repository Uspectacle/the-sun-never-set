import type { DateTimeSettings } from "../types/geo";

/**
 * Get the day number in the year (1–366).
 */
export const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Formats a numeric time value (e.g., 13.5) into a string according to settings.
 */
export const formatTimeValue = (value: number, settings: DateTimeSettings) => {
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

/**
 * Formats a day-of-year into a date string according to settings.
 */
export const formatDateValue = (
  dayOfYear: number,
  settings: DateTimeSettings
) => {
  const dateObj = new Date(new Date().getFullYear(), 0, dayOfYear);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  return settings.dateFormat === "MM/DD"
    ? `${month}/${day}`
    : `${day}/${month}`;
};

/**
 * Format a Date into "HH:MM" for HTML <input type="time">.
 */
export const formatTimeForInput = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

/**
 * Format a Date into "YYYY-MM-DD" for HTML <input type="date">.
 */
export const formatDateForInput = (date: Date) =>
  date.toISOString().split("T")[0];

/**
 * Calculate sun elevation and declination for given date & coordinates.
 */
export const calculateSunPosition = (
  date: Date,
  latitude: number,
  _longitude: number
) => {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const solarDeclination =
    23.45 * Math.sin((((360 * (284 + dayOfYear)) / 365) * Math.PI) / 180);

  const timeDecimal = date.getHours() + date.getMinutes() / 60;
  const hourAngle = 15 * (timeDecimal - 12);

  const elevation =
    (Math.asin(
      Math.sin((solarDeclination * Math.PI) / 180) *
        Math.sin((latitude * Math.PI) / 180) +
        Math.cos((solarDeclination * Math.PI) / 180) *
          Math.cos((latitude * Math.PI) / 180) *
          Math.cos((hourAngle * Math.PI) / 180)
    ) *
      180) /
    Math.PI;

  return { elevation, declination: solarDeclination };
};
