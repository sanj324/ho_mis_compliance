import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = (): ReactElement => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-8 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-600">Route Missing</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">We could not find the page you were looking for.</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        The link may be outdated, or the page may not be available in this environment yet.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Go to dashboard
        </Link>
        <Link
          to="/login"
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          Go to login
        </Link>
      </div>
    </div>
  </div>
);
