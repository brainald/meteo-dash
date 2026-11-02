import { WeatherSummaryCard } from "./WeatherSummaryCard";
import { useWeatherUnits } from "../context/useWeatherUnits";
import { formatDate } from "../utils/formatDate";
import type { WeatherSummary } from "../types/weatherSummary";

type SummariesProps = Readonly<{
  summary: WeatherSummary | undefined;
}>;

export function Summaries({ summary }: SummariesProps) {
  const { formatTemperature, formatPrecipitation } = useWeatherUnits();

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <WeatherSummaryCard
        label="WARMEST DAY"
        name={summary?.warmestDay ? formatDate(summary.warmestDay.date) : "—"}
        value={
          summary?.warmestDay
            ? formatTemperature(summary.warmestDay.value)
            : "No data"
        }
      />
      <WeatherSummaryCard
        label="COOLEST DAY"
        name={summary?.coolestDay ? formatDate(summary.coolestDay.date) : "—"}
        value={
          summary?.coolestDay
            ? formatTemperature(summary.coolestDay.value)
            : "No data"
        }
      />
      <WeatherSummaryCard
        label="WETTEST DAY"
        name={summary?.wettestDay ? formatDate(summary.wettestDay.date) : "—"}
        value={
          summary?.wettestDay
            ? formatPrecipitation(summary.wettestDay.value)
            : "No data"
        }
      />
    </section>
  );
}
