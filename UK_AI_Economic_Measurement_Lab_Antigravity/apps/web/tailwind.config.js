/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        govuk: {
          blue: '#1d70b8',
          darkBlue: '#003078',
          text: '#0b0c0c',
          secondary: '#505a5f',
          border: '#b1b4b6',
          canvas: '#f3f2f1',
          green: '#00703c',
          yellow: '#ffdd00',
          red: '#d4351c',
          lightBlue: '#2b8cc4'
        },
        lab: {
          slate: '#0f172a',
          navy: '#1e293b',
          accent: '#2563eb',
          accentHover: '#1d4ed8',
          surface: '#ffffff',
          subtle: '#f8fafc',
          border: '#e2e8f0',
          warningBg: '#fffbeb',
          warningBorder: '#fde68a',
          warningText: '#92400e',
          successBg: '#f0fdf4',
          successBorder: '#bbf7d0',
          successText: '#166534',
          infoBg: '#eff6ff',
          infoBorder: '#bfdbfe',
          infoText: '#1e40af'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Open Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      }
    }
  },
  plugins: []
};
