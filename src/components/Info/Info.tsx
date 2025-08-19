import React from "react";
import { Modal } from "../Modal/Modal";
import "./Info.css";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Info: React.FC<InfoProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About" icon={faCircleInfo}>
      <div className="info-content">
        <section className="about-section">
          <p>
            “The sun never set on the British Empire,” right? <br />
            Yeah, never trust those bloody Brits. <br />
            Looks like we’ll have to fact-check that one ourselves. <br />
            And while we’re at it, let’s have a peek at the other empires.
            <br /> I hear France is still hanging on to a few
            “totally-not-colonies” of its own.
          </p>
        </section>

        <section>
          <p>
            <a
              href="https://github.com/Uspectacle/the-sun-never-set"
              target="_blank"
              rel="noopener noreferrer"
            >
              This project is open source and available on{" "}
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </p>
          <p>
            <a
              href="https://github.com/Uspectacle/the-sun-never-set/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to open an issue
            </a>
          </p>
        </section>
        <section>
          <p>
            This project rests on the shoulders of giants. Many thanks to the
            contributors of the{" "}
          </p>
          <ul className="credits-list">
            <li>
              <img
                src="https://github.com/aourednik.png"
                alt="Adrian Ourednik"
                className="avatar"
              />
              Historical maps data by{" "}
              <a
                href="https://github.com/aourednik/historical-basemaps"
                target="_blank"
                rel="noopener noreferrer"
              >
                Adrian Ourednik
              </a>
            </li>
            <li>
              <img
                src="https://github.com/joergdietrich.png"
                alt="Jörg Dietrich"
                className="avatar"
              />
              Day/night visualization by{" "}
              <a
                href="https://github.com/joergdietrich/Leaflet.Terminator"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jörg Dietrich
              </a>
            </li>
          </ul>
          <p>
            The cleaned and edited historical borders can be found here:{" "}
            <a
              href="https://github.com/Uspectacle/historical-basemaps-cleaned"
              target="_blank"
              rel="noopener noreferrer"
            >
              historical-basemaps-cleaned
            </a>
          </p>
        </section>

        <section>
          <h3>License</h3>
          <p>
            This project is licensed under the GNU General Public License v3.0.{" "}
            <br />
            You are free to use, modify, and distribute this software under the
            terms of the license.
          </p>
          <p>This project was made in part using AI assistance.</p>
        </section>
      </div>
    </Modal>
  );
};
