import { useCallback, useState } from "react";
import type { IState } from "../types/types";

export interface UseSelectionResult {
  selectedId: string | null;
  selectedFeature: IState | null;
  hoveredId: string | null;

  selectById: (id: string | null) => void;
  selectFeature: (feature: IState | null) => void;
  toggleSelectById: (id: string) => void;
  clearSelection: () => void;

  setHoveredId: (id: string | null) => void;
}

/**
 * Хук для управления состоянием выбора
 * Управляет выбранным штатом, предоставляет методы для изменения выбора
 */
export function useSelection(initialId: string | null = null): UseSelectionResult {
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [selectedFeature, setSelectedFeature] = useState<IState | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectById = useCallback((id: string | null) => {
    setSelectedId(id);
    setSelectedFeature(null); // Очищаем feature, так как у нас нет доступа к коллекции здесь
  }, []);

  const selectFeature = useCallback((feature: IState | null) => {
    if (!feature) {
      setSelectedId(null);
      setSelectedFeature(null);
    } else {
      setSelectedId(feature.id ?? null);
      setSelectedFeature(feature);
    }
  }, []);

  const toggleSelectById = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
    setSelectedFeature(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setSelectedFeature(null);
  }, []);

  return {
    selectedId,
    selectedFeature,
    hoveredId,
    selectById,
    selectFeature,
    toggleSelectById,
    clearSelection,
    setHoveredId,
  };
}