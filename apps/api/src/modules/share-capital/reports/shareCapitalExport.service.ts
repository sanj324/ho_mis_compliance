export class ShareCapitalExportService {
  toCsv(rows: Array<Record<string, string | number | null>>) {
    if (rows.length === 0) {
      return "";
    }

    const firstRow = rows[0];
    if (!firstRow) {
      return "";
    }
    const headers = Object.keys(firstRow);
    const lines = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
          })
          .join(",")
      )
    ];

    return lines.join("\n");
  }
}

export const shareCapitalExportService = new ShareCapitalExportService();
