import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCityWeather } from "../api/cityWeather";
import { fetchCityOptions } from "../api/locationOptions";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import {
  WeatherFilterForm,
  type WeatherFilters,
} from "../components/WeatherFilterForm";
import {
  WeatherTable,
  type WeatherColumn,
} from "../components/weather-table/WeatherTable";
import { Summaries } from "../components/Summaries";
import { useWeatherUnits } from "../context/useWeatherUnits";
import type { CityWeatherRecord } from "../types/cityWeather";
import { formatDate } from "../utils/formatDate";

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
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const offset = (pagination.page - 1) * pagination.limit;
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
      pagination.page,
      pagination.limit,
      offset,
    ],
    queryFn: ({ signal }) => {
      if (!selectedCity) {
        throw new Error("Select a valid city.");
      }

      return fetchCityWeather({
        cityId: selectedCity.id,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: pagination.page,
        limit: pagination.limit,
        offset,
        signal,
      });
    },
    enabled: selectedCity !== undefined,
  });
  const rows = weatherQuery.data?.data ?? [];
  const summary = weatherQuery.data?.summary;
  const handleApplyFilters = (nextFilters: WeatherFilters) => {
    setFilters(nextFilters);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const columns: WeatherColumn<CityWeatherRecord>[] = [
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
        onApply={handleApplyFilters}
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
        totalCount={weatherQuery.data?.total ?? 0}
        page={pagination.page}
        limit={pagination.limit}
        offset={weatherQuery.data?.offset ?? offset}
        onPaginationChange={(page, limit) => setPagination({ page, limit })}
      />
      <Summaries summary={summary} />
    </div>
  );
}
