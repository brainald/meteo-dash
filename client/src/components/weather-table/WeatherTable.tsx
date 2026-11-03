import { useCallback, useMemo } from "react";
import { exportCsv } from "../../utils/exportCsv";
import { WeatherTableError } from "./WeatherTableError";
import { WeatherTableButton } from "./WeatherTableButton";
import { WeatherTableFooter } from "./WeatherTableFooter";
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
  page: number;
  limit: number;
  offset: number;
  onPaginationChange: (page: number, limit: number) => void;
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
  page,
  limit,
  offset,
  onPaginationChange,
  isError,
  isLoading,
}: Readonly<WeatherTableProps<T>>) {
  const handleExportCsv = useCallback(() => {
    exportCsv({ columns, rows, itemLabel });
  }, [columns, itemLabel, rows]);

  const isExportDisabled = isLoading || isError || rows.length === 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / limit));
  const firstRow = rows.length > 0 ? offset + 1 : 0;
  const lastRow = offset + rows.length;

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
        <WeatherTableButton
          variant="export"
          icon="download"
          onClick={handleExportCsv}
          disabled={isExportDisabled}
        >
          Export CSV
        </WeatherTableButton>
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
          <WeatherTableFooter
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            isError={isError}
          />
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <label className="flex w-fit items-center gap-2">
          <span>Rows per page</span>
          <select
            aria-label="Rows per page"
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
            value={limit}
            onChange={(event) =>
              onPaginationChange(1, Number(event.currentTarget.value))
            }
            disabled={isLoading || isError}
          >
            {[10, 25, 50, 100].map((pageLimit) => (
              <option key={pageLimit} value={pageLimit}>
                {pageLimit}
              </option>
            ))}
          </select>
        </label>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
          <span className="break-words sm:whitespace-nowrap">
            {firstRow}–{lastRow} of {totalCount} · Page {page} of {pageCount}
          </span>
          <div className="flex justify-end gap-2">
            <WeatherTableButton
              variant="pagination"
              onClick={() => onPaginationChange(page - 1, limit)}
              disabled={isLoading || isError || page <= 1}
            >
              Previous
            </WeatherTableButton>
            <WeatherTableButton
              variant="pagination"
              onClick={() => onPaginationChange(page + 1, limit)}
              disabled={isLoading || isError || page >= pageCount}
            >
              Next
            </WeatherTableButton>
          </div>
        </div>
      </div>
    </section>
  );
}
