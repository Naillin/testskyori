import { useEffect, useMemo, useState, useCallback } from "react";
import type { IState } from "../types/types";
import { loadGeoJSON } from "../api/geo";

export interface UseGeoJsonResult {
  features: IState[];             // оригинальные (но отфильтрованные) объекты
  featuresById: Record<string, IState>; // быстрый доступ по id
  sortedFeatures: IState[];       // отсортированный список по name (для легенды)
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Хук для работы с GeoJSON данными
 * Загружает, фильтрует и сортирует данные о штатах
 * Предоставляет методы для доступа к данным
 */
export function useGeoJson(): UseGeoJsonResult {
  const [features, setFeatures] = useState<IState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      // loadGeoJSON ожидает IState[] (см. src/api/geo.ts)
      const data = await loadGeoJSON(signal);
      // Нормализация / фильтрация:
      const good = (data ?? []).filter((f: IState) => {
        // базовая валидация: есть geometry, type и координаты не пусты
        if (!f || !f.geometry || !f.geometry.type) return false;
        const coords = f.geometry.coordinates;
        if (!Array.isArray(coords)) return false;
        // Проверка на ненулевую вложенность (Polygon -> [[[...]]], MultiPolygon -> [[[[...]]]])
        const hasCoords = (function checkDepth(arr: any): boolean {
          if (!Array.isArray(arr)) return false;
          // найти хоть одну пару чисел глубже
          for (const a of arr) {
            if (Array.isArray(a)) {
              if (checkDepth(a)) return true;
            } else if (typeof a === "number") {
              // достигли чисел — считаем валидным
              return true;
            }
          }
          return false;
        })(coords);
        return hasCoords;
      });

      // сохранение
      setFeatures(good);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        // игнорируем, если отменено
        return;
      }
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  // первичная загрузка и возможность перезагрузки
  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => {
      ctrl.abort();
    };
  }, [fetchData]);

  const reload = useCallback(async () => {
    const ctrl = new AbortController();
    await fetchData(ctrl.signal);
  }, [fetchData]);

  // производные: map по id и отсортированный список (по name)
  const featuresById = useMemo<Record<string, IState>>(() => {
    const m: Record<string, IState> = {};
    for (const f of features) {
      if (f && f.id != null) m[String(f.id)] = f;
    }
    return m;
  }, [features]);

  const sortedFeatures = useMemo(() => {
    // сортировка по свойству properties.name
    return [...features].sort((a, b) => {
      const an = (a.properties?.name ?? "").toString();
      const bn = (b.properties?.name ?? "").toString();
      return an.localeCompare(bn, undefined, { sensitivity: "base" });
    });
  }, [features]);

  return {
    features,
    featuresById,
    sortedFeatures,
    loading,
    error,
    reload,
  };
}
