import { useMemo } from "react";
import { useWeatherUnits } from "../../context/useWeatherUnits";
import { formatDate } from "../../utils/formatDate";
import type { WeatherColumn } from "./types";

type WeatherTableFooterProps<T> = Readonly<{
  columns: WeatherColumn<T>[];
  rows: T[];
  isLoading?: boolean;
  isError?: boolean;
}>;

export function WeatherTableFooter<T>({
  columns,
  rows,
  isLoading,
  isError,
}: WeatherTableFooterProps<T>) {
  const { formatTemperature, formatPrecipitation } = useWeatherUnits();

  const statistics = useMemo(
    () =>
      columns.map((column) => {
        const formatValue = (value: number) => {
          switch (column.statisticType) {
            case "date":
              return formatDate(new Date(value).toISOString().slice(0, 10));
            case "temperature":
              return formatTemperature(value);
            case "precipitation":
              return formatPrecipitation(value);
            default:
              return String(value);
          }
        };
        const numericValues = column.numericValue
          ? rows.map(column.numericValue).filter(Number.isFinite)
          : [];
        const sortedValues = [...numericValues].sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedValues.length / 2);
        let median: number | null = null;
        if (sortedValues.length > 0) {
          if (sortedValues.length % 2 === 0) {
            median =
              (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
          } else {
            median = sortedValues[middleIndex];
          }
        }

        const frequencies = new Map<string, { count: number; value: string }>();
        rows.forEach((row) => {
          const numericValue = column.numericValue?.(row);
          if (numericValue !== undefined && !Number.isFinite(numericValue)) {
            return;
          }

          const key =
            numericValue === undefined
              ? column.value(row)
              : String(numericValue);
          const frequency = frequencies.get(key);
          frequencies.set(key, {
            count: (frequency?.count ?? 0) + 1,
            value: numericValue === undefined ? key : formatValue(numericValue),
          });
        });

        const maxFrequency = Math.max(
          0,
          ...Array.from(frequencies.values(), ({ count }) => count),
        );
        const modes =
          maxFrequency > 1
            ? Array.from(frequencies.values())
                .filter(({ count }) => count === maxFrequency)
                .map(({ value }) => value)
            : [];

        return {
          median: median === null ? "—" : formatValue(median),
          mode: modes.length > 0 ? modes.join(", ") : "No mode",
        };
      }),
    [columns, formatPrecipitation, formatTemperature, rows],
  );

  return (
    <tfoot className="border-t-2 border-slate-200 bg-slate-50 text-left">
      <tr>
        {statistics.map((statistic, index) => (
          <td
            key={columns[index].header}
            className="whitespace-nowrap px-5 py-3 text-xs text-slate-700 sm:px-6"
          >
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Median (page)
            </span>
            <span className="font-semibold">
              {isLoading || isError ? "—" : statistic.median}
            </span>
          </td>
        ))}
      </tr>
      <tr>
        {statistics.map((statistic, index) => (
          <td
            key={columns[index].header}
            className="whitespace-nowrap px-5 py-3 text-xs text-slate-700 sm:px-6"
          >
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Mode (page)
            </span>
            <span className="font-semibold">
              {isLoading || isError ? "—" : statistic.mode}
            </span>
          </td>
        ))}
      </tr>
    </tfoot>
  );
}
