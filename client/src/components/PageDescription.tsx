type PageDescriptionProps = {
  children: string;
};

export function PageDescription({ children }: PageDescriptionProps) {
  return (
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
      {children}
    </p>
  );
}
