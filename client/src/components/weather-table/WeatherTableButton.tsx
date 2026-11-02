import type { ReactNode } from "react";
import { RadixIcon, type RadixIconName } from "../RadixIcon";

type WeatherTableButtonProps = Readonly<{
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon?: RadixIconName;
  variant: "export" | "pagination";
}>;

const buttonStyles = {
  export:
    "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50",
  pagination:
    "rounded-md border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50",
};

export function WeatherTableButton({
  children,
  onClick,
  disabled = false,
  icon,
  variant,
}: WeatherTableButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles[variant]}
    >
      {icon && <RadixIcon name={icon} className="size-4" />}
      {children}
    </button>
  );
}
