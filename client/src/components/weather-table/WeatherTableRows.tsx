import classNames from "classnames";
import type { WeatherColumn } from "./types";

type WeatherTableRowProps<T> = Readonly<{
  row: T;
  columns: WeatherColumn<T>[];
}>;

export function WeatherTableRow<T>({ row, columns }: WeatherTableRowProps<T>) {
  return (
    <tr className="transition hover:bg-sky-50/40">
      {columns.map((column) => (
        <td
          key={column.header}
          className={classNames(
            "whitespace-nowrap px-5 py-4 text-sm text-slate-600 sm:px-6",
            column.className,
          )}
        >
          {column.render ? column.render(row) : column.value(row)}
        </td>
      ))}
    </tr>
  );
}

type WeatherTableRowsProps<T> = Readonly<{
  rows: T[];
  columns: WeatherColumn<T>[];
  rowKey: (row: T) => string;
}>;

export function WeatherTableRows<T>({
  rows,
  columns,
  rowKey,
}: WeatherTableRowsProps<T>) {
  return (
    <>
      {rows.map((row) => (
        <WeatherTableRow key={rowKey(row)} row={row} columns={columns} />
      ))}
    </>
  );
}
