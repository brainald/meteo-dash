import { useWeatherUnits } from "../context/useWeatherUnits";

function StatCard({
  label,
  value,
  note,
}: Readonly<{
  label: string;
  value: string;
  note: string;
}>) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-emerald-700">{note}</p>
    </article>
  );
}

export function Highlights() {
  const { formatTemperature } = useWeatherUnits();

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard label="CITIES MONITORED" value="128" note="+ 8 this month" />
      <StatCard label="REGIONS COVERED" value="24" note="Across 6 countries" />
      <StatCard
        label="Highest recorded temperature"
        value={formatTemperature(50)}
        note="Budapest, 2020. augusztus 28."
      />
    </section>
  );
}
