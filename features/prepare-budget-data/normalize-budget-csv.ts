type NormalizedBudgetRow = Record<string, string | number> & {
  fiscalYear: number;
};

const HEADER_NAMES: Record<string, string> = {
  年度: "fiscalYear",
  区分: "category",
  種別: "category",
  区分2: "subcategory",
  区分２: "subcategory",
  基金名: "fundName",
  区分3: "detail",
  "金額（億円）": "amount100mYen",
  内容: "description",
  備考: "note",
  "都債残高（億円）": "bondBalance100mYen",
  "都債発行額（億円）": "bondIssuance100mYen",
};

const NUMERIC_FIELDS = new Set([
  "fiscalYear",
  "amount100mYen",
  "bondBalance100mYen",
  "bondIssuance100mYen",
]);

export const parseCsv = (csv: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (quoted) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
    rows.push(row);
  }

  return rows;
};

const numberFromCsv = (value: string) => {
  const normalized = value.replaceAll(",", "").replace("△", "-").trim();
  return normalized === "" ? 0 : Number(normalized);
};

export const normalizeBudgetCsv = (
  csv: string,
  fiscalYear: number,
): NormalizedBudgetRow[] => {
  const [rawHeaders, ...rows] = parseCsv(csv);
  const headers = rawHeaders.map((header, index) => {
    const cleanHeader = index === 0 ? header.replace(/^\uFEFF/, "") : header;
    return HEADER_NAMES[cleanHeader] ?? cleanHeader;
  });

  return rows
    .filter(row => numberFromCsv(row[0] ?? "") === fiscalYear)
    .map(row => Object.fromEntries(
      headers.map((header, index) => {
        const value = row[index] ?? "";
        return [header, NUMERIC_FIELDS.has(header) ? numberFromCsv(value) : value];
      }),
    ) as NormalizedBudgetRow);
};
