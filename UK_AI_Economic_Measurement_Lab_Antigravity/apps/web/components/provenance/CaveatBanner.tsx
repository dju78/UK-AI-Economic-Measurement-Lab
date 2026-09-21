import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CaveatBannerProps {
  type?: 'broad_warning' | 'experimental_warning' | 'info';
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export const CaveatBanner: React.FC<CaveatBannerProps> = ({
  type = 'broad_warning',
  title,
  children,
  className
}) => {
  if (type === 'broad_warning') {
    return (
      <div
        role="alert"
        className={cn(
          'border-l-3 border-amber-600 bg-amber-50/70 p-4 rounded-r-md text-amber-950 my-4',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5 stroke-[1.75]" aria-hidden="true" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <p className="font-bold text-amber-950 mb-1">
              {title || 'Important Statistical Guardrail: Broad Product Totals are NOT AI Output'}
            </p>
            <div className="text-amber-900/90">
              {children || (
                <p>
                  These published broad CPA product totals contain both AI and non-AI economic activity.
                  In accordance with ONS methodology (S1), broad totals represent candidate denominators for disaggregation,
                  not the value of the AI economy.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'experimental_warning') {
    return (
      <div
        role="alert"
        className={cn(
          'border-l-3 border-slate-700 bg-slate-100/70 p-4 rounded-r-md text-slate-900 my-4',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-slate-700 shrink-0 mt-0.5 stroke-[1.75]" aria-hidden="true" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <p className="font-bold text-slate-900 mb-1">
              {title || 'Illustrative Experimental Research Output'}
            </p>
            <div className="text-slate-700">
              {children || (
                <p>
                  This decomposition is a research scenario produced by the UK AI Economic Measurement Lab.
                  It depends on explicit assumption sets and is not an official ONS National Accounts statistical release.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="note"
      className={cn(
        'border-l-3 border-slate-400 bg-slate-50 p-4 rounded-r-md text-slate-800 my-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 stroke-[1.75]" aria-hidden="true" />
        <div className="text-xs sm:text-sm leading-relaxed">
          {title && <p className="font-bold text-slate-900 mb-1">{title}</p>}
          <div className="text-slate-700">{children}</div>
        </div>
      </div>
    </div>
  );
};

