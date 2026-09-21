'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Overview' },
  { href: '/stack', label: 'AI Production Stack' },
  { href: '/supply-use', label: 'Supply & Use' },
  { href: '/disaggregation', label: 'Disaggregation' },
  { href: '/classifier', label: 'Classifier' },
  { href: '/sna-decision', label: 'SNA Decision' },
  { href: '/adoption', label: 'Adoption' },
  { href: '/gaps', label: 'Measurement Gaps' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/quality', label: 'QA & Validation' },
  { href: '/sources', label: 'Sources' }
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Prototype Phase Header Banner */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between font-sans">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Prototype
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Independent Research Environment for UK AI Economic Measurement
            </span>
            <span className="text-slate-300 sm:hidden">Independent Research Lab</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Data Vintage: <strong>Blue Book 2025 / SUT 2023</strong></span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline font-mono">v0.2.0-experimental</span>
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-govuk-blue rounded p-1"
        >
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs font-mono tracking-wider shadow-xs group-hover:bg-govuk-blue transition-colors">
            AI
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-govuk-blue transition-colors">
              UK AI Economic Measurement Lab
            </div>
            <div className="text-xs text-slate-500 font-medium">
              National Accounts Thematic Research Prototype
            </div>
          </div>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-govuk-blue"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation Bar */}
      <nav
        className="hidden lg:block border-t border-slate-100 bg-slate-50/80"
        aria-label="Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-govuk-blue',
                  isActive
                    ? 'bg-govuk-blue text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-1 shadow-lg"
          aria-label="Mobile Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-govuk-blue text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};
