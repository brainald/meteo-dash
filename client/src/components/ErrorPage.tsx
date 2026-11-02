import { Link } from "@tanstack/react-router";

type ErrorPageProps = Readonly<{
  reset: () => void;
}>;

export function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <section
        role="alert"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
