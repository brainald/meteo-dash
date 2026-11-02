import { fetchData } from "./common";
import {
  cityWeatherSchema,
  type CityWeatherResponse,
} from "../types/cityWeather";

type FetchCityWeatherOptions = {
  cityId: number;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  offset: number;
  signal: AbortSignal;
};

export function fetchCityWeather({
  cityId,
  startDate,
  endDate,
  page,
  limit,
  offset,
  signal,
}: FetchCityWeatherOptions): Promise<CityWeatherResponse> {
  const searchParams = new URLSearchParams({
    cityId: String(cityId),
    startDate,
    endDate,
    page: String(page),
    limit: String(limit),
    offset: String(offset),
  });

  return fetchData(
    `/city-weather?${searchParams.toString()}`,
    cityWeatherSchema,
    signal,
  );
}
