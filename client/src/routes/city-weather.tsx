import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCityWeather } from "../api/cityWeather";
import { fetchCityOptions } from "../api/locationOptions";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import { RadixIcon } from "../components/RadixIcon";
import {
  WeatherFilterForm,
  type WeatherFilters,
} from "../components/WeatherFilterForm";
import {
  WeatherTable,
  type WeatherColumn,
} from "../components/weather-table/WeatherTable";
import { useWeatherUnits } from "../context/useWeatherUnits";
import type { CityWeatherRecord } from "../types/cityWeather";

const initialFilters: WeatherFilters = {
  selection: "1",
  startDate: "2023-12-01",
  endDate: "2023-12-31",
};

export const Route = createFileRoute("/city-weather")({
  component: CityWeather,
});

function CityWeather() {
  const { formatTemperature, formatPrecipitation, precipitationUnit } =
    useWeatherUnits();
  const [filters, setFilters] = useState(initialFilters);
  const cityOptionsQuery = useQuery({
    queryKey: ["city-options"],
    queryFn: fetchCityOptions,
  });
  const selectedCity = cityOptionsQuery.data?.find(
    (city) => String(city.id) === filters.selection,
  );
  const weatherQuery = useQuery({
    queryKey: [
      "city-weather",
      selectedCity?.id,
      filters.startDate,
      filters.endDate,
    ],
    queryFn: ({ signal }) => {
      if (!selectedCity) {
        throw new Error("Select a valid city.");
      }

      return fetchCityWeather({
        cityId: selectedCity.id,
        startDate: filters.startDate,
        endDate: filters.endDate,
        signal,
      });
    },
    enabled: selectedCity !== undefined,
  });
  const rows = weatherQuery.data ?? [];

  const columns: WeatherColumn<CityWeatherRecord>[] = [
    {
      header: "DATE",
      value: (row) => formatDate(row.date),
      render: (row) => formatDate(row.date),
    },
    {
      header: "MIN TEMP",
      value: (row) => formatTemperature(row.minTemp),
      render: (row) => formatTemperature(row.minTemp),
    },
    {
      header: "MAX TEMP",
      value: (row) => formatTemperature(row.maxTemp),
      render: (row) => formatTemperature(row.maxTemp),
    },
    {
      header: "AVG TEMP",
      value: (row) => formatTemperature(row.averageTemp),
      render: (row) => (
        <span className="font-semibold text-slate-800">
          {formatTemperature(row.averageTemp)}
        </span>
      ),
    },
    {
      header: `PRECIPITATION (${precipitationUnit === "millimeters" ? "MM" : "IN"})`,
      value: (row) => formatPrecipitation(row.precipitation),
      render: (row) => formatPrecipitation(row.precipitation),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <PageTitle eyebrow="weather data / cities" title="City weather" />
        <PageDescription>
          Review daily conditions for a selected city and date range.
        </PageDescription>
      </div>
      <WeatherFilterForm
        selectionLabel="CITY"
        selectionOptions={(cityOptionsQuery.data ?? []).map((city) => ({
          value: String(city.id),
          label: `${city.name} (${city.region})`,
        }))}
        initialFilters={initialFilters}
        onApply={setFilters}
        isLoading={cityOptionsQuery.isLoading || weatherQuery.isFetching}
      />
      {cityOptionsQuery.isError && (
        <p role="alert" className="text-sm text-red-700">
          Could not load city options: {cityOptionsQuery.error.message}
        </p>
      )}
      <WeatherTable
        isLoading={cityOptionsQuery.isLoading || weatherQuery.isLoading}
        isError={cityOptionsQuery.isError || weatherQuery.isError}
        title="Weather records"
        itemLabel="city observations"
        rows={rows}
        columns={columns}
        rowKey={(row) => row.date}
        totalCount={rows.length}
        rowsPerPage={10}
      />
      <p className="text-xs text-slate-500">
        <RadixIcon
          name="info"
          className="mr-2 inline-block size-4 text-sky-700"
        />
        Tip: Select a city and date range to narrow the results. Use the table
        to compare daily minimum, maximum and average temperatures.
      </p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
