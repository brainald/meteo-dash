import type { ReactNode } from "react";

export type WeatherColumn<T> = {
  header: string;
  value: (row: T) => string;
  render?: (row: T) => ReactNode;
  className?: string;
};
