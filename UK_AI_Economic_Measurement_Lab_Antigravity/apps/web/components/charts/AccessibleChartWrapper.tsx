import React, { useState } from 'react';
import { BarChart3, Table as TableIcon, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccessibleChartWrapperProps {
  title: string;
  subtitle?: string;
  sourceNote?: string;
  tableData: Array<Record<string, any>>;
  tableColumns: Array<{ key: string; header: string; format?: (val: any) => string }>;
  children: React.ReactNode;
  className?: string;
  exportFileName?: string;
}

export const AccessibleChartWrapper: React.FC<AccessibleChartWrapperProps> = ({
  title,
  subtitle,
  sourceNote,
  tableData,
  tableColumns,
  children,
  className,
  exportFileName = 'data_export'
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const downloadCsv = () => {
    if (!tableData.length) return;
    const headers = tableColumns.map((c) => `"${c.header}"`).join(',');
    const rows = tableData.map((row) =>
      tableColumns.map((c) => {
        const val = row[c.key];
        return typeof val === 'string' ? `"${val}"` : val;
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn('bg-white rounded-lg border border-slate-200 p-5 shadow-xs', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-md flex items-center gap-1 text-xs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'chart'}
              onClick={() => setViewMode('chart')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-govuk-blue',
                viewMode === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Chart</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'table'}
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-govuk-blue',
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <TableIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={downloadCsv}
            title="Download CSV table"
            aria-label="Download data as CSV"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-govuk-blue text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      <div className="pt-4">
        {viewMode === 'chart' ? (
          <div className="w-full overflow-hidden" role="figure" aria-label={title}>
            {children}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                  {tableColumns.map((col) => (
                    <th key={col.key} scope="col" className="p-2.5">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    {tableColumns.map((col) => (
                      <td key={col.key} className="p-2.5 font-mono">
                        {col.format ? col.format(row[col.key]) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {sourceNote && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Source: {sourceNote}</span>
          <span className="text-slate-400">UK AI Economic Measurement Lab</span>
        </div>
      )}
    </div>
  );
};
