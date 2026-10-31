import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  PrecipitationUnit,
  TemperatureUnit,
  WeatherUnitsContextValue,
} from "./weatherUnits";
import { WeatherUnitsContext } from "./weatherUnits";

export function WeatherUnitsProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>("celsius");
  const [precipitationUnit, setPrecipitationUnit] =
    useState<PrecipitationUnit>("millimeters");

  const value = useMemo<WeatherUnitsContextValue>(
    () => ({
      temperatureUnit,
      precipitationUnit,
      setTemperatureUnit,
      setPrecipitationUnit,
      formatTemperature: (celsius) =>
        temperatureUnit === "celsius"
          ? `${Number(celsius.toFixed(1))} °C`
          : `${Number(((celsius * 9) / 5 + 32).toFixed(1))} °F`,
      formatPrecipitation: (millimeters) =>
        precipitationUnit === "millimeters"
          ? `${Number(millimeters.toFixed(1))} mm`
          : `${Number((millimeters / 25.4).toFixed(2))} in`,
    }),
    [temperatureUnit, precipitationUnit],
  );

  return (
    <WeatherUnitsContext.Provider value={value}>
      {children}
    </WeatherUnitsContext.Provider>
  );
}
