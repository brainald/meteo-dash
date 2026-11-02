import { fetchData } from "./common";
import {
  regionWeatherSchema,
  type RegionWeatherRecord,
} from "../types/regionWeather";

type FetchRegionWeatherOptions = {
  region: string;
  startDate: string;
  endDate: string;
  signal: AbortSignal;
};

export function fetchRegionWeather({
  region,
  startDate,
  endDate,
  signal,
}: FetchRegionWeatherOptions): Promise<RegionWeatherRecord[]> {
  const searchParams = new URLSearchParams({
    region,
    startDate,
    endDate,
  });

  return fetchData(
    `/region-weather?${searchParams.toString()}`,
    regionWeatherSchema,
    signal,
  );
}
