import React, { useMemo, useState, useEffect, useRef } from "react";
import type { IState } from "../types/types";
import StateListItem from "./StateListItem";
import "./LegendPanel.css";

interface Props {
  sortedFeatures: IState[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onClearSelection: () => void;
}

/**
 * Компонент панели легенды/списка штатов
 * Отображает список штатов с поиском и возможностью выбора
 */
const LegendPanel: React.FC<Props> = ({
  sortedFeatures, 
  selectedId, 
  onSelect, 
  onClearSelection 
}) => {
  const [query, setQuery] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return sortedFeatures;
    const q = query.trim().toLowerCase();
    return sortedFeatures.filter((f) => 
      (f.properties?.name ?? "").toLowerCase().includes(q)
    );
  }, [sortedFeatures, query]);

  useEffect(() => {
    if (selectedId && selectedItemRef.current && listRef.current) {
      const selectedElement = selectedItemRef.current;
      setTimeout(() => {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [selectedId, filtered]);

  //Сброс фильтра и выбора
  const handleClearSelection = () => {
    setQuery("");
    onClearSelection();
  };

  return (
    <div className="legend-panel">
      <div className="legend-header">
        <h3 style={{ margin: 0, marginBottom: 12 }}>Штаты США</h3>
        <input
          className="legend-search"
          placeholder="Поиск штата..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {selectedId && (
          <button 
            className="legend-clear-button"
            onClick={handleClearSelection}
          >
            Сбросить выбор
          </button>
        )}
      </div>

      <div ref={listRef} className="legend-list">
        {filtered.map((feature) => (
          <div key={feature.id} ref={selectedId === feature.id ? selectedItemRef : null}>
            <StateListItem
              feature={feature}
              isSelected={selectedId === feature.id}
              isExpanded={selectedId === feature.id}
              onClick={() => onSelect(selectedId === feature.id ? null : feature.id)}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="legend-empty-state">Ничего не найдено</div>
        )}
      </div>
    </div>
  );
};

export default LegendPanel;