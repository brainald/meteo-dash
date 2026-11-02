import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchRegionWeather } from "../api/regionWeather";
import { fetchRegionOptions } from "../api/locationOptions";
import { WeatherResults } from "../components/WeatherResults";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import type { WeatherFilters } from "../components/WeatherFilterForm";
import { useWeatherUnits } from "../context/useWeatherUnits";
import type { RegionWeatherRecord } from "../types/regionWeather";
import { regionWeatherSearchSchema } from "../types/regionWeatherSearch";
import { createWeatherColumns } from "../utils/weatherColumns";
import { useCallback } from "react";

export const Route = createFileRoute("/region-weather")({
  validateSearch: regionWeatherSearchSchema,
  component: RegionWeather,
});

function RegionWeather() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { formatTemperature, formatPrecipitation, precipitationUnit } =
    useWeatherUnits();

  const filters: WeatherFilters = {
    selection: search.region,
    startDate: search.startDate,
    endDate: search.endDate,
  };

  const { page, limit, offset } = search;

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
      page,
      limit,
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
        page,
        limit,
        offset,
        signal,
      });
    },
    enabled: selectedRegion !== undefined,
  });

  const rows = weatherQuery.data?.data ?? [];
  const summary = weatherQuery.data?.summary;

  const handleApplyFilters = useCallback(
    (nextFilters: WeatherFilters) => {
      void navigate({
        search: (previous) => ({
          ...previous,
          region: nextFilters.selection,
          startDate: nextFilters.startDate,
          endDate: nextFilters.endDate,
          page: 1,
          offset: 0,
        }),
      });
    },
    [navigate],
  );

  const handlePaginationChange = useCallback(
    (nextPage: number, nextLimit: number) => {
      void navigate({
        search: (previous) => ({
          ...previous,
          page: nextPage,
          limit: nextLimit,
          offset: (nextPage - 1) * nextLimit,
        }),
      });
    },
    [navigate],
  );

  const columns = createWeatherColumns<RegionWeatherRecord>({
    formatTemperature,
    formatPrecipitation,
    precipitationUnit,
  });

  return (
    <div className="space-y-6">
      <div>
        <PageTitle eyebrow="weather data / regions" title="Region weather" />
        <PageDescription>
          Compare regional weather summaries over a selected period.
        </PageDescription>
      </div>
      <WeatherResults
        selectionLabel="REGION"
        selectionOptions={(regionOptionsQuery.data ?? []).map((region) => ({
          value: region,
          label: region,
        }))}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        filterIsLoading={
          regionOptionsQuery.isLoading || weatherQuery.isFetching
        }
        optionsError={
          regionOptionsQuery.isError
            ? `Could not load region options: ${regionOptionsQuery.error.message}`
            : undefined
        }
        title="Regional summaries"
        itemLabel="regional observations"
        rows={rows}
        columns={columns}
        rowKey={(row) => row.date}
        totalCount={weatherQuery.data?.total ?? 0}
        page={page}
        limit={limit}
        offset={weatherQuery.data?.offset ?? offset}
        onPaginationChange={handlePaginationChange}
        isLoading={regionOptionsQuery.isLoading || weatherQuery.isFetching}
        isError={regionOptionsQuery.isError || weatherQuery.isError}
        summary={summary}
      />
    </div>
  );
}
