import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/region-weather")({
  component: RegionWeather,
});

function RegionWeather() {
  return (
    <section>
      <h2 className="text-2xl font-semibold">Region weather</h2>
      <p className="mt-2 text-gray-600">
        View average weather data for a selected region and date range.
      </p>
    </section>
  );
}
