import { useQuery } from "@tanstack/react-query";
import {
  fetchCoveredRegions,
  fetchHighestTemperature,
  fetchMonitoredCities,
} from "../api/highlights";
import { useWeatherUnits } from "../context/useWeatherUnits";
import { useMemo } from "react";

type StatCardProps = Readonly<{
  label: string;
  loading: boolean;
  value?: string;
  note?: string;
  error?: boolean;
}>;

function StatCard({ label, loading, value, note, error }: StatCardProps) {
  const displayNote = useMemo(() => !error && note, [error, note]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {loading ? "..." : value || "Unavailable"}
      </p>
      {error ? (
        <p className="mt-1 text-xs text-red-700">Something went wrong</p>
      ) : null}
      {displayNote ? (
        <p className="mt-1 text-xs text-emerald-700">{note}</p>
      ) : null}
    </article>
  );
}

export function Highlights() {
  const { formatTemperature } = useWeatherUnits();
  const monitoredCities = useQuery({
    queryKey: ["highlights", "monitored-cities"],
    queryFn: fetchMonitoredCities,
  });
  const coveredRegions = useQuery({
    queryKey: ["highlights", "covered-regions"],
    queryFn: fetchCoveredRegions,
  });
  const highestTemperatureQuery = useQuery({
    queryKey: ["highlights", "highest-temperature"],
    queryFn: fetchHighestTemperature,
  });

  const highestTemperatureNote = useMemo(() => {
    const highestTemperature = highestTemperatureQuery.data;
    if (highestTemperature) {
      const formattedDate = new Intl.DateTimeFormat("hu-HU", {
        dateStyle: "long",
      }).format(new Date(`${highestTemperature.date}T00:00:00`));
      return `${highestTemperature.city}, ${formattedDate}`;
    }
    return "No recorded data";
  }, [highestTemperatureQuery.data]);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="CITIES MONITORED"
        value={monitoredCities.data ? String(monitoredCities.data) : undefined}
        loading={monitoredCities.isPending}
        note="Currently in the database"
        error={monitoredCities.isError}
      />
      <StatCard
        label="REGIONS COVERED"
        value={coveredRegions.data ? String(coveredRegions.data) : undefined}
        loading={coveredRegions.isPending}
        note="Based on monitored cities"
        error={coveredRegions.isError}
      />
      <StatCard
        label="Highest recorded temperature"
        value={
          highestTemperatureQuery.data
            ? formatTemperature(highestTemperatureQuery.data.temperature)
            : undefined
        }
        note={highestTemperatureNote}
        loading={highestTemperatureQuery.isPending}
        error={highestTemperatureQuery.isError}
      />
    </section>
  );
}
