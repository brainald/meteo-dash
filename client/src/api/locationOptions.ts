import { fetchData } from "./common";
import {
  cityOptionsSchema,
  regionOptionsSchema,
  type CityOption,
} from "../types/locationOptions";

export function fetchCityOptions({
  signal,
}: {
  signal: AbortSignal;
}): Promise<CityOption[]> {
  return fetchData("/city-options", cityOptionsSchema, signal);
}

export function fetchRegionOptions({
  signal,
}: {
  signal: AbortSignal;
}): Promise<string[]> {
  return fetchData("/region-options", regionOptionsSchema, signal);
}
