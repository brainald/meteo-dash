import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { useCallback, useState } from "react";
import type { ChangeEvent, ComponentProps } from "react";
import { useWeatherUnits } from "../context/useWeatherUnits";

type SettingsProps = Readonly<{
  variant?: "sidebar" | "mobile";
}>;

const selectClassName =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

export function Settings({ variant = "sidebar" }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    temperatureUnit,
    precipitationUnit,
    setTemperatureUnit,
    setPrecipitationUnit,
  } = useWeatherUnits();

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleTemperatureChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.currentTarget;
      if (value === "celsius" || value === "fahrenheit") {
        setTemperatureUnit(value);
      }
    },
    [setTemperatureUnit],
  );

  const handlePrecipitationChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.currentTarget;
      if (value === "millimeters" || value === "inches") {
        setPrecipitationUnit(value);
      }
    },
    [setPrecipitationUnit],
  );

  const triggerClassName = classNames(
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
    {
      "text-slate-400 hover:bg-white/5 hover:text-white w-full":
        variant === "sidebar",
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900":
        variant === "mobile",
    },
  );

  const contentPosition: Pick<
    ComponentProps<typeof Popover.Content>,
    "side" | "align"
  > = variant === "sidebar"
    ? { side: "right", align: "end" }
    : { side: "bottom", align: "end" };

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button type="button" className={triggerClassName}>
          <GearIcon className="size-5 shrink-0" aria-hidden="true" />
          <span>Settings</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          {...contentPosition}
          sideOffset={8}
          collisionPadding={12}
          className="z-50 w-64 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
        >
          <div className="mb-4 flex items-center justify-between">
            <Popover.Title className="text-sm font-semibold">
              Display units
            </Popover.Title>
            <Popover.Close
              aria-label="Close settings"
              className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Cross2Icon aria-hidden="true" />
            </Popover.Close>
          </div>
          <label className="mb-3 block text-xs font-medium text-slate-600">
            <span className="block">Temperature</span>
            <select
              id="temperature-unit"
              name="temperatureUnit"
              value={temperatureUnit}
              onChange={handleTemperatureChange}
              className={selectClassName}
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-slate-600">
            <span className="block">Precipitation</span>
            <select
              id="precipitation-unit"
              name="precipitationUnit"
              value={precipitationUnit}
              onChange={handlePrecipitationChange}
              className={selectClassName}
            >
              <option value="millimeters">Millimeters (mm)</option>
              <option value="inches">Inches (in)</option>
            </select>
          </label>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
