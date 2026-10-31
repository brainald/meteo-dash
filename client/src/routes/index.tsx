import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome to MeteoDash</h2>
      <p className="text-gray-600">
        Explore weather observations by city or view regional averages.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/city-weather"
          className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
        >
          City weather
        </Link>
        <Link
          to="/region-weather"
          className="rounded-lg border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
        >
          Region weather
        </Link>
      </div>
    </section>
  );
}
