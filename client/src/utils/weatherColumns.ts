import type { WeatherColumn } from "../components/weather-table/WeatherTable";
import { formatDate } from "./formatDate";

type WeatherRecord = {
  date: string;
  minTemp: number;
  maxTemp: number;
  averageTemp: number;
  precipitation: number;
};

type WeatherColumnFormatters = Readonly<{
  formatTemperature: (value: number) => string;
  formatPrecipitation: (value: number) => string;
  precipitationUnit: "millimeters" | "inches";
}>;

export function createWeatherColumns<T extends WeatherRecord>({
  formatTemperature,
  formatPrecipitation,
  precipitationUnit,
}: WeatherColumnFormatters): WeatherColumn<T>[] {
  return [
    {
      header: "DATE",
      value: (row) => formatDate(row.date),
      numericValue: (row) => Date.parse(`${row.date}T00:00:00Z`),
      statisticType: "date",
    },
    {
      header: "MIN TEMP",
      value: (row) => formatTemperature(row.minTemp),
      numericValue: (row) => row.minTemp,
      statisticType: "temperature",
    },
    {
      header: "MAX TEMP",
      value: (row) => formatTemperature(row.maxTemp),
      numericValue: (row) => row.maxTemp,
      statisticType: "temperature",
    },
    {
      header: "AVG TEMP",
      value: (row) => formatTemperature(row.averageTemp),
      className: "font-semibold text-slate-800",
      numericValue: (row) => row.averageTemp,
      statisticType: "temperature",
    },
    {
      header: `PRECIPITATION (${precipitationUnit === "millimeters" ? "MM" : "IN"})`,
      value: (row) => formatPrecipitation(row.precipitation),
      numericValue: (row) => row.precipitation,
      statisticType: "precipitation",
    },
  ];
}
