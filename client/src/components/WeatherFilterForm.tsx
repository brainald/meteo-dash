import { useState } from "react";
import { RadixIcon } from "./RadixIcon";

export type WeatherFilters = {
  selection: string;
  startDate: string;
  endDate: string;
};

export type WeatherFilterOption = Readonly<{
  value: string;
  label: string;
}>;

type WeatherFilterFormProps = {
  selectionLabel: string;
  selectionOptions: WeatherFilterOption[];
  initialFilters: WeatherFilters;
  onApply: (filters: WeatherFilters) => void;
  isLoading?: boolean;
};

export function WeatherFilterForm({
  selectionLabel,
  selectionOptions,
  initialFilters,
  onApply,
  isLoading,
}: Readonly<WeatherFilterFormProps>) {
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState<string | null>(null);

  const updateFilter = (key: keyof WeatherFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (filters.startDate > filters.endDate) {
      setError("The start date must be on or before the end date.");
      return;
    }

    setError(null);
    onApply(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setError(null);
    onApply(initialFilters);
  };

  const inputClassName =
    "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <RadixIcon name="filter" className="size-4 text-sky-700" />
        <h2 className="text-xs font-bold tracking-[0.14em] text-slate-700">
          FILTER DATA
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_auto_auto] lg:items-end">
        <label className="block text-[10px] font-bold tracking-[0.13em] text-slate-500">
          {selectionLabel}
          <select
            value={filters.selection}
            onChange={(event) => updateFilter("selection", event.target.value)}
            className={inputClassName}
          >
            {selectionOptions.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const label = typeof option === "string" ? option : option.label;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </label>

        <label className="block text-[10px] font-bold tracking-[0.13em] text-slate-500">
          <span>START DATE</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => updateFilter("startDate", event.target.value)}
            className={inputClassName}
            required
          />
        </label>

        <label className="block text-[10px] font-bold tracking-[0.13em] text-slate-500">
          <span>END DATE</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => updateFilter("endDate", event.target.value)}
            className={inputClassName}
            required
          />
        </label>

        <button
          type="submit"
          className="h-11 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
          disabled={isLoading}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="h-11 px-3 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          Reset
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-600">
          {error}
        </p>
      )}
    </form>
  );
}
