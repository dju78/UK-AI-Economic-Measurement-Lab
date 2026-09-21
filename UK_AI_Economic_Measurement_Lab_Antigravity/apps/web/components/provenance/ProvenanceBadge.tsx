import React from 'react';
import { StatisticalStatus } from '@packages/schemas';
import { cn } from '@/lib/utils';
import { ShieldCheck, BookOpen, FlaskConical } from 'lucide-react';

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
  let badgeStyle = 'bg-slate-100 text-slate-800 border-slate-300';
  let Icon = BookOpen;

  if (status === 'Published official-statistics source') {
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    Icon = ShieldCheck;
  } else if (status === 'Published research/context source') {
    badgeStyle = 'bg-sky-50 text-sky-800 border-sky-300';
    Icon = BookOpen;
  } else if (status === 'Illustrative experimental estimate' || status === 'Prototype output') {
    badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
    Icon = FlaskConical;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-govuk-blue cursor-pointer',
        badgeStyle,
        className
      )}
      title="Click to view full provenance and methodology details"
      aria-label={`Statistical status: ${status}. Source: ${sourceId || 'Documented'}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
      {sourceId && (
        <span className="font-mono font-semibold bg-white/80 px-1 py-0.5 rounded text-[10px] ml-0.5">
          {sourceId}
        </span>
      )}
    </button>
  );
};
