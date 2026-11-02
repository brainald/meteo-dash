import { fetchData } from "./common";
import {
  cityWeatherSchema,
  type CityWeatherRecord,
} from "../types/cityWeather";

type FetchCityWeatherOptions = {
  cityId: number;
  startDate: string;
  endDate: string;
  signal: AbortSignal;
};

export function fetchCityWeather({
  cityId,
  startDate,
  endDate,
  signal,
}: FetchCityWeatherOptions): Promise<CityWeatherRecord[]> {
  const searchParams = new URLSearchParams({
    cityId: String(cityId),
    startDate,
    endDate,
  });

  return fetchData(
    `/city-weather?${searchParams.toString()}`,
    cityWeatherSchema,
    signal,
  );
}
