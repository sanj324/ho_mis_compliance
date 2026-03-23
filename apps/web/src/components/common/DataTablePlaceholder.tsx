import type { ReactElement, ReactNode } from "react";

type DataTablePlaceholderProps = {
  columns: string[];
  rows: Array<Record<string, ReactNode>>;
};

export const DataTablePlaceholder = ({
  columns,
  rows
}: DataTablePlaceholderProps): ReactElement => (
  <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/90 shadow-[0_20px_65px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
    <table className="min-w-full border-collapse">
      <thead className="bg-slate-50/90">
        <tr>
          {columns.map((column) => (
            <th key={column} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-200/80 bg-white/80 even:bg-slate-50/55">
              {columns.map((column) => (
                <td key={column} className="px-4 py-3.5 text-sm text-slate-700">
                  {row[column] ?? "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
              No records available yet for this view.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
