import type { Response } from "express";

type ExportFormat = "csv" | "excel" | "pdf";

const escapeCsvCell = (value: unknown): string => {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  return text;
};

const normalizeRows = <T extends Record<string, unknown>>(rows: T[]) =>
  rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, value ?? ""])
    )
  );

const buildCsv = <T extends Record<string, unknown>>(rows: T[]): string => {
  if (rows.length === 0) {
    return "";
  }

  const normalizedRows = normalizeRows(rows);
  const headers = Object.keys(normalizedRows[0] ?? {});
  const lines = normalizedRows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(","));

  return [headers.join(","), ...lines].join("\n");
};

const escapeXml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildExcelXml = <T extends Record<string, unknown>>(rows: T[], worksheetName: string): string => {
  const normalizedRows = normalizeRows(rows);
  const headers = Object.keys(normalizedRows[0] ?? {});
  const headerCells = headers
    .map((header) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`)
    .join("");
  const bodyRows = normalizedRows
    .map(
      (row) =>
        `<Row>${headers
          .map((header) => `<Cell><Data ss:Type="String">${escapeXml(row[header])}</Data></Cell>`)
          .join("")}</Row>`
    )
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#DCE6F1" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(worksheetName)}">
  <Table>
   <Row>${headerCells}</Row>
   ${bodyRows}
  </Table>
 </Worksheet>
</Workbook>`;
};

const escapePdfText = (value: string): string =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const buildPdf = <T extends Record<string, unknown>>(rows: T[], title: string): Buffer => {
  const normalizedRows = normalizeRows(rows);
  const headers = Object.keys(normalizedRows[0] ?? {});
  const lines =
    headers.length === 0
      ? [title, "", "No data available"]
      : [
          title,
          "",
          headers.join(" | "),
          "-".repeat(headers.join(" | ").length),
          ...normalizedRows.map((row) => headers.map((header) => String(row[header] ?? "")).join(" | "))
        ];

  const pageHeight = 792;
  const left = 40;
  const top = 760;
  const lineHeight = 14;
  const maxLinesPerPage = 48;
  const pageChunks: string[][] = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pageChunks.push(lines.slice(index, index + maxLinesPerPage));
  }

  const objects: string[] = [];
  const pageIds: number[] = [];
  const contentIds: number[] = [];
  const fontId = 3;

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Pages /Kids [] /Count 0 >>";
  objects[fontId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  let objectId = 4;

  for (const chunk of pageChunks) {
    const contentLines = chunk
      .map((line, index) => `BT /F1 10 Tf ${left} ${top - index * lineHeight} Td (${escapePdfText(line)}) Tj ET`)
      .join("\n");
    const contentStream = `<< /Length ${contentLines.length} >>\nstream\n${contentLines}\nendstream`;
    const currentContentId = objectId++;
    const currentPageId = objectId++;

    objects[currentContentId] = contentStream;
    objects[currentPageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 ${pageHeight}] ` +
      `/Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${currentContentId} 0 R >>`;

    contentIds.push(currentContentId);
    pageIds.push(currentPageId);
  }

  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let index = 1; index < objects.length; index += 1) {
    const body = objects[index];
    if (!body) {
      continue;
    }

    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${body}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    const offset = offsets[index] ?? 0;
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "binary");
};

export const sendReportExport = <T extends Record<string, unknown>>(
  response: Response,
  options: {
    fileBaseName: string;
    worksheetName: string;
    title: string;
    format: ExportFormat;
    rows: T[];
  }
): void => {
  const { fileBaseName, worksheetName, title, format, rows } = options;

  if (format === "csv") {
    response
      .status(200)
      .setHeader("Content-Type", "text/csv; charset=utf-8")
      .setHeader("Content-Disposition", `attachment; filename="${fileBaseName}.csv"`)
      .send(buildCsv(rows));
    return;
  }

  if (format === "excel") {
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.ms-excel")
      .setHeader("Content-Disposition", `attachment; filename="${fileBaseName}.xls"`)
      .send(buildExcelXml(rows, worksheetName));
    return;
  }

  response
    .status(200)
    .setHeader("Content-Type", "application/pdf")
    .setHeader("Content-Disposition", `attachment; filename="${fileBaseName}.pdf"`)
    .send(buildPdf(rows, title));
};

export type { ExportFormat };
