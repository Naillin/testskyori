import React from "react";
import type { IState } from "../types/types";
import "./StateListItem.css";
import StateInfo from './StateInfo';

interface Props {
  feature: IState;
  isSelected?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
}

const StateListItem: React.FC<Props> = ({
  feature, 
  isSelected, 
  isExpanded, 
  onClick
}) => {
  const name = feature.properties?.name ?? "—";
  const capital = feature.properties?.capital ?? "";

  return (
    <div className="state-list-item" data-selected={isSelected}>
      <div
        className={`state-list-main ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") onClick?.(); }}
      >
        <div className="state-list-content">
          <div className="state-list-name">{name}</div>
          <div className="state-list-capital">Столица: {capital}</div>
        </div>
        <div className="state-list-id">ID: {feature.id}</div>
      </div>

      {isExpanded && (
        <StateInfo 
          feature={feature}
        />
      )}
    </div>
  );
};

export default StateListItem;