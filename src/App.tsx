import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { fetchCountries } from "./services/geoDataService";
import { fetchAllHistoricalData } from "./services/historicalDataService";
import { SearchService } from "./services/searchService";
import type {
  GeoJSONFeature,
  HistoricalEntity,
  SearchableEntity,
} from "./types";
import { ENTITY_COLORS } from "./utils/constants";
import "./App.css";

function App() {
  // State management
  const [modernCountries, setModernCountries] = useState<GeoJSONFeature[]>([]);
  const [historicalEntities, setHistoricalEntities] = useState<
    HistoricalEntity[]
  >([]);
  const [searchableEntities, setSearchableEntities] = useState<
    SearchableEntity[]
  >([]);
  const [selectedEntity, setSelectedEntity] = useState<SearchableEntity | null>(
    null
  );
  const [selectedBorders, setSelectedBorders] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] =
    useState<string>("Initializing...");

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setLoadingProgress("Loading modern countries...");

        // Load modern countries first (faster)
        const modernData = await fetchCountries();
        setModernCountries(modernData.features);
        setLoadingProgress(
          `Loaded ${modernData.features.length} modern countries`
        );

        // Create initial searchable entities with just modern countries
        const initialSearchable = SearchService.createSearchableEntities(
          modernData.features,
          []
        );
        setSearchableEntities(initialSearchable);

        setLoadingProgress("Loading historical empires and entities...");

        // Load historical data (slower, more complex)
        const historicalData = await fetchAllHistoricalData();
        setHistoricalEntities(historicalData);
        setLoadingProgress(
          `Loaded ${historicalData.length} historical entities`
        );

        // Create complete searchable entities
        const completeSearchable = SearchService.createSearchableEntities(
          modernData.features,
          historicalData
        );
        setSearchableEntities(completeSearchable);

        setLoadingProgress("Data loaded successfully!");
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error occurred while loading data"
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Small delay to show success message
      }
    };

    loadAllData();
  }, []);

  // Handle entity selection from search
  const handleEntitySelect = (entity: SearchableEntity | null) => {
    setSelectedEntity(entity);

    if (entity) {
      // Set the borders data from the entity
      setSelectedBorders(entity.entity);
    } else {
      setSelectedBorders(null);
    }
  };

  // Get dynamic map style based on selected entity
  const getMapStyle = () => {
    if (!selectedEntity) {
      return {
        color: "#ff6b6b",
        weight: 2,
        fillColor: "#ff6b6b",
        fillOpacity: 0.3,
      };
    }

    // Get color based on entity type
    const color =
      selectedEntity.type === "modern"
        ? ENTITY_COLORS.modern
        : ENTITY_COLORS.historical;

    // Adjust opacity based on border precision for historical entities
    let fillOpacity = 0.4;
    if (
      selectedEntity.type === "historical" &&
      selectedEntity.entity.properties?.BORDERPRECISION
    ) {
      const precision = selectedEntity.entity.properties.BORDERPRECISION;
      fillOpacity = precision === 1 ? 0.2 : precision === 2 ? 0.3 : 0.4;
    }

    return {
      color,
      weight: 2,
      fillColor: color,
      fillOpacity,
    };
  };

  // Error state
  if (error) {
    return (
      <div className="app error-state">
        <div className="error-message">
          <h2>Error Loading Application</h2>
          <p>{error}</p>
          <div className="error-details">
            <p>This might be due to:</p>
            <ul>
              <li>Network connectivity issues</li>
              <li>GitHub API rate limiting</li>
              <li>Temporarily unavailable data sources</li>
            </ul>
          </div>
          <button onClick={() => window.location.reload()}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Main application render
  return (
    <div className="app">
      {/* Header with search functionality */}
      <Header
        entities={searchableEntities}
        selectedEntity={selectedEntity}
        onEntitySelect={handleEntitySelect}
        loading={loading}
      />

      {/* Interactive map */}
      <Map selectedBorders={selectedBorders} mapStyle={getMapStyle()} />

      {/* Information panel - only show when entity is selected */}
      {selectedEntity && selectedBorders && (
        <InfoPanel
          selectedEntity={selectedEntity}
          selectedBorders={selectedBorders}
        />
      )}

      {/* Loading overlay during initial data fetch */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>Loading Historical Data</h3>
            <p>{loadingProgress}</p>
            <div className="loading-stats">
              <div className="stat">
                <span className="stat-number">{modernCountries.length}</span>
                <span className="stat-label">Modern Countries</span>
              </div>
              <div className="stat">
                <span className="stat-number">{historicalEntities.length}</span>
                <span className="stat-label">Historical Entities</span>
              </div>
              <div className="stat">
                <span className="stat-number">{searchableEntities.length}</span>
                <span className="stat-label">Total Searchable</span>
              </div>
            </div>
            <small>
              {searchableEntities.length === 0
                ? "This may take a moment as we fetch data from multiple historical periods..."
                : "Almost ready!"}
            </small>
          </div>
        </div>
      )}

      {/* Development info - remove in production */}
      {process.env.NODE_ENV === "development" && !loading && (
        <div className="dev-info">
          <small>
            Dev: {searchableEntities.length} entities loaded | Selected:{" "}
            {selectedEntity?.displayName || "None"}
          </small>
        </div>
      )}
    </div>
  );
}

export default App;
