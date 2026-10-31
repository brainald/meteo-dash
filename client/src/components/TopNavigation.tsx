import type { NavigationComponentProps } from "./types/navigation";
import { NavigationListItem } from "./NavigationListItem";
import { Settings } from "./Settings";

export function TopNavigation({
  navigationList,
}: Readonly<NavigationComponentProps>) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-2 py-1 lg:hidden">
      <nav
        aria-label="Mobile navigation"
        className="flex gap-1 overflow-x-auto"
      >
        {navigationList.map((item) => (
          <NavigationListItem
            key={item.to}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold"
            activeClassName="bg-sky-50 text-sky-800"
            hoverClassName="text-slate-500 hover:bg-slate-50"
            item={item}
            hideIcon
          />
        ))}
      </nav>
      <div className="shrink-0">
        <Settings variant="mobile" />
      </div>
    </div>
  );
}
