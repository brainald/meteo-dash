import { useCallback, useMemo } from "react";
import { RadixIcon } from "../RadixIcon";
import { exportCsv } from "../../utils/exportCsv";
import { WeatherTableError } from "./WeatherTableError";
import { WeatherTableRows } from "./WeatherTableRows";
import { WeatherTableSkeleton } from "./WeatherTableSkeleton";
import type { WeatherColumn } from "./types";

export type { WeatherColumn } from "./types";

type WeatherTableProps<T> = {
  title: string;
  itemLabel: string;
  rows: T[];
  columns: WeatherColumn<T>[];
  rowKey: (row: T) => string;
  totalCount: number;
  rowsPerPage?: number;
  isError?: boolean;
  isLoading?: boolean;
};

export function WeatherTable<T>({
  title,
  itemLabel,
  rows,
  columns,
  rowKey,
  totalCount,
  rowsPerPage = 10,
  isError,
  isLoading,
}: Readonly<WeatherTableProps<T>>) {
  const handleExportCsv = useCallback(() => {
    exportCsv({ columns, rows, itemLabel });
  }, [columns, itemLabel, rows]);

  const isExportDisabled = isLoading || isError || rows.length === 0;

  const message = useMemo(() => {
    if (isLoading) {
      return `Loading ${itemLabel}...`;
    }
    if (isError) {
      return `Could not load ${itemLabel}`;
    }
    return `Showing ${rows.length} of ${totalCount} ${itemLabel}`;
  }, [isError, isLoading, itemLabel, rows.length, totalCount]);

  const tableBodyContent = useMemo(() => {
    if (isLoading) {
      return <WeatherTableSkeleton columns={columns} />;
    }

    if (isError) {
      return <WeatherTableError colSpan={columns.length} />;
    }

    if (rows.length > 0) {
      return <WeatherTableRows rows={rows} columns={columns} rowKey={rowKey} />;
    }

    return (
      <tr>
        <td
          colSpan={columns.length}
          className="px-6 py-12 text-center text-sm text-slate-500"
        >
          No weather records match the selected filters.
        </td>
      </tr>
    );
  }, [columns, isError, isLoading, rowKey, rows]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{message}</p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={isExportDisabled}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RadixIcon name="download" className="size-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className={`whitespace-nowrap px-5 py-3 text-[10px] font-bold tracking-[0.13em] text-slate-500 sm:px-6 ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableBodyContent}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
        <span>Rows per page: {rowsPerPage}</span>
        <span>
          {rows.length === 0 ? 0 : 1}–{rows.length} of {totalCount}
        </span>
      </div>
    </section>
  );
}
