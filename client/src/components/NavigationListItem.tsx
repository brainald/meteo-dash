import { Link, useRouterState } from "@tanstack/react-router";
import type { NavigationType } from "./types/navigation";
import classNames from "classnames";
import { RadixIcon } from "./RadixIcon";

type NavigationListItemProps = {
  item: NavigationType;
  hideIcon?: boolean;
  className?: string;
  activeClassName?: string;
  hoverClassName?: string;
};

export function NavigationListItem({
  item,
  className,
  hideIcon,
  activeClassName = "",
  hoverClassName = "",
}: Readonly<NavigationListItemProps>) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isActive = item.to === pathname;
  return (
    <Link
      key={item.to}
      to={item.to}
      className={classNames(className, {
        [activeClassName]: isActive,
        [hoverClassName]: !isActive,
      })}
    >
      {!hideIcon && <RadixIcon name={item.icon} className="size-5" />}
      {item.label}
    </Link>
  );
}
