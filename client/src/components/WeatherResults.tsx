import { WeatherFilterForm } from "./WeatherFilterForm";
import type {
  WeatherFilterOption,
  WeatherFilters,
} from "./WeatherFilterForm";
import {
  WeatherTable,
  type WeatherColumn,
} from "./weather-table/WeatherTable";
import { Summaries } from "./Summaries";
import type { WeatherSummary } from "../types/weatherSummary";

type WeatherResultsProps<T> = Readonly<{
  selectionLabel: string;
  selectionOptions: WeatherFilterOption[];
  filters: WeatherFilters;
  onApplyFilters: (filters: WeatherFilters) => void;
  filterIsLoading: boolean;
  optionsError?: string;
  title: string;
  itemLabel: string;
  rows: T[];
  columns: WeatherColumn<T>[];
  rowKey: (row: T) => string;
  totalCount: number;
  page: number;
  limit: number;
  offset: number;
  onPaginationChange: (page: number, limit: number) => void;
  isLoading: boolean;
  isError: boolean;
  summary: WeatherSummary | undefined;
}>;

export function WeatherResults<T>({
  selectionLabel,
  selectionOptions,
  filters,
  onApplyFilters,
  filterIsLoading,
  optionsError,
  title,
  itemLabel,
  rows,
  columns,
  rowKey,
  totalCount,
  page,
  limit,
  offset,
  onPaginationChange,
  isLoading,
  isError,
  summary,
}: WeatherResultsProps<T>) {
  return (
    <>
      <WeatherFilterForm
        key={`${filters.selection}:${filters.startDate}:${filters.endDate}`}
        selectionLabel={selectionLabel}
        selectionOptions={selectionOptions}
        initialFilters={filters}
        onApply={onApplyFilters}
        isLoading={filterIsLoading}
      />
      {optionsError && (
        <p role="alert" className="text-sm text-red-700">
          {optionsError}
        </p>
      )}
      <WeatherTable
        isLoading={isLoading}
        isError={isError}
        title={title}
        itemLabel={itemLabel}
        rows={rows}
        columns={columns}
        rowKey={rowKey}
        totalCount={totalCount}
        page={page}
        limit={limit}
        offset={offset}
        onPaginationChange={onPaginationChange}
      />
      <Summaries summary={summary} />
    </>
  );
}
