import { useState, useEffect } from "react";
import LeafletMap from "./components/Map/Map";
import { fetchCountries, parseEmpires } from "./utils/historicalDataService";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import type {
  Country,
  DateTimeSettings,
  Empire,
  HistoricalBasemapsFeature,
} from "./types/geo";
import Toolbar from "./components/Toolbar/Toolbar";
import { Settings } from "./components/Settings/Settings";
import { Info } from "./components/Info/Info";
import CountryInfo from "./components/CountryInfo/CountryInfo";
import { EmpireInfo } from "./components/EmpireInfo/EmpireInfo";

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(1920);
  const [countries, setCountries] = useState<Country[]>([]);
  const [empires, setEmpires] = useState<Map<string, Empire>>(new Map());
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<Empire | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [settings, setSettings] = useState<DateTimeSettings>({
    timeFormat: "24h",
    dateFormat: "MM/DD",
  });
  const [hoveredFeature, setHoveredFeature] =
    useState<HistoricalBasemapsFeature | null>(null);

  useEffect(() => {
    fetchCountries(selectedYear)
      .then((countries) => {
        setCountries(countries);
        setEmpires(parseEmpires(countries));
      })
      .catch((error) => console.error("Error loading data:", error));
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedCountry) {
      setSelectedEmpire(null);
      return;
    }

    setSelectedEmpire(empires.get(selectedCountry.empireName) ?? null);
  }, [empires, selectedCountry]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">The Sun Never Set</h1>
        <div className="header-buttons">
          <button
            className="button info-button"
            onClick={() => setIsInfoOpen(true)}
            aria-label="Show information"
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="button settings-button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </header>
      <LeafletMap
        countries={countries}
        selectedEmpire={selectedEmpire}
        onCountrySelected={setSelectedCountry}
        onFeatureHover={setHoveredFeature}
        date={currentDate}
      />
      <Toolbar
        selectedYear={selectedYear}
        onYearSelected={setSelectedYear}
        date={currentDate}
        onDateChange={setCurrentDate}
        settings={settings}
      />
      <CountryInfo feature={hoveredFeature} />
      <EmpireInfo
        empire={selectedEmpire}
        date={currentDate}
        onClose={() => setSelectedCountry(null)}
        onDateChange={setCurrentDate}
      />
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <Info isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}

export default App;
