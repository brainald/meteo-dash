import type { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import type { RadixIconName } from "../RadixIcon";

export type NavigationType = {
  label: string;
  to: ComponentProps<typeof Link>["to"];
  icon: RadixIconName;
};

export interface NavigationComponentProps {
  navigationList: NavigationType[];
}
