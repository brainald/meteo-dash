import { createFileRoute } from "@tanstack/react-router";
import { PageDescription } from "../components/PageDescription";
import { PageTitle } from "../components/PageTitle";
import { ExploreCard } from "../components/ExploreCard";
import { Highlights } from "../components/Highlights";
import { Features } from "../components/Features";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="space-y-7">
      <div>
        <PageTitle eyebrow="overview / home" title="Weather at a glance" />
        <PageDescription>
          A calm, data-first workspace for monitoring weather across cities and
          regions.
        </PageDescription>
      </div>

      <ExploreCard />

      <Highlights />

      <Features />

      <p className="pb-2 text-[10px] font-semibold tracking-[0.16em] text-slate-400">
        METEODASHBOARD <span className="px-1">·</span> UI CONCEPT{" "}
        <span className="px-1">·</span> SAMPLE DATA
      </p>
    </div>
  );
}
