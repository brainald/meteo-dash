type WeatherSummaryCardProps = Readonly<{
  label: string;
  name: string;
  value: string;
}>;

export function WeatherSummaryCard({
  label,
  name,
  value,
}: WeatherSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-[9px] font-bold tracking-[0.13em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-slate-800">{name}</p>
        <p className="text-xs text-slate-500">{value}</p>
      </div>
    </article>
  );
}
