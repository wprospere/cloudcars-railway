// server/invoiceImport.ts
// Parses the "Abstract Invoice" export from Wayne's dispatch system
// (columns: Code, Number, Date, Period, Account, Amount Adj Total, ...)
// into rows ready for createInvoice().

import * as XLSX from "xlsx";

export type ParsedInvoiceRow =
  | {
      ok: true;
      rowNum: number;
      invoiceNumber: string;
      amountPence: number;
      issueDate: string | null;
    }
  | { ok: false; rowNum: number; error: string };

function parseAmountToPence(raw: string): number | null {
  const cleaned = String(raw ?? "").replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const value = parseFloat(cleaned);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100);
}

/**
 * "01/01/2026 - 29/05/2026" (DD/MM/YYYY - DD/MM/YYYY) -> "2026-05-29"
 * Uses the END of the billing period as the invoice's issue date.
 */
function parsePeriodEndDate(period: string): string | null {
  const match = String(period ?? "").match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/
  );
  if (!match) return null;
  const [, , , , dd, mm, yyyy] = match;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

const MAX_ROWS = 500;

export function parseInvoiceExportRows(buffer: Buffer): ParsedInvoiceRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const sheet = workbook.Sheets[firstSheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => String(h ?? "").trim());
  const codeIdx = headers.indexOf("Code");
  const amountIdx = headers.indexOf("Amount Adj Total");
  const periodIdx = headers.indexOf("Period");

  if (codeIdx === -1 || amountIdx === -1) {
    return [
      {
        ok: false,
        rowNum: 1,
        error:
          'Couldn\'t find "Code" and "Amount Adj Total" columns in the first row — is this the right export?',
      },
    ];
  }

  const dataRows = rows
    .slice(1, 1 + MAX_ROWS)
    .map((row, i) => ({ row, rowNum: i + 2 })) // +2: skip header row, 1-index for humans
    .filter(({ row }) => row.some((cell) => String(cell ?? "").trim() !== ""));

  return dataRows.map(({ row, rowNum }) => {
    const invoiceNumber = String(row[codeIdx] ?? "").trim();
    if (!invoiceNumber) {
      return { ok: false, rowNum, error: "Missing invoice number (Code column)" };
    }

    const amountPence = parseAmountToPence(String(row[amountIdx] ?? ""));
    if (amountPence === null || amountPence <= 0) {
      return { ok: false, rowNum, error: `Invoice ${invoiceNumber}: couldn't read amount` };
    }

    const issueDate =
      periodIdx !== -1 ? parsePeriodEndDate(String(row[periodIdx] ?? "")) : null;

    return { ok: true, rowNum, invoiceNumber, amountPence, issueDate };
  });
}
