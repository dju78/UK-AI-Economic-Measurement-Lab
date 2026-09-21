import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'UK AI Economic Measurement Lab | National Accounts Thematic Research',
  description: 'An independent statistical research prototype for measuring artificial intelligence in the UK economy using National Accounts and Supply & Use principles.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full font-sans antialiased text-slate-900 bg-slate-50 selection:bg-govuk-blue selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-300 focus:text-black focus:font-bold"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
