import type { IState } from "../types/types";
import geoData from '../public/dataset-poly.json';

/**
 * API-модуль для загрузки GeoJSON данных
 * Загружает данные о штатах из локального JSON файла
 */
export async function loadGeoJSON(signal?: AbortSignal): Promise<IState[]> {
  return geoData.features as IState[];
}
