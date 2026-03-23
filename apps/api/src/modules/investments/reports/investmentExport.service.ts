export class InvestmentExportService {
  toCsv(rows: Array<Record<string, unknown>>): string {
    if (!rows.length) {
      return "";
    }

    const headers = Object.keys(rows[0] ?? {});
    return [headers.join(","), ...rows.map((row) => headers.map((header) => String(row[header] ?? "")).join(","))].join("\n");
  }
}

export const investmentExportService = new InvestmentExportService();
