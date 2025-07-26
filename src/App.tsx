import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import LeafletMap from "./components/Map/Map";
import { fetchAllHistoricalData } from "./services/historicalDataService";
import "./App.css";
import type { Country, Empire } from "./types/geo";

function App() {
  const [[countries, empires], setHistoricalData] = useState<
    [Country[], Map<number, Map<string, Empire>>]
  >([[], new Map()]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<Empire | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const historicalData = await fetchAllHistoricalData();
        setHistoricalData(historicalData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Small delay to show success message
      }
    };

    loadAllData();
  }, []);

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);

    if (country) {
      const empire = empires.get(country.year)?.get(country.empireName);
      setSelectedEmpire(empire ?? null);
    } else {
      setSelectedEmpire(null);
    }
  };

  const getMapStyle = () => {
    if (!selectedCountry) {
      return {
        color: "#ff6b6b",
        weight: 2,
        fillColor: "#ff6b6b",
        fillOpacity: 0.3,
      };
    }

    return {
      color: "#ffcb6b",
      weight: 2,
      fillColor: "#ffcb6b",
      fillOpacity: 0.4,
    };
  };

  return (
    <div className="app">
      <Header
        countries={countries}
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
        loading={loading}
      />
      <LeafletMap selectedEmpire={selectedEmpire} mapStyle={getMapStyle()} />
    </div>
  );
}

export default App;
