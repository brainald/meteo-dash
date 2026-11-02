import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCityWeather } from "../api/cityWeather";
import { fetchCityOptions } from "../api/locationOptions";
import { WeatherResults } from "../components/WeatherResults";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import type { WeatherFilters } from "../components/WeatherFilterForm";
import { useWeatherUnits } from "../context/useWeatherUnits";
import type { CityWeatherRecord } from "../types/cityWeather";
import { cityWeatherSearchSchema } from "../types/cityWeatherSearch";
import { createWeatherColumns } from "../utils/weatherColumns";

export const Route = createFileRoute("/city-weather")({
  validateSearch: cityWeatherSearchSchema,
  component: CityWeather,
});

function CityWeather() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { formatTemperature, formatPrecipitation, precipitationUnit } =
    useWeatherUnits();
  const filters: WeatherFilters = {
    selection: String(search.cityId),
    startDate: search.startDate,
    endDate: search.endDate,
  };
  const { page, limit, offset } = search;
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
      page,
      limit,
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
        page,
        limit,
        offset,
        signal,
      });
    },
    enabled: selectedCity !== undefined,
  });
  const rows = weatherQuery.data?.data ?? [];
  const summary = weatherQuery.data?.summary;
  const handleApplyFilters = (nextFilters: WeatherFilters) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        cityId: Number(nextFilters.selection),
        startDate: nextFilters.startDate,
        endDate: nextFilters.endDate,
        page: 1,
        offset: 0,
      }),
    });
  };
  const handlePaginationChange = (nextPage: number, nextLimit: number) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        page: nextPage,
        limit: nextLimit,
        offset: (nextPage - 1) * nextLimit,
      }),
    });
  };

  const columns = createWeatherColumns<CityWeatherRecord>({
    formatTemperature,
    formatPrecipitation,
    precipitationUnit,
  });

  return (
    <div className="space-y-6">
      <div>
        <PageTitle eyebrow="weather data / cities" title="City weather" />
        <PageDescription>
          Review daily conditions for a selected city and date range.
        </PageDescription>
      </div>
      <WeatherResults
        selectionLabel="CITY"
        selectionOptions={(cityOptionsQuery.data ?? []).map((city) => ({
          value: String(city.id),
          label: `${city.name} (${city.region})`,
        }))}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        filterIsLoading={cityOptionsQuery.isLoading || weatherQuery.isFetching}
        optionsError={
          cityOptionsQuery.isError
            ? `Could not load city options: ${cityOptionsQuery.error.message}`
            : undefined
        }
        title="Weather records"
        itemLabel="city observations"
        rows={rows}
        columns={columns}
        rowKey={(row) => row.date}
        totalCount={weatherQuery.data?.total ?? 0}
        page={page}
        limit={limit}
        offset={weatherQuery.data?.offset ?? offset}
        onPaginationChange={handlePaginationChange}
        isLoading={cityOptionsQuery.isLoading || weatherQuery.isFetching}
        isError={cityOptionsQuery.isError || weatherQuery.isError}
        summary={summary}
      />
    </div>
  );
}
