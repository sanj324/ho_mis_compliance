export class PayrollExportService {
  toCsv(rows: Array<Record<string, unknown>>): string {
    if (!rows.length) {
      return "";
    }

    const firstRow = rows[0] ?? {};
    const headers = Object.keys(firstRow);
    return [headers.join(","), ...rows.map((row) => headers.map((header) => String(row[header] ?? "")).join(","))].join("\n");
  }
}

export const payrollExportService = new PayrollExportService();
