import { fetchData } from "./common";
import {
  regionWeatherSchema,
  type RegionWeatherResponse,
} from "../types/regionWeather";

type FetchRegionWeatherOptions = {
  region: string;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  offset: number;
  signal: AbortSignal;
};

export function fetchRegionWeather({
  region,
  startDate,
  endDate,
  page,
  limit,
  offset,
  signal,
}: FetchRegionWeatherOptions): Promise<RegionWeatherResponse> {
  const searchParams = new URLSearchParams({
    region,
    startDate,
    endDate,
    page: String(page),
    limit: String(limit),
    offset: String(offset),
  });

  return fetchData(
    `/region-weather?${searchParams.toString()}`,
    regionWeatherSchema,
    signal,
  );
}
