type PageTitleProps = {
  eyebrow: string;
  title: string;
};

export function PageTitle({ eyebrow, title }: Readonly<PageTitleProps>) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] text-sky-700">
        {eyebrow.toUpperCase()}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
    </div>
  );
}
