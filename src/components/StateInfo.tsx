import React from "react";
import type { IState } from "../types/types";
import "./StateInfo.css";

interface Props {
  feature: IState | null;
}

/**
 * Компонент отображения расширенной информации о штате
 * Показывает детальную информацию при выборе штата
 */
const StateInfo: React.FC<Props> = ({
  feature
}) => {
  if (!feature) return null;

  const { capital, foundation } = feature.properties ?? {};

  return (
      <div className="state-list-expanded">
        <div className="state-list-info-section">
          <div className="state-list-info-label">Основан</div>
          <div className="state-list-info-value">{foundation || "—"}</div>
        </div>
        
        <div className="state-list-info-section">
          <div className="state-list-info-label">Столица</div>
          <div className="state-list-info-value">{capital}</div>
        </div>
        
        <div className="state-list-hint">
          Нажмите на штат на карте или в списке для выбора
        </div>
      </div>
  );
};

export default StateInfo;