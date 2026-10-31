import { RadixIcon } from "./RadixIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <RadixIcon name="weather" className="size-5 text-sky-700" />
        <span>Weather intelligence</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-slate-500 sm:inline">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </header>
  );
}
