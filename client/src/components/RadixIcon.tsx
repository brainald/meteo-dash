import {
  ArrowRightIcon,
  DashboardIcon,
  DownloadIcon,
  GearIcon,
  GlobeIcon,
  HomeIcon,
  InfoCircledIcon,
  MixerHorizontalIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import type { ComponentProps } from "react";

const icons = {
  arrowRight: ArrowRightIcon,
  dashboard: DashboardIcon,
  download: DownloadIcon,
  filter: MixerHorizontalIcon,
  settings: GearIcon,
  info: InfoCircledIcon,
  city: HomeIcon,
  region: GlobeIcon,
  weather: SunIcon,
  sunny: SunIcon,
};

export type RadixIconName = keyof typeof icons;

type RadixIconProps = Omit<ComponentProps<typeof DashboardIcon>, "children"> & {
  name: RadixIconName;
};

export function RadixIcon({ name, ...props }: RadixIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
