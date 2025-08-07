import { useState, useEffect } from "react";
import LeafletMap from "./components/Map/Map";
import { fetchCountries, parseEmpires } from "./services/historicalDataService";
import "./App.css";
import type { Country, Empire, HistoricalBasemapsFeature } from "./types/geo";
import Toolbar from "./components/Toolbar/Toolbar";
import {
  Settings,
  type DateTimeSettings,
} from "./components/Settings/Settings";
import { Info } from "./components/Info/Info";
import CountryInfo from "./components/CountryInfo/CountryInfo";

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
        <h1 className="header-title">The Sun Never Sets</h1>
        <button
          className="info-button"
          onClick={() => setIsInfoOpen(true)}
          aria-label="Show information"
        >
          ℹ️
        </button>
        <button
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open settings"
        >
          ⚙️
        </button>
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
