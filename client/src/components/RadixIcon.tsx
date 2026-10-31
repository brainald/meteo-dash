import {
  DashboardIcon,
  GlobeIcon,
  HomeIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import type { ComponentProps } from "react";

const icons = {
  dashboard: DashboardIcon,
  city: HomeIcon,
  region: GlobeIcon,
  weather: SunIcon,
};

export type RadixIconName = keyof typeof icons;

type RadixIconProps = Omit<ComponentProps<typeof DashboardIcon>, "children"> & {
  name: RadixIconName;
};

export function RadixIcon({ name, ...props }: RadixIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
