export type CsvRow = Record<string, string | number | boolean | null | undefined>;

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function buildCsv(rows: CsvRow[], headers?: string[]): string {
  if (!rows.length) {
    return headers ? headers.join(',') + '\n' : '';
  }
  const cols = headers ?? Object.keys(rows[0]);
  const lines = [cols.join(',')];
  for (const row of rows) {
    lines.push(cols.map((c) => escapeCsv(row[c])).join(','));
  }
  return lines.join('\n');
}

export async function exportStudentsToCsv(rows: CsvRow[], filename: string): Promise<void> {
  // Simulate small latency to show loading
  await new Promise((r) => setTimeout(r, 300));
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : filename + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

