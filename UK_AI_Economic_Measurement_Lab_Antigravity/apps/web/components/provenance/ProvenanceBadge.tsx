import React from 'react';
import { StatisticalStatus } from '@packages/schemas';
import { cn } from '@/lib/utils';
import { ShieldCheck, BookOpen, Layers } from 'lucide-react';

interface ProvenanceBadgeProps {
  status: StatisticalStatus;
  sourceId?: string;
  className?: string;
  onClick?: () => void;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  status,
  sourceId,
  className,
  onClick
}) => {
  let badgeStyle = 'bg-slate-100/80 text-slate-700 border-slate-200';
  let Icon = BookOpen;

  if (status === 'Published official-statistics source') {
    badgeStyle = 'bg-emerald-50/80 text-emerald-800 border-emerald-200/90';
    Icon = ShieldCheck;
  } else if (status === 'Published research/context source') {
    badgeStyle = 'bg-sky-50/80 text-slate-700 border-sky-200/90';
    Icon = BookOpen;
  } else if (status === 'Illustrative experimental estimate' || status === 'Prototype output') {
    badgeStyle = 'bg-amber-50/80 text-amber-900 border-amber-200/90';
    Icon = Layers;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer',
        badgeStyle,
        className
      )}
      title="Click to view full provenance and methodology details"
      aria-label={`Statistical status: ${status}. Source: ${sourceId || 'Documented'}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0 stroke-[1.5]" aria-hidden="true" />
      <span>{status}</span>
      {sourceId && (
        <span className="font-mono font-semibold bg-white/90 px-1 py-0.2 rounded text-[10px] ml-0.5 border border-slate-200/60 text-slate-700">
          {sourceId}
        </span>
      )}
    </button>
  );
};

