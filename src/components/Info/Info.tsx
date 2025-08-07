import React from "react";
import { Modal } from "../Modal/Modal";
import "./Info.css";

interface InfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Info: React.FC<InfoProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About The Sun Never Sets">
      <div className="info-content">
        <section>
          <h3>About the Project</h3>
          <p>
            "The Sun Never Sets" is an interactive visualization tool that
            explores historical empires and tests the famous saying "the sun
            never sets on the British Empire" across different time periods.
          </p>
        </section>

        <section>
          <h3>Features</h3>
          <ul>
            <li>Interactive world map with historical territories</li>
            <li>Real-time day/night visualization</li>
            <li>Timeline exploration from ancient to modern times</li>
            <li>Detailed information about territories and empires</li>
          </ul>
        </section>

        <section>
          <h3>Open Source</h3>
          <p>
            This project is open source and available on{" "}
            <a
              href="https://github.com/Uspectacle/empire-illumination"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . We welcome contributions from the community!
          </p>
        </section>

        <section>
          <h3>Data Sources</h3>
          <p>
            The historical data used in this project comes from various academic
            sources and public domain datasets. We strive for historical
            accuracy while acknowledging that boundaries and dates may be
            subject to interpretation.
          </p>
        </section>

        <section>
          <h3>License</h3>
          <p>
            This project is licensed under the GNU General Public License v3.0.
            You are free to use, modify, and distribute this software under the
            terms of the license.
          </p>
        </section>

        <section>
          <h3>Contributing</h3>
          <p>
            We welcome contributions! Whether it's improving the code, adding
            historical data, fixing bugs, or suggesting new features, please
            visit our GitHub repository to get started.
          </p>
        </section>
      </div>
    </Modal>
  );
};
