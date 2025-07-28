import React from "react";
import "./Header.css";
import YearSelector from "../YearSelector/YearSelector";

interface HeaderProps {
  selectedYear: number;
  onYearSelected: (year: number) => unknown;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedYear,
  onYearSelected,
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">The Sun Never Sets</h1>
        <YearSelector onSelect={onYearSelected} selectedYear={selectedYear} />
      </div>
    </header>
  );
};

export default Header;
