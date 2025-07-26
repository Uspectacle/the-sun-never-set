import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { fetchCountries } from "./services/geoDataService";
import { findCountryByName } from "./utils/helpers";
import type { GeoJSONFeature } from "./types";
import "./App.css";

function App() {
  const [countries, setCountries] = useState<GeoJSONFeature[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBorders, setSelectedBorders] = useState<GeoJSONFeature | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchCountries();
        setCountries(data.features);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);

    if (countryName) {
      const country = findCountryByName(countries, countryName);
      setSelectedBorders(country || null);
    } else {
      setSelectedBorders(null);
    }
  };

  if (error) {
    return (
      <div className="app error-state">
        <div className="error-message">
          <h2>Error loading application</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        countries={countries}
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
        loading={loading}
      />
      <Map selectedBorders={selectedBorders} />
      {selectedBorders && <InfoPanel selectedBorders={selectedBorders} />}
    </div>
  );
}

export default App;
