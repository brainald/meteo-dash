import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { WeatherUnitsProvider } from "./context/WeatherUnitsProvider";

export function App() {
  return (
    <WeatherUnitsProvider>
      <RouterProvider router={router} />
    </WeatherUnitsProvider>
  );
}
