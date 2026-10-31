import { Link } from "@tanstack/react-router";
import type { NavigationComponentProps } from "./types/navigation";
import { NavigationListItem } from "./NavigationListItem";
import { Settings } from "./Settings";

export function SideNavigation({
  navigationList,
}: Readonly<NavigationComponentProps>) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-slate-950 text-slate-300 lg:flex">
      <Link to="/" className="border-b border-white/10 px-7 py-7">
        <span className="block text-2xl font-bold tracking-tight text-white">
          Meteo<span className="text-sky-400">.</span>
        </span>
        <span className="mt-1 block text-[10px] font-semibold tracking-[0.24em] text-slate-500">
          WEATHER DASHBOARD
        </span>
      </Link>

      <div className="px-5 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500">
          WORKSPACE
        </p>
        <nav>
          {navigationList.map((item) => (
            <NavigationListItem
              key={item.to}
              item={item}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition"
              activeClassName="bg-sky-500/15 font-semibold text-sky-300"
              hoverClassName="text-slate-400 hover:bg-white/5 hover:text-white"
            />
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-white/10 px-5 py-4">
        <Settings />
      </div>
    </aside>
  );
}
