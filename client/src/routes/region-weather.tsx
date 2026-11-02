import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRegionWeather } from "../api/regionWeather";
import { fetchRegionOptions } from "../api/locationOptions";
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
import type { RegionWeatherRecord } from "../types/regionWeather";
import { formatDate } from "../utils/formatDate";

const initialFilters: WeatherFilters = {
  selection: "Közép-Magyarország",
  startDate: "2023-12-01",
  endDate: "2023-12-31",
};

export const Route = createFileRoute("/region-weather")({
  component: RegionWeather,
});

function RegionWeather() {
  const { formatTemperature, formatPrecipitation, precipitationUnit } =
    useWeatherUnits();
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const offset = (pagination.page - 1) * pagination.limit;
  const regionOptionsQuery = useQuery({
    queryKey: ["region-options"],
    queryFn: fetchRegionOptions,
  });
  const selectedRegion = regionOptionsQuery.data?.find(
    (region) => region === filters.selection,
  );

  const weatherQuery = useQuery({
    queryKey: [
      "region-weather",
      selectedRegion,
      filters.startDate,
      filters.endDate,
      pagination.page,
      pagination.limit,
      offset,
    ],
    queryFn: ({ signal }) => {
      if (!selectedRegion) {
        throw new Error("Select a valid region.");
      }

      return fetchRegionWeather({
        region: selectedRegion,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: pagination.page,
        limit: pagination.limit,
        offset,
        signal,
      });
    },
    enabled: selectedRegion !== undefined,
  });
  const rows = weatherQuery.data?.data ?? [];
  const summary = weatherQuery.data?.summary;
  const handleApplyFilters = (nextFilters: WeatherFilters) => {
    setFilters(nextFilters);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const columns: WeatherColumn<RegionWeatherRecord>[] = [
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
        <PageTitle eyebrow="weather data / regions" title="Region weather" />
        <PageDescription>
          Compare regional weather summaries over a selected period.
        </PageDescription>
      </div>
      <WeatherFilterForm
        selectionLabel="REGION"
        selectionOptions={(regionOptionsQuery.data ?? []).map((region) => ({
          value: region,
          label: region,
        }))}
        initialFilters={initialFilters}
        onApply={handleApplyFilters}
        isLoading={regionOptionsQuery.isLoading || weatherQuery.isFetching}
      />
      {regionOptionsQuery.isError && (
        <p role="alert" className="text-sm text-red-700">
          Could not load region options: {regionOptionsQuery.error.message}
        </p>
      )}
      <WeatherTable
        isLoading={regionOptionsQuery.isLoading || weatherQuery.isLoading}
        isError={regionOptionsQuery.isError || weatherQuery.isError}
        title="Regional summaries"
        itemLabel="regional observations"
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
