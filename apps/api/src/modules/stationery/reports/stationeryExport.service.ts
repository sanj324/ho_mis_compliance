export class StationeryExportService {
  toCsv<T extends Record<string, unknown>>(rows: T[]): string {
    if (rows.length === 0) {
      return "";
    }

    const firstRow = rows[0]!;
    const headers = Object.keys(firstRow);
    const lines = rows.map((row) => headers.map((header) => String(row[header] ?? "")).join(","));
    return [headers.join(","), ...lines].join("\n");
  }
}

export const stationeryExportService = new StationeryExportService();
