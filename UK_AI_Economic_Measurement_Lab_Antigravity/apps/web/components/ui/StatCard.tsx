import React from 'react';
import { StatisticalStatus } from '@packages/schemas';
import { ProvenanceBadge } from '../provenance/ProvenanceBadge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  status?: StatisticalStatus;
  sourceId?: string;
  icon?: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
  onClickProvenance?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtext,
  status = 'Published official-statistics source',
  sourceId,
  icon: Icon,
  trend,
  trendPositive,
  className,
  onClickProvenance
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs',
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0 stroke-[1.5]" aria-hidden="true" />}
        </div>

        <div className="flex items-baseline gap-2 my-1">
          <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900">
            {value}
          </span>
          {unit && <span className="text-xs text-slate-500 font-normal">{unit}</span>}
        </div>

        {trend && (
          <div className="flex items-center gap-1 text-xs mt-1.5">
            <span
              className={cn(
                'font-medium text-[11px]',
                trendPositive ? 'text-emerald-700' : 'text-slate-600'
              )}
            >
              {trend}
            </span>
          </div>
        )}

        {subtext && <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{subtext}</p>}
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <ProvenanceBadge
          status={status}
          sourceId={sourceId}
          onClick={onClickProvenance}
          className="text-[11px] py-0.5"
        />
      </div>
    </div>
  );
};

