import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import LeafletMap from "./components/Map/Map";
import { fetchCountries, parseEmpires } from "./services/historicalDataService";
import "./App.css";
import type { Country, Empire } from "./types/geo";

function App() {
  const [selectedYear, setSelectedYear] = useState<number>(1920);
  const [countries, setCountries] = useState<Country[]>([]);
  const [empires, setEmpires] = useState<Map<string, Empire>>(new Map());
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<Empire | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchCountries(selectedYear)
      .then((countries) => {
        setCountries(countries);
        setEmpires(parseEmpires(countries));
      })
      .catch((error) => console.error("Error loading data:", error))
      .finally(() => setTimeout(() => setLoading(false), 500));
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
      <Header
        selectedYear={selectedYear}
        onYearSelected={setSelectedYear}
        loading={loading}
      />
      <LeafletMap
        countries={countries}
        selectedEmpire={selectedEmpire}
        onCountrySelected={setSelectedCountry}
      />
    </div>
  );
}

export default App;
