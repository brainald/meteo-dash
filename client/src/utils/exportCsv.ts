type Column<T> = {
  header: string;
  value: (row: T) => string;
};

type ExportCsvType<T> = {
  columns: Column<T>[];
  rows: T[];
  itemLabel: string;
};

export const exportCsv = <T>({
  columns,
  rows,
  itemLabel,
}: ExportCsvType<T>) => {
  const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = [
    columns.map((column) => escapeCsv(column.header)).join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCsv(column.value(row))).join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${itemLabel.replaceAll(" ", "-")}.csv`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
