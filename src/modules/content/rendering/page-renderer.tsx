import type { RowLayout } from '../domain/types/page-builder.types';
import { resolvePageData } from './data-resolver';
import { RowRenderer } from './row-renderer';

interface PageRendererProps {
  rows: RowLayout[];
}

export async function PageRenderer({ rows }: PageRendererProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  // Pre-resolve all external data requirements in parallel
  const resolvedData = await resolvePageData(rows);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {rows.map((row) => (
        <RowRenderer key={row.id} row={row} data={resolvedData} />
      ))}
    </div>
  );
}
