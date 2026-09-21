import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const CANONICAL_URL = 'https://ai-measurement.jomovate.com';
const APP_TITLE = 'UK AI Economic Measurement Lab | Measuring AI in the UK Economy';
const APP_DESCRIPTION =
  'Independent research prototype exploring how artificial intelligence activity can be identified, classified and disaggregated within UK National Accounts and Supply & Use frameworks.';

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: APP_TITLE,
    template: '%s | UK AI Economic Measurement Lab'
  },
  description: APP_DESCRIPTION,
  applicationName: 'UK AI Economic Measurement Lab',
  authors: [{ name: 'Daramola Omoyele', url: CANONICAL_URL }],
  creator: 'Daramola Omoyele',
  publisher: 'Daramola Omoyele',
  keywords: [
    'UK AI Economy',
    'Economic Measurement',
    'National Accounts',
    'Supply and Use Tables',
    'SUT',
    'Gross Value Added',
    'GVA',
    'SNA 2008',
    'ESA 2010',
    'Asset Boundary',
    'AI Disaggregation',
    'AI Business Classification',
    'Daramola Omoyele',
    'Statistical Methodology'
  ],
  alternates: {
    canonical: CANONICAL_URL
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: CANONICAL_URL,
    siteName: 'UK AI Economic Measurement Lab',
    title: APP_TITLE,
    description: APP_DESCRIPTION
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: APP_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'UK AI Economic Measurement Lab',
  alternateName: 'UK AI Measurement Lab',
  url: CANONICAL_URL,
  description: APP_DESCRIPTION,
  applicationCategory: 'Economics & Statistical Research Application',
  operatingSystem: 'All (Web Application)',
  author: {
    '@type': 'Person',
    name: 'Daramola Omoyele'
  },
  creator: {
    '@type': 'Person',
    name: 'Daramola Omoyele'
  },
  license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  isAccessibleForFree: true
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
