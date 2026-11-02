import type { WeatherColumn } from "./types";

export function WeatherTableSkeleton<T>({
  columns,
}: Readonly<{ columns: WeatherColumn<T>[] }>) {
  return (
    <>
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} aria-hidden="true">
          {columns.map((column) => (
            <td key={column.header} className="px-5 py-4 sm:px-6">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
