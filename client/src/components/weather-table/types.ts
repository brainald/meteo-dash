export type WeatherColumn<T> = {
  header: string;
  value: (row: T) => string;
  className?: string;
  numericValue?: (row: T) => number;
  statisticType?: "date" | "temperature" | "precipitation";
};
