import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300 text-xs font-sans mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 pb-10 border-b border-slate-900">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 text-white font-mono flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-extrabold leading-none">UK</span>
                <span className="text-[7.5px] font-semibold text-slate-400 leading-none mt-0.5">LAB</span>
              </div>
              <span className="font-bold text-white text-sm">UK AI Economic Measurement Lab</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              An independent statistical research prototype examining how artificial intelligence
              activity can be identified, classified, disaggregated, and reconciled within the UK National Accounts and Supply & Use Tables framework.
            </p>
            <div className="p-3.5 bg-slate-900/90 rounded border border-slate-800 text-[11px] text-slate-300 leading-normal max-w-lg">
              <strong className="text-amber-300">Independence Notice:</strong> This project is an independent research prototype by Daramola Omoyele.
              It is not an Office for National Statistics (ONS) product, is not endorsed by ONS, and does not present official statistics.
            </div>
          </div>

          <div>
            <h3 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3.5">
              Research Modules
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/stack" className="hover:text-white transition-colors">AI Production Stack</Link></li>
              <li><Link href="/supply-use" className="hover:text-white transition-colors">Supply & Use Explorer</Link></li>
              <li><Link href="/disaggregation" className="hover:text-white transition-colors">Disaggregation Lab</Link></li>
              <li><Link href="/classifier" className="hover:text-white transition-colors">Business Classifier</Link></li>
              <li><Link href="/sna-decision" className="hover:text-white transition-colors">SNA Decision Engine</Link></li>
              <li><Link href="/adoption" className="hover:text-white transition-colors">Adoption Context (BICS)</Link></li>
              <li><Link href="/gaps" className="hover:text-white transition-colors">Measurement Gaps</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-3.5">
              Methodology & Standards
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li><Link href="/methodology" className="hover:text-white transition-colors">Method Cards & Formulas</Link></li>
              <li><Link href="/quality" className="hover:text-white transition-colors">QA & Validation Report</Link></li>
              <li><Link href="/sources" className="hover:text-white transition-colors">Data Source Register</Link></li>
              <li>
                <a
                  href="https://www.ons.gov.uk/economy/nationalaccounts/satelliteaccounts/methodologies/measuringartificialintelligenceintheukeconomyusingathematicaccount"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-slate-400"
                >
                  ONS Thematic Paper (S1) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://code.statisticsauthority.gov.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-slate-400"
                >
                  Code of Practice (S10) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} UK AI Economic Measurement Lab. Published under Open Government Licence v3.0 / MIT.
          </div>
          <div className="flex items-center gap-4">
            <span>WCAG 2.2 AA Conforming Principles</span>
            <span>•</span>
            <span>Deterministic Pipelines</span>
            <span>•</span>
            <span>v0.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

