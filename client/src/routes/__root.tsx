import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SideNavigation } from "../components/SideNavigation";
import { Header } from "../components/Header";
import { TopNavigation } from "../components/TopNavigation";
import type { NavigationType } from "../components/types/navigation";

export const Route = createRootRoute({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigationList: NavigationType[] = [
    { label: "Overview", to: "/", icon: "dashboard" },
    {
      label: "City weather",
      to: "/city-weather",
      icon: "city",
    },
    {
      label: "Region weather",
      to: "/region-weather",
      icon: "region",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SideNavigation navigationList={navigationList} />

      <div className="lg:pl-64">
        <Header />
        <TopNavigation navigationList={navigationList} />
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
