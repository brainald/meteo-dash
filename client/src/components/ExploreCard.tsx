import { Link } from "@tanstack/react-router";
import { RadixIcon } from "./RadixIcon";

export function ExploreCard() {
  const hour = new Date().getHours();
  let welcomeText: string;
  if (hour < 12) {
    welcomeText = "Good morning";
  } else if (hour < 18) {
    welcomeText = "Good afternoon";
  } else {
    welcomeText = "Good evening";
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 px-7 py-9 text-white shadow-lg sm:px-10 sm:py-12">
      <div className="relative z-10 max-w-2xl">
        <p className="text-xs font-bold tracking-[0.18em] text-sky-300">
          {welcomeText}
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Understand the weather.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
          Explore current conditions and historical trends in one place.
        </p>
        <Link
          to="/city-weather"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-3 text-xs font-bold tracking-wide text-slate-950 transition hover:bg-sky-300"
        >
          EXPLORE DASHBOARD <RadixIcon name="arrowRight" className="size-4" />
        </Link>
      </div>
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-20 size-80 rounded-full border border-sky-300/10 bg-sky-300/5 sm:right-8 sm:top-1/2 sm:-translate-y-1/2"
      >
        <div className="absolute inset-8 rounded-full border border-sky-300/10" />
        <div className="absolute inset-16 rounded-full border border-sky-300/10" />
        <div className="absolute right-16 top-16 text-sky-200/80">
          <RadixIcon name="sunny" className="size-24" />
        </div>
      </div>
    </section>
  );
}
