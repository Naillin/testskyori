import type { IState } from "../types/types";
import geoData from '../public/dataset-poly.json';

export async function loadGeoJSON(signal?: AbortSignal): Promise<IState[]> {
  return geoData.features as IState[];
}
