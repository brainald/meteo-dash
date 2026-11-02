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
    ],
    queryFn: ({ signal }) => {
      if (!selectedRegion) {
        throw new Error("Select a valid region.");
      }

      return fetchRegionWeather({
        region: selectedRegion,
        startDate: filters.startDate,
        endDate: filters.endDate,
        signal,
      });
    },
    enabled: selectedRegion !== undefined,
  });
  const rows = weatherQuery.data ?? [];
  const warmestDay = rows.reduce<RegionWeatherRecord | null>(
    (current, row) =>
      current === null || row.maxTemp > current.maxTemp ? row : current,
    null,
  );
  const coldestDay = rows.reduce<RegionWeatherRecord | null>(
    (current, row) =>
      current === null || row.minTemp < current.minTemp ? row : current,
    null,
  );
  const wettestDay = rows.reduce<RegionWeatherRecord | null>(
    (current, row) =>
      current === null || row.precipitation > current.precipitation
        ? row
        : current,
    null,
  );

  const columns: WeatherColumn<RegionWeatherRecord>[] = [
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
        onApply={setFilters}
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
        totalCount={rows.length}
        rowsPerPage={10}
      />
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="WARMEST DAY"
          name={warmestDay ? formatDate(warmestDay.date) : "—"}
          value={warmestDay ? formatTemperature(warmestDay.maxTemp) : "No data"}
        />
        <SummaryCard
          label="COOLEST DAY"
          name={coldestDay ? formatDate(coldestDay.date) : "—"}
          value={coldestDay ? formatTemperature(coldestDay.minTemp) : "No data"}
        />
        <SummaryCard
          label="WETTEST DAY"
          name={wettestDay ? formatDate(wettestDay.date) : "—"}
          value={
            wettestDay
              ? formatPrecipitation(wettestDay.precipitation)
              : "No data"
          }
        />
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-[9px] font-bold tracking-[0.13em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-slate-800">{name}</p>
        <p className="text-xs text-slate-500">{value}</p>
      </div>
    </article>
  );
}
