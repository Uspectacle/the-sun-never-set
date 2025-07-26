import React from "react";
import SearchEngine from "../SearchEngine/SearchEngine";
import type { SearchableEntity } from "../../types";
import "./Header.css";

interface HeaderProps {
  entities: SearchableEntity[];
  selectedEntity: SearchableEntity | null;
  onEntitySelect: (entity: SearchableEntity | null) => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  entities,
  selectedEntity,
  onEntitySelect,
  loading,
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">The Sun Never Sets on the Empire</h1>
        <div className="header-subtitle">
          Explore {entities.length.toLocaleString()} countries and empires
          throughout history
        </div>
        <SearchEngine
          entities={entities}
          selectedEntity={selectedEntity}
          onEntitySelect={onEntitySelect}
          loading={loading}
        />
      </div>
    </header>
  );
};

export default Header;
