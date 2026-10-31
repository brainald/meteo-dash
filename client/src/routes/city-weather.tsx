import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/city-weather")({
  component: CityWeather,
});

export function CityWeather() {
  return (
    <section>
      <h2 className="text-2xl font-semibold">City weather</h2>
      <p className="mt-2 text-gray-600">
        View weather data for a selected city and date range.
      </p>
    </section>
  );
}
