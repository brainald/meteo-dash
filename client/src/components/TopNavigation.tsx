import type { NavigationComponentProps } from "./types/navigation";
import { NavigationListItem } from "./NavigationListItem";

export function TopNavigation({
  navigationList,
}: Readonly<NavigationComponentProps>) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden"
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
  );
}
