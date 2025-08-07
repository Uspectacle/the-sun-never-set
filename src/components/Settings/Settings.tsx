import React from "react";
import { Modal } from "../Modal/Modal";
import "./Settings.css";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export interface DateTimeSettings {
  timeFormat: "12h" | "24h";
  dateFormat: "MM/DD" | "DD/MM";
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DateTimeSettings;
  onSettingsChange: (settings: DateTimeSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" icon={faGear}>
      <div className="settings-content">
        <div className="settings-group">
          <h3>Time Format</h3>
          <div className="settings-options">
            <label>
              <input
                type="radio"
                name="timeFormat"
                value="12h"
                checked={settings.timeFormat === "12h"}
                onChange={() =>
                  onSettingsChange({ ...settings, timeFormat: "12h" })
                }
              />
              12-hour (1:30 PM)
            </label>
            <label>
              <input
                type="radio"
                name="timeFormat"
                value="24h"
                checked={settings.timeFormat === "24h"}
                onChange={() =>
                  onSettingsChange({ ...settings, timeFormat: "24h" })
                }
              />
              24-hour (13:30)
            </label>
          </div>
        </div>
        <div className="settings-group">
          <h3>Date Format</h3>
          <div className="settings-options">
            <label>
              <input
                type="radio"
                name="dateFormat"
                value="MM/DD"
                checked={settings.dateFormat === "MM/DD"}
                onChange={() =>
                  onSettingsChange({ ...settings, dateFormat: "MM/DD" })
                }
              />
              MM/DD
            </label>
            <label>
              <input
                type="radio"
                name="dateFormat"
                value="DD/MM"
                checked={settings.dateFormat === "DD/MM"}
                onChange={() =>
                  onSettingsChange({ ...settings, dateFormat: "DD/MM" })
                }
              />
              DD/MM
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};
