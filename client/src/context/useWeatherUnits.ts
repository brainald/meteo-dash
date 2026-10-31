import { useContext } from "react";
import { WeatherUnitsContext } from "./weatherUnits";

export function useWeatherUnits() {
  const context = useContext(WeatherUnitsContext);
  if (!context) {
    throw new Error("useWeatherUnits must be used within WeatherUnitsProvider");
  }
  return context;
}
