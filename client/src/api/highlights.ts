import {
  cityCountSchema,
  highestTemperatureSchema,
  regionCountSchema,
  type HighestTemperature,
} from "../types/highlights";
import { fetchData } from "./common";

export async function fetchMonitoredCities({
  signal,
}: {
  signal: AbortSignal;
}): Promise<number> {
  const result = await fetchData(
    `/highlights/monitored-cities`,
    cityCountSchema,
    signal,
  );
  return result.count;
}

export async function fetchCoveredRegions({
  signal,
}: {
  signal: AbortSignal;
}): Promise<number> {
  const result = await fetchData(
    `/highlights/covered-regions`,
    regionCountSchema,
    signal,
  );
  return result.count;
}

export async function fetchHighestTemperature({
  signal,
}: {
  signal: AbortSignal;
}): Promise<HighestTemperature> {
  return fetchData(
    `/highlights/highest-temperature`,
    highestTemperatureSchema,
    signal,
  );
}
