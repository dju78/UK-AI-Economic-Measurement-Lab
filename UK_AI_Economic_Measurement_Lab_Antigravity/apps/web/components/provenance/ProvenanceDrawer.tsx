import React from 'react';
import { X, ExternalLink, Database, FileText, Calendar, Scale, Layers } from 'lucide-react';
import { ProvenanceMeta } from '@packages/schemas';
import { ProvenanceBadge } from './ProvenanceBadge';

interface ProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metadata?: ProvenanceMeta | null;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  isOpen,
  onClose,
  metadata
}) => {
  if (!isOpen || !metadata) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provenance-title"
    >
      <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-govuk-blue" aria-hidden="true" />
              <h2 id="provenance-title" className="text-lg font-bold text-slate-900">
                Data Provenance & Lineage
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-govuk-blue"
              aria-label="Close provenance drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Statistical Classification
              </span>
              <ProvenanceBadge status={metadata.statistical_status} sourceId={metadata.source_id} />
            </div>

            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                {metadata.source_title}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-medium text-slate-700">Publisher:</span> {metadata.publisher}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Reference Period
                </div>
                <div className="font-semibold text-slate-800">{metadata.reference_period}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
                  <Layers className="w-3.5 h-3.5" /> Unit & Basis
                </div>
                <div className="font-semibold text-slate-800">{metadata.unit}</div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Source Release Date</span>
                <span className="font-mono text-slate-700">{metadata.release_date}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Acquisition / Vintage</span>
                <span className="font-mono text-slate-700">{metadata.retrieved_at.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Transformation Version</span>
                <span className="font-mono text-slate-700">{metadata.transformation_version}</span>
              </div>
              {metadata.method_id && (
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Method Identifier</span>
                  <span className="font-mono text-slate-700">{metadata.method_id}</span>
                </div>
              )}
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" /> Data Licence
                </span>
                <span className="font-medium text-emerald-700">{metadata.licence}</span>
              </div>
            </div>

            {metadata.notes && (
              <div className="bg-amber-50/60 p-3 rounded border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold block mb-1">Methodological Note:</span>
                {metadata.notes}
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <a
            href="/sources"
            className="text-xs text-govuk-blue font-medium hover:underline inline-flex items-center gap-1"
          >
            View full Source Register <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-govuk-blue"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
