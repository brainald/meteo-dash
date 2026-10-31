import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { RadixIcon } from "./RadixIcon";

function FeatureCard({
  eyebrow,
  title,
  description,
  to,
  action,
  accent,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  to: "/city-weather" | "/region-weather";
  action: string;
  accent: "sky" | "indigo";
}>) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span
        className={classNames(
          "inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em] ring-1 bg-indigo-50 text-indigo-800 ring-indigo-100 hover:border-indigo-200",
          {
            "bg-sky-50 text-sky-800 ring-sky-100 hover:border-sky-200":
              accent === "sky",
          },
        )}
      >
        {eyebrow}
      </span>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-sky-800 hover:text-sky-600"
      >
        {action} <RadixIcon name="arrowRight" className="size-4" />
      </Link>
    </article>
  );
}

export function Features() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <FeatureCard
        eyebrow="CITY WEATHER"
        title="Weather by city"
        description="Filter daily observations for individual cities."
        to="/city-weather"
        action="OPEN CITY WEATHER"
        accent="sky"
      />
      <FeatureCard
        eyebrow="REGION WEATHER"
        title="Weather by region"
        description="Compare conditions across wider geographic areas."
        to="/region-weather"
        action="OPEN REGION WEATHER"
        accent="indigo"
      />
    </section>
  );
}
