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
    <header className="border-b border-slate-200/90 bg-white sticky top-0 z-40">
      {/* Top Protocol / Status Header */}
      <div className="bg-slate-950 text-slate-200 text-xs px-4 py-1.5 font-sans border-b border-slate-900">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border border-slate-700">
              Prototype
            </span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              Independent Statistical Research Environment • UK National Accounts
            </span>
            <span className="text-slate-400 sm:hidden text-[11px]">Independent Research Lab</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Data Benchmark: <strong className="text-slate-200">Blue Book / SUT 2023</strong></span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline font-mono text-slate-400">v0.2.0-research</span>
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded p-0.5"
        >
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors shrink-0">
            <span className="text-[10px] font-extrabold leading-none tracking-tight">UK</span>
            <span className="text-[7.5px] font-semibold text-slate-400 leading-none tracking-wider mt-0.5">LAB</span>
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-slate-700 transition-colors">
              UK AI Economic Measurement Lab
            </div>
            <div className="text-xs text-slate-500 font-normal">
              National Accounts Thematic Research Prototype
            </div>
          </div>
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Navigation Bar */}
      <nav
        className="hidden lg:block border-t border-slate-100 bg-slate-50/60"
        aria-label="Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-slate-900',
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
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
                    ? 'bg-slate-900 text-white font-semibold'
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

