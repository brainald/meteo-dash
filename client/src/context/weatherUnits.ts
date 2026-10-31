import { createContext } from "react";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type PrecipitationUnit = "millimeters" | "inches";

export type WeatherUnitsContextValue = {
  temperatureUnit: TemperatureUnit;
  precipitationUnit: PrecipitationUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setPrecipitationUnit: (unit: PrecipitationUnit) => void;
  formatTemperature: (celsius: number) => string;
  formatPrecipitation: (millimeters: number) => string;
};

export const WeatherUnitsContext =
  createContext<WeatherUnitsContextValue | null>(null);
